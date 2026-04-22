import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { studentLinks, adminLinks } from "../data/LinkData";

// Icon mapping for string-based icons in LinkData
const iconMap = {
	LayoutDashboard: (
		<svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
			<path d="M4 11h7V4H4v7Z" /><path d="M13 20h7v-9h-7v9Z" /><path d="M13 4h7v5h-7V4Z" /><path d="M4 20h7v-5H4v5Z" />
		</svg>
	),
	Box: (
		<svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
			<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
		</svg>
	),
	Calendar: (
		<svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
			<path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
		</svg>
	),
	Ticket: (
		<svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
			<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
		</svg>
	),
	ShieldCheck: (
		<svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" />
		</svg>
	),
	Settings: (
		<svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
			<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" /><circle cx="12" cy="12" r="3" />
		</svg>
	),
	Users: (
		<svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	),
	BarChart3: (
		<svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
			<path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
		</svg>
	),
	Bell: (
		<svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
			<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
		</svg>
	),
};

const Sidebar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const navItems = user?.role?.includes("ADMIN") ? adminLinks : studentLinks;

	return (
		<aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-900 p-6 pt-0 -mt-12 text-white">
			<div className="-mb-10 flex items-center gap-3">
				<img src="/zentro_logo.png" alt="Zentro Logo" className="h-30 w-auto" />
			</div>

			<nav className="flex-1 space-y-2">
				{navItems.map((item) => (
					<NavLink
						key={item.path}
						to={item.path}
						end={item.path === "/dashboard" || item.path === "/admin-dashboard"}
						className={({ isActive }) =>
							`flex items-center gap-3 rounded-lg px-4 py-2 transition ${
								isActive
									? "bg-white text-slate-900"
									: "text-slate-300 hover:bg-slate-800 hover:text-white"
							}`
						}
					>
						<span className="shrink-0">{iconMap[item.icon]}</span>
						{item.label}
					</NavLink>
				))}
			</nav>

			<div className="mt-auto border-t border-slate-800 pt-4">
				<button
					onClick={handleLogout}
					className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
				>
					<svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" stroke="currentColor" strokeWidth="1.8">
						<path d="M10 17l5-5-5-5" />
						<path d="M15 12H3" />
						<path d="M21 4v16" />
					</svg>
					<span>Logout</span>
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
