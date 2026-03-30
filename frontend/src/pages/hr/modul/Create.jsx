import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HRModulCreate({
  newModuleForm,
  setNewModuleForm,
  onCreateModule,
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
    setNewModuleForm((prev) => {
      const list = Array.isArray(prev.targetSkills)
        ? [...prev.targetSkills]
        : [];
      const idx = list.indexOf(skillId);
      if (idx === -1) list.push(skillId);
      else list.splice(idx, 1);
      return { ...prev, targetSkills: list };
    });
  };

  const selectedNames = (newModuleForm.targetSkills || [])
    .map((id) => {
      const s = skills.find((sk) => sk._id === id);
      return s ? s.nama : id;
    })
    .filter(Boolean)
    .slice(0, 5)
    .join(", ");

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
        <textarea
          className="glass-input min-h-20 w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Goals Module"
          value={newModuleForm.goalsModule || ""}
          onChange={(event) =>
            setNewModuleForm((prev) => ({
              ...prev,
              goalsModule: event.target.value,
            }))
          }
          required
        />
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Link Materi (opsional jika upload file)"
          value={newModuleForm.linkMateri}
          onChange={(event) =>
            setNewModuleForm((prev) => ({
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
            setNewModuleForm((prev) => ({
              ...prev,
              materiFiles: Array.from(event.target.files || []),
            }))
          }
        />
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
                        checked={(newModuleForm.targetSkills || []).includes(
                          skill._id,
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
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
            disabled={loading}
          >
            Tambah Modul
          </button>
        </div>
      </form>
    </div>
  );
}

export default HRModulCreate;
