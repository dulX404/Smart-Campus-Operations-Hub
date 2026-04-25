import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getResources } from "../../../../api/resources";
import { getAllBookings } from "../../../../api/bookings";

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

const statusConfig = {
  PENDING: { label: "Pending", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  APPROVED: { label: "Approved", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  REJECTED: { label: "Rejected", className: "bg-red-50 text-red-700 ring-red-200" },
  CANCELLED: { label: "Cancelled", className: "bg-slate-50 text-slate-700 ring-slate-200" },
};

const AdminDashboardPage = () => {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [resData, bookData] = await Promise.all([getResources(), getAllBookings()]);
        setResources(resData);
        setBookings(bookData);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const activeResources = resources.filter((r) => r.status === "ACTIVE").length;

  return (
    <div className="p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Admin Overview</h2>
        <p className="mt-2 text-slate-600">This is where you can manage campus operations, resources, and users.</p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-6 border border-blue-100">
            <p className="text-sm font-medium text-blue-600">Active Resources</p>
            <p className="mt-2 text-3xl font-bold text-blue-900">
              {loading ? "..." : activeResources}
            </p>
            <Link to="/admin-dashboard/resources" className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline">
              Manage →
            </Link>
          </div>
          <div className="rounded-lg bg-orange-50 p-6 border border-orange-100">
            <p className="text-sm font-medium text-orange-600">Pending Tickets</p>
            <p className="mt-2 text-3xl font-bold text-orange-900">0</p>
            <span className="mt-4 inline-block text-sm font-semibold text-orange-700">Coming soon</span>
          </div>
          <div className="rounded-lg bg-green-50 p-6 border border-green-100">
            <p className="text-sm font-medium text-green-600">Active Bookings</p>
            <p className="mt-2 text-3xl font-bold text-green-900">
              {loading ? "..." : bookings.filter((b) => b.status === "APPROVED").length}
            </p>
            <Link to="/admin-dashboard/bookings" className="mt-4 inline-block text-sm font-semibold text-green-700 hover:underline">
              View all →
            </Link>
          </div>
          <div className="rounded-lg bg-amber-50 p-6 border border-amber-100">
            <p className="text-sm font-medium text-amber-600">Pending Requests</p>
            <p className="mt-2 text-3xl font-bold text-amber-900">
              {loading ? "..." : pendingBookings.length}
            </p>
            <Link to="/admin-dashboard/bookings" className="mt-4 inline-block text-sm font-semibold text-amber-700 hover:underline">
              Review →
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">Recent Booking Requests</h3>
            <Link to="/admin-dashboard/bookings" className="text-sm font-semibold text-blue-700 hover:underline">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-3">
              {[1, 2].map((item) => (
                <div key={item} className="h-20 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : pendingBookings.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-sm text-slate-500">No pending booking requests at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {pendingBookings.slice(0, 5).map((booking) => {
                const status = statusConfig[booking.status] || statusConfig.PENDING;
                return (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{booking.resourceName}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {booking.userEmail} · {formatDateTime(booking.startTime)} → {formatDateTime(booking.endTime)}
                      </p>
                    </div>
                    <Link
                      to="/admin-dashboard/bookings"
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      Review →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
