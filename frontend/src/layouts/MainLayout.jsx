import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Resources", path: "/dashboard/resources" },
  { label: "Bookings", path: "/dashboard/bookings" },
  { label: "Tickets", path: "/dashboard/tickets" },
];

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      <aside className="w-64 border-r border-slate-200 bg-slate-900 p-6 text-white">
        <div className="mb-8 flex items-center gap-3">
          <img src="/zentro_logo.png" alt="Zentro Logo" className="h-8 w-auto rounded bg-white p-0.5" />
          <h1 className="text-xl font-bold">Smart Campus</h1>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 transition ${
                  isActive ? "bg-white text-slate-900" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Operations Hub</h2>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              Team Starter Layout
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
