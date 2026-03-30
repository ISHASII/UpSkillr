import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const statusClass = {
  "Sedang Berjalan": "bg-sky-100 text-sky-800",
  "Menunggu Validasi HR": "bg-amber-100 text-amber-800",
  "Perlu Revisi": "bg-rose-100 text-rose-800",
  Lulus: "bg-emerald-100 text-emerald-800",
};

function HRModulParticipants({
  selectedModule,
  participants,
  onValidateSubmission,
  loading,
}) {
  const navigate = useNavigate();
  const [feedbackByLog, setFeedbackByLog] = useState({});

  const title = useMemo(
    () => selectedModule?.judul || "Validasi Peserta Modul",
    [selectedModule],
  );

  if (!selectedModule?._id) {
    return (
      <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
        <p className="text-sm text-slate-700">
          Pilih modul dari halaman Data Modul terlebih dahulu.
        </p>
        <button
          type="button"
          onClick={() => navigate("/dashboard/hr/modul")}
          className="mt-4 rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-300"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Validasi Peserta Modul
            </h2>
            <p className="text-sm text-slate-700">{title}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/hr/modul")}
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-300"
          >
            Back
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-400/30 text-slate-700">
                <th className="px-2 py-2">Karyawan</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Submission</th>
                <th className="px-2 py-2">Catatan HR</th>
                <th className="px-2 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {participants.length ? (
                participants.map((item) => {
                  const feedback = feedbackByLog[item._id] || "";
                  return (
                    <tr
                      key={item._id}
                      className="border-b border-slate-400/20 align-top"
                    >
                      <td className="px-2 py-2 text-slate-800">
                        <div className="font-medium">
                          {item.user_id?.nama || "-"}
                        </div>
                        <div className="text-xs text-slate-600">
                          {item.user_id?.email || "-"}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-slate-700">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass[item.status] || "bg-slate-200 text-slate-700"}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-slate-700">
                        {item.submissionLink ? (
                          <a
                            href={item.submissionLink}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-blue-700 underline"
                          >
                            Link Tugas
                          </a>
                        ) : null}
                        {(item.submissionFiles || []).map((filePath) => (
                          <a
                            key={filePath}
                            href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${filePath}`}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-blue-700 underline"
                          >
                            File Tugas
                          </a>
                        ))}
                        {!item.submissionLink &&
                        !(item.submissionFiles || []).length ? (
                          <span className="text-xs text-slate-500">
                            Belum ada submission
                          </span>
                        ) : null}
                      </td>
                      <td className="px-2 py-2">
                        <textarea
                          className="glass-input min-h-20 w-56 rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
                          placeholder="Catatan HR"
                          value={feedback}
                          onChange={(event) =>
                            setFeedbackByLog((prev) => ({
                              ...prev,
                              [item._id]: event.target.value,
                            }))
                          }
                        />
                        {item.hrFeedback ? (
                          <p className="mt-1 text-xs text-slate-600">
                            Feedback terakhir: {item.hrFeedback}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            disabled={
                              loading || item.status !== "Menunggu Validasi HR"
                            }
                            onClick={() =>
                              onValidateSubmission(
                                item._id,
                                "approve",
                                feedback,
                              )
                            }
                            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Lulus
                          </button>
                          <button
                            type="button"
                            disabled={
                              loading || item.status !== "Menunggu Validasi HR"
                            }
                            onClick={() =>
                              onValidateSubmission(item._id, "reject", feedback)
                            }
                            className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Kembalikan
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-2 py-4 text-center text-slate-600"
                  >
                    Belum ada peserta pada modul ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HRModulParticipants;
