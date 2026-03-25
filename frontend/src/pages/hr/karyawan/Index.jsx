import { useNavigate } from "react-router-dom";

function HRKaryawanIndex({
  users,
  onDeleteUser,
  setEditUserId,
  setEditUserForm,
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Data Karyawan
          </h2>
          <button
            type="button"
            onClick={() => navigate("/dashboard/hr/karyawan/create")}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
          >
            Tambah Karyawan
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-400/30 text-slate-700">
                <th className="px-2 py-2">Nama</th>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Role</th>
                <th className="px-2 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b border-slate-400/20">
                    <td className="px-2 py-2 text-slate-800">{user.nama}</td>
                    <td className="px-2 py-2 text-slate-700">{user.email}</td>
                    <td className="px-2 py-2 text-slate-700">{user.role}</td>
                    <td className="px-2 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-400"
                          onClick={() => {
                            setEditUserId(user._id);
                            setEditUserForm({
                              nama: user.nama || "",
                              email: user.email || "",
                              role: user.role || "Karyawan",
                              divisi: user.divisi || "",
                              skills: user.skills || [],
                              password: "",
                            });
                            navigate("/dashboard/hr/karyawan/edit");
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-400"
                          onClick={() => onDeleteUser(user._id)}
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
                    colSpan={4}
                    className="px-2 py-4 text-center text-slate-600"
                  >
                    Belum ada data karyawan.
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

export default HRKaryawanIndex;
