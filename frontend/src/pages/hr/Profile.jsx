function HRProfile({
  user,
  editUserForm,
  setEditUserForm,
  onUpdateUser,
  loading,
}) {
  return (
    <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6 max-w-lg mx-auto">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Profil Saya</h2>
      <form className="space-y-4" onSubmit={onUpdateUser}>
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Nama"
          value={editUserForm.nama}
          onChange={(event) =>
            setEditUserForm((prev) => ({ ...prev, nama: event.target.value }))
          }
          required
        />
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          type="email"
          placeholder="Email"
          value={editUserForm.email}
          onChange={(event) =>
            setEditUserForm((prev) => ({ ...prev, email: event.target.value }))
          }
          required
        />
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Divisi"
          value={editUserForm.divisi || ""}
          onChange={(event) =>
            setEditUserForm((prev) => ({ ...prev, divisi: event.target.value }))
          }
        />
        <select
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
          value={editUserForm.role}
          onChange={(event) =>
            setEditUserForm((prev) => ({ ...prev, role: event.target.value }))
          }
        >
          <option value="Karyawan">Karyawan</option>
          <option value="HR">HR</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
          disabled={loading}
        >
          Simpan Profil
        </button>
      </form>
    </div>
  );
}

export default HRProfile;
