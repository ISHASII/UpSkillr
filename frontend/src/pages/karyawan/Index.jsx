import ActionsPanel from "./components/ActionsPanel";
import LogsPanel from "./components/LogsPanel";

function KaryawanDashboardPage({ logs }) {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Dashboard Karyawan
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          Pantau progres pelatihan kamu. Untuk mendaftar modul, akses materi,
          dan upload tugas, buka menu
          <span className="font-semibold"> Daftar Modul</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ActionsPanel logs={logs} />
        <LogsPanel logs={logs} />
      </div>
    </div>
  );
}

export default KaryawanDashboardPage;
