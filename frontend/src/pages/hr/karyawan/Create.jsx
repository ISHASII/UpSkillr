import { useNavigate } from "react-router-dom";

function HRKaryawanCreate({
  newUserForm,
  setNewUserForm,
  onCreateUser,
  loading,
}) {
  const navigate = useNavigate();
  return (
    <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Tambah Karyawan
      </h2>
      <form className="space-y-3" onSubmit={onCreateUser}>
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Nama"
          value={newUserForm.nama}
          onChange={(event) =>
            setNewUserForm((prev) => ({ ...prev, nama: event.target.value }))
          }
          required
        />
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          type="email"
          placeholder="Email"
          value={newUserForm.email}
          onChange={(event) =>
            setNewUserForm((prev) => ({ ...prev, email: event.target.value }))
          }
          required
        />
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          type="password"
          placeholder="Password"
          value={newUserForm.password}
          onChange={(event) =>
            setNewUserForm((prev) => ({
              ...prev,
              password: event.target.value,
            }))
          }
          required
        />
        <select
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
          value={newUserForm.role}
          onChange={(event) =>
            setNewUserForm((prev) => ({ ...prev, role: event.target.value }))
          }
        >
          <option value="Karyawan">Karyawan</option>
          <option value="HR">HR</option>
        </select>
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Divisi"
          value={newUserForm.divisi}
          onChange={(event) =>
            setNewUserForm((prev) => ({ ...prev, divisi: event.target.value }))
          }
          required
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard/hr/karyawan")}
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-300"
          >
            Back
          </button>

          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
            disabled={loading}
          >
            Tambah
          </button>
        </div>
      </form>
    </div>
  );
}

export default HRKaryawanCreate;
