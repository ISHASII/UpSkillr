import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import KaryawanNav from "../../components/KaryawanNav";

function KaryawanLayout({ user, onLogout, children }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    height: 0,
    width: 0,
  });
  const triggerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function updateCoords() {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        height: rect.height,
        width: rect.width,
      });
    }

    if (open) {
      updateCoords();
      window.addEventListener("resize", updateCoords);
      window.addEventListener("scroll", updateCoords, true);
    }

    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [open]);

  const goProfile = () => {
    setOpen(false);
    navigate("/dashboard/karyawan/profile");
  };

  return (
    <section className="auth-bg relative min-h-screen w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />
      <div className="auth-grid" />

      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-6">
        <header className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Karyawan Dashboard
              </h1>
              <p className="text-sm text-slate-700">
                Employee Skill Matcher & Training Hub
              </p>
            </div>
            <div ref={triggerRef} className="relative flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg"
                aria-expanded={open}
                aria-controls="karyawan-dropdown"
              >
                {user?.nama?.[0]?.toUpperCase() || "U"}
              </button>

              <div className="hidden sm:flex sm:items-center sm:gap-2">
                <button
                  type="button"
                  onClick={() => setOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/5"
                >
                  <div className="text-sm text-slate-800">{user?.nama}</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-slate-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="text-xs text-slate-500">{user?.role}</div>
              </div>

              {open &&
                typeof document !== "undefined" &&
                createPortal(
                  <div
                    id="karyawan-dropdown"
                    style={{
                      position: "absolute",
                      top: `${coords.top + coords.height + 8}px`,
                      left: `${coords.left}px`,
                      minWidth: 160,
                      zIndex: 9999,
                    }}
                    className="rounded-xl border border-slate-300/40 bg-white p-2 shadow-lg"
                  >
                    <button
                      type="button"
                      onClick={goProfile}
                      className="w-full rounded-lg px-2 py-1 text-left text-sm text-slate-800 hover:bg-slate-100"
                    >
                      Profil
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        onLogout();
                      }}
                      className="w-full rounded-lg px-2 py-1 text-left text-sm text-slate-800 hover:bg-slate-100"
                    >
                      Logout
                    </button>
                  </div>,
                  document.body,
                )}
            </div>
          </div>
        </header>

        <KaryawanNav />

        {children}
      </div>
    </section>
  );
}

export default KaryawanLayout;
