import { useEffect, useState } from "react";
import { getAllBookings, approveBooking, rejectBooking } from "../../../api/bookings";

const statusConfig = {
  PENDING: { label: "Pending", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  APPROVED: { label: "Approved", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  REJECTED: { label: "Rejected", className: "bg-red-50 text-red-700 ring-red-200" },
  CANCELLED: { label: "Cancelled", className: "bg-slate-50 text-slate-700 ring-slate-200" },
};

const filterOptions = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

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

const BookingRequestsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionId, setActionId] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [rejectTargetId, setRejectTargetId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load booking requests.");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    setActionId(id);
    setError("");
    try {
      await approveBooking(id);
      await loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve booking.");
    } finally {
      setActionId(null);
    }
  }

  function openRejectModal(id) {
    setRejectTargetId(id);
    setRejectNotes("");
    setRejectModalOpen(true);
  }

  function closeRejectModal() {
    setRejectModalOpen(false);
    setRejectTargetId(null);
    setRejectNotes("");
  }

  async function handleReject() {
    if (!rejectTargetId) return;
    setActionId(rejectTargetId);
    setError("");
    try {
      await rejectBooking(rejectTargetId, rejectNotes);
      closeRejectModal();
      await loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject booking.");
    } finally {
      setActionId(null);
    }
  }

  const filteredBookings = statusFilter === "ALL"
    ? bookings
    : bookings.filter((b) => b.status === statusFilter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    approved: bookings.filter((b) => b.status === "APPROVED").length,
    rejected: bookings.filter((b) => b.status === "REJECTED").length,
  };

  return (
    <div className="p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Booking Requests</h2>
        <p className="mt-2 text-slate-600">Review and manage student resource booking requests.</p>

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

        <div className="mt-6 flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                statusFilter === opt
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {opt === "ALL" ? "All Requests" : opt}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="grid gap-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-28 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="mb-3 rounded-lg bg-white p-3 text-slate-500 shadow-sm">
                <Icon>
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                </Icon>
              </div>
              <h3 className="text-base font-bold text-slate-900">No bookings found</h3>
              <p className="mt-1 text-sm text-slate-500">{statusFilter === "ALL" ? "No booking requests have been submitted yet." : `No ${statusFilter.toLowerCase()} bookings.`}</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredBookings.map((booking) => {
                const status = statusConfig[booking.status] || statusConfig.PENDING;
                const isPending = booking.status === "PENDING";

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
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Icon><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></Icon>
                            {booking.userEmail}
                          </span>
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
                        <p className="mt-2 text-sm text-slate-500">{booking.purpose}</p>
                        {booking.adminNotes && (
                          <div className="mt-2 rounded-md bg-slate-50 p-2 text-xs text-slate-600">
                            <span className="font-semibold">Admin note:</span> {booking.adminNotes}
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 items-start gap-2">
                        {isPending && (
                          <>
                            <button
                              onClick={() => handleApprove(booking.id)}
                              disabled={actionId === booking.id}
                              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-50"
                            >
                              <Icon><path d="M20 6L9 17l-5-5" /></Icon>
                              {actionId === booking.id ? "Processing..." : "Approve"}
                            </button>
                            <button
                              onClick={() => openRejectModal(booking.id)}
                              disabled={actionId === booking.id}
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                            >
                              <Icon><path d="M18 6L6 18" /><path d="M6 6l12 12" /></Icon>
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-400">
                      Requested on {formatDateTime(booking.requestedAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Reject Booking</h3>
              <button onClick={closeRejectModal} className="text-slate-400 hover:text-slate-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Reason (optional)</label>
                <textarea
                  rows="3"
                  placeholder="Provide a reason for rejection..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeRejectModal}
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionId === rejectTargetId}
                  className="flex-1 rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-red-800 transition disabled:opacity-50"
                >
                  {actionId === rejectTargetId ? "Rejecting..." : "Confirm Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

export default BookingRequestsPage;
