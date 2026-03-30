import { useNavigate } from "react-router-dom";

function HRModulIndex({
  modules,
  onDeleteModule,
  setEditModuleId,
  setEditModuleForm,
  onOpenParticipants,
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Data Modul</h2>
          <button
            type="button"
            onClick={() => navigate("/dashboard/hr/modul/create")}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
          >
            Tambah Modul
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-400/30 text-slate-700">
                <th className="px-2 py-2">Judul</th>
                <th className="px-2 py-2">Deskripsi</th>
                <th className="px-2 py-2">Goals</th>
                <th className="px-2 py-2">Target Divisi</th>
                <th className="px-2 py-2">Target Skills</th>
                <th className="px-2 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {modules.length ? (
                modules.map((moduleItem) => (
                  <tr
                    key={moduleItem._id}
                    className="border-b border-slate-400/20"
                  >
                    <td className="px-2 py-2 text-slate-800">
                      {moduleItem.judul}
                    </td>
                    <td className="px-2 py-2 text-slate-700">
                      {moduleItem.deskripsi}
                    </td>
                    <td className="px-2 py-2 text-slate-700">
                      {moduleItem.goalsModule || "-"}
                    </td>
                    <td className="px-2 py-2 text-slate-700">
                      {(moduleItem.targetDivisions || []).join(", ") || "-"}
                    </td>
                    <td className="px-2 py-2 text-slate-700">
                      {(moduleItem.targetSkills || [])
                        .map((s) => (s?.nama ? s.nama : s))
                        .join(", ")}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-400"
                          onClick={() => {
                            setEditModuleId(moduleItem._id);
                            setEditModuleForm({
                              judul: moduleItem.judul || "",
                              deskripsi: moduleItem.deskripsi || "",
                              goalsModule: moduleItem.goalsModule || "",
                              linkMateri: moduleItem.linkMateri || "",
                              materiFiles: [],
                              existingMateriFiles: moduleItem.materiFiles || [],
                              targetSkills: (moduleItem.targetSkills || []).map(
                                (s) => (s && s._id ? s._id : s),
                              ),
                              targetDivisions: moduleItem.targetDivisions || [],
                            });
                            navigate("/dashboard/hr/modul/edit");
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-400"
                          onClick={() => onDeleteModule(moduleItem._id)}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-400"
                          onClick={() => onOpenParticipants(moduleItem)}
                        >
                          Validasi Peserta
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-2 py-4 text-center text-slate-600"
                  >
                    Belum ada modul.
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

export default HRModulIndex;
