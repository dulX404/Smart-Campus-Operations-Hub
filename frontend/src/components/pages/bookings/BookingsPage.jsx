import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getMyBookings, cancelBooking } from "../../../api/bookings";

const statusConfig = {
  PENDING: { label: "Pending", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  APPROVED: { label: "Approved", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  REJECTED: { label: "Rejected", className: "bg-red-50 text-red-700 ring-red-200" },
  CANCELLED: { label: "Cancelled", className: "bg-slate-50 text-slate-700 ring-slate-200" },
};

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      {children}
    </svg>
  );
}

const BookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    setError("");
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(id);
    setError("");
    try {
      await cancelBooking(id);
      await loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    approved: bookings.filter((b) => b.status === "APPROVED").length,
    rejected: bookings.filter((b) => b.status === "REJECTED").length,
  };

  return (
    <div className="p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">My Bookings</h2>
        <p className="mt-2 text-slate-600">Track and manage your campus resource bookings.</p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total" value={stats.total} tone="text-slate-950" />
          <StatCard label="Pending" value={stats.pending} tone="text-amber-700" />
          <StatCard label="Approved" value={stats.approved} tone="text-emerald-700" />
          <StatCard label="Rejected" value={stats.rejected} tone="text-red-700" />
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-24 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="mb-3 rounded-lg bg-white p-3 text-slate-500 shadow-sm">
                <Icon>
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                </Icon>
              </div>
              <h3 className="text-base font-bold text-slate-900">No bookings yet</h3>
              <p className="mt-1 text-sm text-slate-500">Browse resources and submit your first booking request.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {bookings.map((booking) => {
                const status = statusConfig[booking.status] || statusConfig.PENDING;
                const canCancel = booking.status === "PENDING" || booking.status === "APPROVED";

                return (
                  <div
                    key={booking.id}
                    className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-bold text-slate-950">{booking.resourceName}</h3>
                          <span className={`rounded-full px-2 py-1 text-xs font-bold ring-1 ${status.className}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{booking.purpose}</p>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Icon>
                              <path d="M8 2v4" />
                              <path d="M16 2v4" />
                              <rect width="18" height="18" x="3" y="4" rx="2" />
                              <path d="M3 10h18" />
                            </Icon>
                            {formatDateTime(booking.startTime)}
                          </span>
                          <span className="text-slate-400">→</span>
                          <span>{formatDateTime(booking.endTime)}</span>
                        </div>
                        {booking.adminNotes && (
                          <div className="mt-2 rounded-md bg-slate-50 p-2 text-xs text-slate-600">
                            <span className="font-semibold">Admin note:</span> {booking.adminNotes}
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 items-start gap-2">
                        {canCancel && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Icon>
                              <path d="M18 6L6 18" />
                              <path d="M6 6l12 12" />
                            </Icon>
                            {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-400">
                      Requested on {formatDateTime(booking.requestedAt)}
                      {booking.approvedAt && (
                        <span className="ml-4">Processed on {formatDateTime(booking.approvedAt)}</span>
                      )}
                    </div>
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

function StatCard({ label, value, tone }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

export default BookingsPage;
