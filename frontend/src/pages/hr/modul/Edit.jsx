function HRModulEdit({
  editModuleId,
  editModuleForm,
  setEditModuleForm,
  onUpdateModule,
  loading,
}) {
  return (
    <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Edit Modul</h2>
      <form className="space-y-3" onSubmit={onUpdateModule}>
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Module ID"
          value={editModuleId}
          readOnly
        />
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Judul"
          value={editModuleForm.judul}
          onChange={(event) =>
            setEditModuleForm((prev) => ({
              ...prev,
              judul: event.target.value,
            }))
          }
        />
        <textarea
          className="glass-input min-h-20 w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Deskripsi"
          value={editModuleForm.deskripsi}
          onChange={(event) =>
            setEditModuleForm((prev) => ({
              ...prev,
              deskripsi: event.target.value,
            }))
          }
        />
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Link Materi"
          value={editModuleForm.linkMateri}
          onChange={(event) =>
            setEditModuleForm((prev) => ({
              ...prev,
              linkMateri: event.target.value,
            }))
          }
        />
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Target Skills (pisahkan koma)"
          value={editModuleForm.targetSkills}
          onChange={(event) =>
            setEditModuleForm((prev) => ({
              ...prev,
              targetSkills: event.target.value,
            }))
          }
        />
        <button
          type="submit"
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
          disabled={loading}
        >
          Update Modul
        </button>
      </form>
    </div>
  );
}

export default HRModulEdit;
