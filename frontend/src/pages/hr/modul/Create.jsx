function HRModulCreate({
  newModuleForm,
  setNewModuleForm,
  onCreateModule,
  loading,
}) {
  return (
    <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Tambah Modul
      </h2>
      <form className="space-y-3" onSubmit={onCreateModule}>
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Judul"
          value={newModuleForm.judul}
          onChange={(event) =>
            setNewModuleForm((prev) => ({ ...prev, judul: event.target.value }))
          }
          required
        />
        <textarea
          className="glass-input min-h-20 w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Deskripsi"
          value={newModuleForm.deskripsi}
          onChange={(event) =>
            setNewModuleForm((prev) => ({
              ...prev,
              deskripsi: event.target.value,
            }))
          }
          required
        />
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Link Materi"
          value={newModuleForm.linkMateri}
          onChange={(event) =>
            setNewModuleForm((prev) => ({
              ...prev,
              linkMateri: event.target.value,
            }))
          }
          required
        />
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Target Skills (pisahkan koma)"
          value={newModuleForm.targetSkills}
          onChange={(event) =>
            setNewModuleForm((prev) => ({
              ...prev,
              targetSkills: event.target.value,
            }))
          }
          required
        />
        <button
          type="submit"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
          disabled={loading}
        >
          Tambah Modul
        </button>
      </form>
    </div>
  );
}

export default HRModulCreate;
