import Swal from "sweetalert2";
import ActionsPanel from "./components/ActionsPanel";
import LogsPanel from "./components/LogsPanel";

function KaryawanDashboardPage({
  loading,
  modules,
  logs,
  createLogModuleId,
  setCreateLogModuleId,
  completeLogId,
  setCompleteLogId,
  onCreateLog,
  onCompleteLog,
}) {
  const handleCreateLog = async (event) => {
    event.preventDefault();

    if (!createLogModuleId) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Pilih modul terlebih dahulu",
        confirmButtonText: "OK",
        width: 420,
      });
      return;
    }

    const result = await Swal.fire({
      title: "Mulai modul ini sekarang?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      width: 420,
    });

    if (result.isConfirmed) {
      await onCreateLog();
    }
  };

  const handleCompleteLog = async (event) => {
    event.preventDefault();

    if (!completeLogId) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Pilih log terlebih dahulu",
        confirmButtonText: "OK",
        width: 420,
      });
      return;
    }

    const result = await Swal.fire({
      title: "Yakin set log ini jadi selesai?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      width: 420,
    });

    if (result.isConfirmed) {
      await onCompleteLog();
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Dashboard Karyawan
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          Kelola progress belajar kamu di sini. Daftar modul sekarang ada di
          menu
          <span className="font-semibold"> Daftar Modul</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ActionsPanel
          loading={loading}
          modules={modules}
          logs={logs}
          createLogModuleId={createLogModuleId}
          setCreateLogModuleId={setCreateLogModuleId}
          onCreateLog={handleCreateLog}
          completeLogId={completeLogId}
          setCompleteLogId={setCompleteLogId}
          onCompleteLog={handleCompleteLog}
        />

        <LogsPanel logs={logs} />
      </div>
    </div>
  );
}

export default KaryawanDashboardPage;
