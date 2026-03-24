function KaryawanDashboardPage({
  user,
  loading,
  modules,
  logs,
  onLogout,
  skillsInput,
  setSkillsInput,
  onUpdateSkills,
  createLogModuleId,
  setCreateLogModuleId,
  completeLogId,
  setCompleteLogId,
  onCreateLog,
  onCompleteLog,
}) {
  return (
    <section className="auth-bg relative min-h-screen w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />
      <div className="auth-grid" />

      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-6">
        <header className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Karyawan Dashboard
              </h1>
              <p className="text-sm text-slate-700">
                Employee Skill Matcher & Training Hub
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <p className="text-sm text-slate-800">
                Login sebagai <span className="font-semibold">{user.nama}</span>{" "}
                ({user.role})
              </p>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Daftar Modul
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((moduleItem) => (
              <article
                key={moduleItem._id}
                className="rounded-xl border border-slate-300/40 bg-white/45 p-4"
              >
                <p className="text-xs text-slate-600">ID: {moduleItem._id}</p>
                <h3 className="mt-1 text-base font-semibold text-slate-900">
                  {moduleItem.judul}
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  {moduleItem.deskripsi}
                </p>
                <a
                  className="mt-2 block break-all text-sm text-blue-700"
                  href={moduleItem.linkMateri}
                  rel="noreferrer"
                  target="_blank"
                >
                  {moduleItem.linkMateri}
                </a>
                <p className="mt-2 text-xs text-slate-700">
                  Target Skills: {(moduleItem.targetSkills || []).join(", ")}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Profile & Progress
            </h2>

            <form className="mb-6 space-y-3" onSubmit={onUpdateSkills}>
              <h3 className="text-sm font-semibold text-slate-800">
                Update Skills Profile
              </h3>
              <input
                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
                placeholder="Skills (pisahkan koma)"
                value={skillsInput}
                onChange={(event) => setSkillsInput(event.target.value)}
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
                disabled={loading}
              >
                Simpan Skills
              </button>
            </form>

            <form className="mb-6 space-y-3" onSubmit={onCreateLog}>
              <h3 className="text-sm font-semibold text-slate-800">
                Mulai Modul (Buat Log)
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
              <input
                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
                placeholder="Log ID"
                value={completeLogId}
                onChange={(event) => setCompleteLogId(event.target.value)}
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-400"
                disabled={loading}
              >
                Set Status Selesai
              </button>
            </form>
          </div>

          {logs.length > 0 ? (
            <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                Log Terakhir Kamu
              </h2>
              <div className="space-y-3 text-sm">
                {logs.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-lg border border-slate-300/40 bg-white/45 px-3 py-2"
                  >
                    <p className="text-xs text-slate-600">ID: {item._id}</p>
                    <p className="font-medium text-slate-900">
                      {item.module_id?.judul || "Module"}
                    </p>
                    <p className="text-slate-700">Status: {item.status}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default KaryawanDashboardPage;
