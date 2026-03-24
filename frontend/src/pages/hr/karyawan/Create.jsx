function HRKaryawanCreate({
  newUserForm,
  setNewUserForm,
  onCreateUser,
  loading,
}) {
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
        <button
          type="submit"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
          disabled={loading}
        >
          Tambah
        </button>
      </form>
    </div>
  );
}

export default HRKaryawanCreate;
