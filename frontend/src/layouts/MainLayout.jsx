import { Outlet } from "react-router-dom";
import PageHeader from "../common/PageHeader.jsx";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../context/AuthContext";

function MainLayout() {
  const { user } = useAuth();
  
  // Determine header content based on user role
  const isAdmin = user?.role?.includes("ADMIN");
  const title = isAdmin ? "Admin Command Center" : "Student Hub";
  const description = isAdmin 
    ? `Welcome back, Administrator ${user?.sub || ""}`
    : `Welcome back, ${user?.sub || ""}`;

  return (
    <div className="flex min-h-screen w-full text-slate-800">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <PageHeader title={title} description={description} />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
