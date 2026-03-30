import { useState, useRef, useEffect } from "react";
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

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

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

  const selectedNames = (editModuleForm.targetSkills || [])
    .map((idOrObj) => {
      const id = idOrObj && idOrObj._id ? idOrObj._id : idOrObj;
      const s = skills.find((sk) => sk._id === id);
      return s ? s.nama : id;
    })
    .filter(Boolean)
    .slice(0, 5)
    .join(", ");

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
        <textarea
          className="glass-input min-h-20 w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Goals Module"
          value={editModuleForm.goalsModule || ""}
          onChange={(event) =>
            setEditModuleForm((prev) => ({
              ...prev,
              goalsModule: event.target.value,
            }))
          }
        />
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Link Materi (opsional jika upload file)"
          value={editModuleForm.linkMateri}
          onChange={(event) =>
            setEditModuleForm((prev) => ({
              ...prev,
              linkMateri: event.target.value,
            }))
          }
        />
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none file:mr-3 file:rounded-md file:border-0 file:bg-indigo-500 file:px-3 file:py-1 file:text-white"
          type="file"
          multiple
          onChange={(event) =>
            setEditModuleForm((prev) => ({
              ...prev,
              materiFiles: Array.from(event.target.files || []),
            }))
          }
        />
        {(editModuleForm.existingMateriFiles || []).length ? (
          <div className="text-xs text-slate-700">
            <div className="mb-1 font-medium">File materi saat ini:</div>
            <ul className="list-disc space-y-1 pl-4">
              {editModuleForm.existingMateriFiles.map((filePath) => (
                <li key={filePath}>{filePath}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="text-xs text-slate-600">
          Wajib isi minimal salah satu: Link Materi atau File Materi.
        </p>

        <div ref={ref} className="relative">
          <div className="mb-2 text-sm font-medium text-slate-800">
            Target Skills
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="glass-input w-full rounded-lg px-3 py-2 text-left text-sm text-white outline-none placeholder:text-slate-300"
          >
            {selectedNames || "Pilih target skills..."}
          </button>

          {open && (
            <div className="absolute z-50 mt-2 max-h-56 w-full overflow-auto rounded-md bg-white p-3 shadow-lg ring-1 ring-slate-200">
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
                      <span className="text-sm text-slate-700">
                        {skill.nama}
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="text-sm text-slate-500">
                    Belum ada skill tersedia
                  </div>
                )}
              </div>
            </div>
          )}
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
