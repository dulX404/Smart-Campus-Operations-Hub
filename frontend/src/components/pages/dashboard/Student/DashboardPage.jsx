import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookings } from "../../../../api/bookings";

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

const StudentDashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyBookings();
        setBookings(data.slice(0, 5));
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const upcomingApproved = bookings.filter((b) => b.status === "APPROVED");
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <div className="p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Student Overview</h2>
        <p className="mt-2 text-slate-600">Access your campus resources, book facilities, and track your requests.</p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-800">My Bookings</h3>
            <p className="mt-2 text-3xl font-bold text-slate-950">{bookings.length}</p>
            <p className="mt-1 text-sm text-slate-500">Total bookings</p>
            <Link to="/dashboard/bookings" className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline">
              View all →
            </Link>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-800">Upcoming</h3>
            <p className="mt-2 text-3xl font-bold text-emerald-700">{upcomingApproved.length}</p>
            <p className="mt-1 text-sm text-slate-500">Approved bookings</p>
            <Link to="/dashboard/bookings" className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline">
              View all →
            </Link>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-800">Pending</h3>
            <p className="mt-2 text-3xl font-bold text-amber-700">{pendingCount}</p>
            <p className="mt-1 text-sm text-slate-500">Awaiting approval</p>
            <Link to="/dashboard/bookings" className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline">
              Check status →
            </Link>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-800">Recent Tickets</h3>
            <p className="mt-2 text-3xl font-bold text-slate-950">0</p>
            <p className="mt-1 text-sm text-slate-500">Your recent tickets will appear here.</p>
            <Link to="/dashboard/tickets" className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline">
              Go to tickets →
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">Recent Bookings</h3>
            <Link to="/dashboard/resources" className="text-sm font-semibold text-blue-700 hover:underline">
              + Book a Resource
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-3">
              {[1, 2].map((item) => (
                <div key={item} className="h-20 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-sm text-slate-500">No bookings yet. Browse resources and make your first booking!</p>
              <Link
                to="/dashboard/resources"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
              >
                Browse Resources
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {bookings.map((booking) => {
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
                        {formatDateTime(booking.startTime)} → {formatDateTime(booking.endTime)}
                      </p>
                    </div>
                    <Link
                      to="/dashboard/bookings"
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      View details →
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

export default StudentDashboardPage;
