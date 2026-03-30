function KaryawanHeader({ user, onRequestLogout }) {
  return (
    <header className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Dashboard Karyawan
          </h1>
          <p className="text-sm text-slate-700">
            Employee Skill Matcher & Training Hub
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <p className="text-sm text-slate-800">
            Login sebagai <span className="font-semibold">{user?.nama}</span> (
            {user?.role})
          </p>
          <button
            type="button"
            onClick={onRequestLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default KaryawanHeader;
