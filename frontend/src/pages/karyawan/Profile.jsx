import { useNavigate } from "react-router-dom";

function KaryawanProfile({
  user,
  profileForm,
  setProfileForm,
  onUpdateProfile,
  loading,
}) {
  const navigate = useNavigate();
  const skillsText = (user?.skills || []).join(", ") || "Belum ada skills";

  return (
    <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-6">
      <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Profil Saya
        </h2>
        <form className="space-y-3" onSubmit={onUpdateProfile}>
          <input
            className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
            placeholder="Nama"
            value={profileForm.nama}
            onChange={(event) =>
              setProfileForm((prev) => ({ ...prev, nama: event.target.value }))
            }
            required
          />
          <input
            className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
            type="email"
            placeholder="Email"
            value={profileForm.email}
            onChange={(event) =>
              setProfileForm((prev) => ({ ...prev, email: event.target.value }))
            }
            required
          />
          <input
            className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
            placeholder="Divisi"
            value={profileForm.divisi || ""}
            onChange={(event) =>
              setProfileForm((prev) => ({
                ...prev,
                divisi: event.target.value,
              }))
            }
          />
          <input
            className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
            value={profileForm.role}
            disabled
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate("/dashboard/karyawan")}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-300"
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
              disabled={loading}
            >
              Simpan Profil
            </button>
          </div>
        </form>
      </div>

      <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Skills Profile (Read Only)
        </h2>
        <textarea
          className="glass-input min-h-24 w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
          value={skillsText}
          readOnly
        />
      </div>
    </div>
  );
}

export default KaryawanProfile;
