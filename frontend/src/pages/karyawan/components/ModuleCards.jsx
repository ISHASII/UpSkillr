import { useMemo, useState } from "react";

const resolveSkillName = (skill) => {
  if (!skill) return "";
  if (typeof skill === "string") return skill;
  return skill.nama || skill._id || "";
};

const statusClass = {
  "Sedang Berjalan": "bg-sky-100 text-sky-800",
  "Menunggu Validasi HR": "bg-amber-100 text-amber-800",
  "Perlu Revisi": "bg-rose-100 text-rose-800",
  Lulus: "bg-emerald-100 text-emerald-800",
};

function ModuleCards({ modules, logs, loading, onEnrollModule, onSubmitTask }) {
  const [submission, setSubmission] = useState({});

  const logByModule = useMemo(() => {
    const map = {};
    (logs || []).forEach((item) => {
      const moduleId = item.module_id?._id || item.module_id;
      if (moduleId) map[moduleId] = item;
    });
    return map;
  }, [logs]);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <section className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Daftar Modul
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.length ? (
          modules.map((moduleItem) => {
            const progress = logByModule[moduleItem._id];
            const currentSubmission = submission[moduleItem._id] || {
              submissionLink: "",
              files: [],
            };

            const canSubmit =
              progress &&
              (progress.status === "Sedang Berjalan" ||
                progress.status === "Perlu Revisi");

            return (
              <article
                key={moduleItem._id}
                className="rounded-xl border border-slate-300/40 bg-white/45 p-4"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {moduleItem.judul}
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  {moduleItem.deskripsi}
                </p>
                <p className="mt-2 text-xs text-slate-700">
                  Goals: {moduleItem.goalsModule || "-"}
                </p>
                <p className="mt-2 text-xs text-slate-700">
                  Target Skills:{" "}
                  {(moduleItem.targetSkills || [])
                    .map(resolveSkillName)
                    .filter(Boolean)
                    .join(", ") || "-"}
                </p>

                <div className="mt-3 space-y-1 text-xs">
                  {moduleItem.linkMateri ? (
                    <a
                      href={moduleItem.linkMateri}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-blue-700 underline"
                    >
                      Buka Link Materi
                    </a>
                  ) : null}
                  {(moduleItem.materiFiles || []).map((filePath) => (
                    <a
                      key={filePath}
                      href={`${apiBase}${filePath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-blue-700 underline"
                    >
                      Buka File Materi
                    </a>
                  ))}
                </div>

                <div className="mt-3">
                  {progress ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass[progress.status] || "bg-slate-200 text-slate-700"}`}
                    >
                      {progress.status}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onEnrollModule(moduleItem._id)}
                      className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-400"
                      disabled={loading}
                    >
                      Daftar Modul
                    </button>
                  )}
                </div>

                {progress?.hrFeedback ? (
                  <p className="mt-2 text-xs text-amber-800">
                    Catatan HR: {progress.hrFeedback}
                  </p>
                ) : null}

                {canSubmit ? (
                  <form
                    className="mt-3 space-y-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      onSubmitTask(progress._id, currentSubmission);
                    }}
                  >
                    <input
                      className="glass-input w-full rounded-lg px-3 py-2 text-xs text-white outline-none placeholder:text-slate-300"
                      placeholder="Link tugas (opsional jika upload file)"
                      value={currentSubmission.submissionLink}
                      onChange={(event) =>
                        setSubmission((prev) => ({
                          ...prev,
                          [moduleItem._id]: {
                            ...(prev[moduleItem._id] || {
                              submissionLink: "",
                              files: [],
                            }),
                            submissionLink: event.target.value,
                          },
                        }))
                      }
                    />
                    <input
                      type="file"
                      multiple
                      className="glass-input w-full rounded-lg px-3 py-2 text-xs text-white outline-none file:mr-2 file:rounded-md file:border-0 file:bg-indigo-500 file:px-2 file:py-1 file:text-white"
                      onChange={(event) =>
                        setSubmission((prev) => ({
                          ...prev,
                          [moduleItem._id]: {
                            ...(prev[moduleItem._id] || {
                              submissionLink: "",
                              files: [],
                            }),
                            files: Array.from(event.target.files || []),
                          },
                        }))
                      }
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-400"
                      disabled={loading}
                    >
                      Upload Tugas
                    </button>
                  </form>
                ) : null}
              </article>
            );
          })
        ) : (
          <div className="rounded-xl border border-slate-300/40 bg-white/45 p-4 text-sm text-slate-700">
            Belum ada modul tersedia.
          </div>
        )}
      </div>
    </section>
  );
}

export default ModuleCards;
