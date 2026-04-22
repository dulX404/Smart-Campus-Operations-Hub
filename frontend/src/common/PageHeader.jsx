/* eslint-disable react/prop-types */
import { useAuth } from "../context/AuthContext";

function PageHeader({ title, description }) {
  const { user, loading: authLoading } = useAuth();
  const mockProfilePicture = "/zentro_logo.png";

  const getRoleDisplay = (role) => {
    if (!role) return "User";
    if (role.includes("ROLE_ADMIN")) return "Administrator";
    if (role.includes("ROLE_STUDENT")) return "Student";
    return role;
  };

  const currentUser = user || { fullName: "Loading...", email: "..." };
  const roleDisplay = getRoleDisplay(currentUser.role);
  const loading = authLoading;

  return (
    <header className="mb-6 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>

        <div className="flex items-center gap-3">
          {loading && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200"></div>
              <div className="space-y-1">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200"></div>
                <div className="h-3 w-16 animate-pulse rounded bg-slate-200"></div>
              </div>
            </div>
          )}

          {!loading && (
            <div className="flex items-center gap-3">
              <img
                src={currentUser.profilePicture || mockProfilePicture}
                alt={currentUser.fullName || "User"}
                className="h-10 w-10 rounded-full border border-tertiary object-cover bg-white"
              />
              <div className="text-right leading-tight">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mb-1">
                  {roleDisplay}
                </p>
                <p className="text-sm font-bold text-slate-900">{currentUser.fullName}</p>
                <p className="text-[11px] text-slate-500">{currentUser.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default PageHeader;
