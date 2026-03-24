function Toast({ type, message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-md">
      <div
        className={`glass-card rounded-xl px-4 py-3 text-sm shadow-lg ${
          type === "error"
            ? "border-red-300/60 text-red-100"
            : "border-emerald-300/60 text-emerald-100"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <p>{message}</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-slate-900/40 px-2 py-1 text-xs text-slate-100 hover:bg-slate-900/60"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;
