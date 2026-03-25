function ActionsPanel({
  loading,
  modules,
  logs,
  createLogModuleId,
  setCreateLogModuleId,
  onCreateLog,
  completeLogId,
  setCompleteLogId,
  onCompleteLog,
}) {
  const openLogs = (logs || []).filter((item) => item.status !== "Selesai");

  return (
    <section className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Aksi Karyawan
      </h2>

      <form className="mb-6 space-y-3" onSubmit={onCreateLog}>
        <h3 className="text-sm font-semibold text-slate-800">
          Mulai Modul (Buat Progress Log)
        </h3>
        <select
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
          value={createLogModuleId}
          onChange={(event) => setCreateLogModuleId(event.target.value)}
          required
        >
          <option value="">Pilih Modul</option>
          {modules.map((moduleItem) => (
            <option key={moduleItem._id} value={moduleItem._id}>
              {moduleItem.judul}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
          disabled={loading}
        >
          Buat Progress Log
        </button>
      </form>

      <form className="space-y-3" onSubmit={onCompleteLog}>
        <h3 className="text-sm font-semibold text-slate-800">
          Selesaikan Progress Log
        </h3>
        <select
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
          value={completeLogId}
          onChange={(event) => setCompleteLogId(event.target.value)}
          required
        >
          <option value="">Pilih Log yang belum selesai</option>
          {openLogs.map((item) => (
            <option key={item._id} value={item._id}>
              {item.module_id?.judul || "Modul"} - {item._id}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-400"
          disabled={loading}
        >
          Set Status Selesai
        </button>
      </form>
    </section>
  );
}

export default ActionsPanel;
