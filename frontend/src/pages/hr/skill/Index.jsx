import { useNavigate } from "react-router-dom";

function HRSkillIndex({
  skills,
  onDeleteSkill,
  setEditSkillId,
  setEditSkillForm,
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Data Skill</h2>
          <button
            type="button"
            onClick={() => navigate("/dashboard/hr/skills/create")}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
          >
            Tambah Skill
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-400/30 text-slate-700">
                <th className="px-2 py-2">Nama</th>
                <th className="px-2 py-2">Deskripsi</th>
                <th className="px-2 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {skills.length ? (
                skills.map((skill) => (
                  <tr key={skill._id} className="border-b border-slate-400/20">
                    <td className="px-2 py-2 text-slate-800">{skill.nama}</td>
                    <td className="px-2 py-2 text-slate-700">
                      {skill.deskripsi}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-400"
                          onClick={() => {
                            setEditSkillId(skill._id);
                            setEditSkillForm({
                              nama: skill.nama || "",
                              deskripsi: skill.deskripsi || "",
                            });
                            navigate("/dashboard/hr/skills/edit");
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-400"
                          onClick={() => onDeleteSkill(skill._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-2 py-4 text-center text-slate-600"
                  >
                    Belum ada skill.
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

export default HRSkillIndex;
