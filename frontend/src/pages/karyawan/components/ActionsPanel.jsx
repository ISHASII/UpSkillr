import { useMemo } from "react";

function ActionsPanel({ logs }) {
  const summary = useMemo(() => {
    const items = logs || [];
    return {
      total: items.length,
      berjalan: items.filter((item) => item.status === "Sedang Berjalan")
        .length,
      menunggu: items.filter((item) => item.status === "Menunggu Validasi HR")
        .length,
      revisi: items.filter((item) => item.status === "Perlu Revisi").length,
      lulus: items.filter((item) => item.status === "Lulus").length,
    };
  }, [logs]);

  return (
    <section className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Ringkasan Pelatihan
      </h2>
      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
        <div className="rounded-lg bg-white/50 p-3 text-center">
          <p className="text-xs text-slate-600">Total</p>
          <p className="text-lg font-semibold text-slate-900">
            {summary.total}
          </p>
        </div>
        <div className="rounded-lg bg-white/50 p-3 text-center">
          <p className="text-xs text-slate-600">Berjalan</p>
          <p className="text-lg font-semibold text-sky-700">
            {summary.berjalan}
          </p>
        </div>
        <div className="rounded-lg bg-white/50 p-3 text-center">
          <p className="text-xs text-slate-600">Menunggu</p>
          <p className="text-lg font-semibold text-amber-700">
            {summary.menunggu}
          </p>
        </div>
        <div className="rounded-lg bg-white/50 p-3 text-center">
          <p className="text-xs text-slate-600">Revisi</p>
          <p className="text-lg font-semibold text-rose-700">
            {summary.revisi}
          </p>
        </div>
        <div className="rounded-lg bg-white/50 p-3 text-center">
          <p className="text-xs text-slate-600">Lulus</p>
          <p className="text-lg font-semibold text-emerald-700">
            {summary.lulus}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-700">
        Daftar modul, pendaftaran, akses materi, dan upload tugas sekarang
        dilakukan di menu
        <span className="font-semibold"> Daftar Modul</span>.
      </p>
    </section>
  );
}

export default ActionsPanel;
