import { NavLink } from "react-router-dom";

const karyawanNavItems = [
  { label: "Dashboard", path: "/dashboard/karyawan" },
  { label: "Daftar Modul", path: "/dashboard/karyawan/modul" },
];

function KaryawanNav() {
  return (
    <nav className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {karyawanNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard/karyawan"}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-center text-sm font-medium transition ${
                isActive
                  ? "bg-white text-slate-900"
                  : "bg-transparent text-slate-700 hover:bg-white/40"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default KaryawanNav;
