function HRDashboard({ logs }) {
  return (
    <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Semua Progress Log
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-400/30 text-slate-700">
              <th className="px-2 py-2">Log ID</th>
              <th className="px-2 py-2">User</th>
              <th className="px-2 py-2">Module</th>
              <th className="px-2 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.length ? (
              logs.map((logItem) => (
                <tr key={logItem._id} className="border-b border-slate-400/20">
                  <td className="px-2 py-2 text-xs text-slate-700">
                    {logItem._id}
                  </td>
                  <td className="px-2 py-2 text-slate-800">
                    {logItem.user_id?.nama || "-"} (
                    {logItem.user_id?.role || "-"})
                  </td>
                  <td className="px-2 py-2 text-slate-800">
                    {logItem.module_id?.judul || "-"}
                  </td>
                  <td className="px-2 py-2 text-slate-800">{logItem.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-2 py-4 text-center text-sm text-slate-600"
                >
                  Data progress log masih kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HRDashboard;
