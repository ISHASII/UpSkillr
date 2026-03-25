import { useNavigate } from "react-router-dom";

function HRModulEdit({
  editModuleId,
  editModuleForm,
  setEditModuleForm,
  onUpdateModule,
  loading,
  skills,
}) {
  const navigate = useNavigate();
  const toggleSkill = (skillId) => {
    setEditModuleForm((prev) => {
      const list = Array.isArray(prev.targetSkills)
        ? [...prev.targetSkills]
        : [];
      const idx = list.indexOf(skillId);
      if (idx === -1) list.push(skillId);
      else list.splice(idx, 1);
      return { ...prev, targetSkills: list };
    });
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Edit Modul</h2>
      <form className="space-y-3" onSubmit={onUpdateModule}>
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

        <div>
          <div className="mb-2 text-sm font-medium text-slate-800">
            Target Skills
          </div>
          <div className="grid grid-cols-2 gap-2">
            {skills.length ? (
              skills.map((skill) => (
                <label key={skill._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(editModuleForm.targetSkills || []).some(
                      (s) => s === skill._id || s?._id === skill._id,
                    )}
                    onChange={() => toggleSkill(skill._id)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-slate-700">{skill.nama}</span>
                </label>
              ))
            ) : (
              <div className="text-sm text-slate-500">
                Belum ada skill tersedia
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard/hr/modul")}
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-300"
          >
            Back
          </button>

          <button
            type="submit"
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
            disabled={loading}
          >
            Update Modul
          </button>
        </div>
      </form>
    </div>
  );
}

export default HRModulEdit;
