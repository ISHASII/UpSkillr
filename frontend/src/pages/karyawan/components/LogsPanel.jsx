const statusClass = {
  "Sedang Berjalan": "bg-sky-100 text-sky-800",
  "Menunggu Validasi HR": "bg-amber-100 text-amber-800",
  "Perlu Revisi": "bg-rose-100 text-rose-800",
  Lulus: "bg-emerald-100 text-emerald-800",
};

function LogsPanel({ logs }) {
  return (
    <section className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">
        Progress Log Saya
      </h2>
      <div className="space-y-3 text-sm">
        {logs.length ? (
          logs.map((item) => (
            <div
              key={item._id}
              className="rounded-lg border border-slate-300/40 bg-white/45 px-3 py-3"
            >
              <p className="font-medium text-slate-900">
                {item.module_id?.judul || "Modul"}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-slate-600">ID: {item._id}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass[item.status] || "bg-slate-200 text-slate-700"}`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-slate-300/40 bg-white/45 px-3 py-4 text-sm text-slate-700">
            Belum ada progress log.
          </div>
        )}
      </div>
    </section>
  );
}

export default LogsPanel;
