import { useEffect, useState } from "react";
import {
  addTicketComment,
  assignTicket,
  attachmentUrl,
  deleteTicket,
  deleteTicketComment,
  getAllTickets,
  rejectTicket,
  updateResolutionNotes,
  updateTicketComment,
  updateTicketStatus,
} from "../../../api/tickets";
import { useAuth } from "../../../context/AuthContext";

const statuses = ["", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"];
const priorities = ["", "LOW", "MEDIUM", "HIGH", "URGENT"];
const categories = ["", "ELECTRICAL", "PLUMBING", "IT", "FURNITURE", "CLEANING", "SAFETY", "OTHER"];

const nextStatus = {
  OPEN: "IN_PROGRESS",
  IN_PROGRESS: "RESOLVED",
  RESOLVED: "CLOSED",
};

const statusStyles = {
  OPEN: "bg-blue-50 text-blue-700 ring-blue-200",
  IN_PROGRESS: "bg-amber-50 text-amber-700 ring-amber-200",
  RESOLVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CLOSED: "bg-slate-100 text-slate-700 ring-slate-200",
  REJECTED: "bg-red-50 text-red-700 ring-red-200",
};

function label(value) {
  return value ? value.replaceAll("_", " ") : "All";
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

const TicketManagementPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({ status: "", priority: "", category: "", assignedToEmail: "" });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [assignDrafts, setAssignDrafts] = useState({});
  const [resolutionDrafts, setResolutionDrafts] = useState({});
  const [rejectDrafts, setRejectDrafts] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [editingComments, setEditingComments] = useState({});

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets(nextFilters = filters) {
    setLoading(true);
    setError("");
    try {
      const data = await getAllTickets(nextFilters);
      setTickets(data);
      setAssignDrafts(Object.fromEntries(data.map((ticket) => [ticket.id, ticket.assignedToEmail || ""])));
      setResolutionDrafts(Object.fromEntries(data.map((ticket) => [ticket.id, ticket.resolutionNotes || ""])));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }

  function changeFilter(name, value) {
    const next = { ...filters, [name]: value };
    setFilters(next);
    loadTickets(next);
  }

  async function runAction(ticketId, action, message) {
    setBusyId(ticketId);
    setError("");
    setSuccess("");
    try {
      await action();
      setSuccess(message);
      await loadTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed.");
    } finally {
      setBusyId("");
    }
  }

  function advanceTicket(ticket) {
    const target = nextStatus[ticket.status];
    if (!target) return;
    runAction(ticket.id, () => updateTicketStatus(ticket.id, target, resolutionDrafts[ticket.id] || ""), `Ticket moved to ${label(target)}.`);
  }

  function saveAssignment(ticket) {
    runAction(ticket.id, () => assignTicket(ticket.id, assignDrafts[ticket.id] || ""), "Assignment updated.");
  }

  function saveResolution(ticket) {
    runAction(ticket.id, () => updateResolutionNotes(ticket.id, resolutionDrafts[ticket.id] || ""), "Resolution notes saved.");
  }

  function reject(ticket) {
    runAction(ticket.id, () => rejectTicket(ticket.id, rejectDrafts[ticket.id] || ""), "Ticket rejected.");
  }

  function removeTicket(ticket) {
    if (!window.confirm("Delete this ticket permanently?")) return;
    runAction(ticket.id, () => deleteTicket(ticket.id), "Ticket deleted.");
  }

  async function addComment(ticketId) {
    const content = (commentDrafts[ticketId] || "").trim();
    if (!content) return;
    await runAction(ticketId, () => addTicketComment(ticketId, content), "Comment added.");
    setCommentDrafts((current) => ({ ...current, [ticketId]: "" }));
  }

  async function saveComment(ticketId, commentId) {
    const content = (editingComments[commentId] || "").trim();
    if (!content) return;
    await runAction(ticketId, () => updateTicketComment(ticketId, commentId, content), "Comment updated.");
    setEditingComments((current) => {
      const next = { ...current };
      delete next[commentId];
      return next;
    });
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter((ticket) => ticket.status === "OPEN").length,
    active: tickets.filter((ticket) => ticket.status === "IN_PROGRESS").length,
    urgent: tickets.filter((ticket) => ticket.priority === "URGENT").length,
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Module C</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Incident Tickets</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Assign staff, move tickets through the maintenance workflow, resolve incidents, and moderate comments.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Filtered" value={stats.total} />
        <StatCard label="Open" value={stats.open} />
        <StatCard label="In progress" value={stats.active} />
        <StatCard label="Urgent" value={stats.urgent} />
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {success && <Alert tone="success">{success}</Alert>}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <select value={filters.status} onChange={(event) => changeFilter("status", event.target.value)} className="input">
            {statuses.map((item) => <option key={item || "all-status"} value={item}>{item ? label(item) : "All statuses"}</option>)}
          </select>
          <select value={filters.priority} onChange={(event) => changeFilter("priority", event.target.value)} className="input">
            {priorities.map((item) => <option key={item || "all-priority"} value={item}>{item ? label(item) : "All priorities"}</option>)}
          </select>
          <select value={filters.category} onChange={(event) => changeFilter("category", event.target.value)} className="input">
            {categories.map((item) => <option key={item || "all-category"} value={item}>{item ? label(item) : "All categories"}</option>)}
          </select>
          <input
            value={filters.assignedToEmail}
            onChange={(event) => changeFilter("assignedToEmail", event.target.value)}
            className="input"
            placeholder="Filter by assignee email"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {loading ? (
          <div className="h-44 animate-pulse rounded-xl bg-slate-100" />
        ) : tickets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No tickets match the current filters.
          </div>
        ) : (
          tickets.map((ticket) => (
            <article key={ticket.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-950">{ticket.resourceName || ticket.location}</h2>
                    <Badge className={statusStyles[ticket.status] || statusStyles.OPEN}>{label(ticket.status)}</Badge>
                    <Badge className="bg-slate-100 text-slate-700 ring-slate-200">{label(ticket.priority)}</Badge>
                    <Badge className="bg-indigo-50 text-indigo-700 ring-indigo-200">{label(ticket.category)}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{ticket.description}</p>
                  <div className="mt-3 grid gap-1 text-xs text-slate-500 sm:grid-cols-2 lg:grid-cols-4">
                    <span>Created: {formatDate(ticket.createdAt)}</span>
                    <span>Student: {ticket.createdByEmail}</span>
                    <span>Location: {ticket.location}</span>
                    <span>Contact: {ticket.preferredContactEmail || ticket.preferredContactPhone}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeTicket(ticket)}
                  disabled={busyId === ticket.id}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>

              {ticket.attachments?.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
                  {ticket.attachments.map((attachment) => (
                    <img
                      key={attachment.storedFileName}
                      src={attachmentUrl(attachment.url)}
                      alt={attachment.originalFileName || "Ticket attachment"}
                      className="h-20 w-full rounded-lg border border-slate-200 object-cover"
                    />
                  ))}
                </div>
              )}

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <ActionPanel title="Assignment">
                  <input
                    value={assignDrafts[ticket.id] || ""}
                    onChange={(event) => setAssignDrafts((current) => ({ ...current, [ticket.id]: event.target.value }))}
                    className="input"
                    placeholder="admin@zentro.lk"
                  />
                  <button onClick={() => saveAssignment(ticket)} disabled={busyId === ticket.id} className="btn-dark">Save assignee</button>
                </ActionPanel>

                <ActionPanel title="Resolution">
                  <textarea
                    value={resolutionDrafts[ticket.id] || ""}
                    onChange={(event) => setResolutionDrafts((current) => ({ ...current, [ticket.id]: event.target.value }))}
                    className="input min-h-24"
                    placeholder="Resolution notes required before RESOLVED"
                  />
                  <button onClick={() => saveResolution(ticket)} disabled={busyId === ticket.id} className="btn-dark">Save notes</button>
                </ActionPanel>

                <ActionPanel title="Workflow">
                  {nextStatus[ticket.status] ? (
                    <button onClick={() => advanceTicket(ticket)} disabled={busyId === ticket.id} className="btn-dark">
                      Move to {label(nextStatus[ticket.status])}
                    </button>
                  ) : (
                    <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">No next workflow action.</p>
                  )}
                  {(ticket.status === "OPEN" || ticket.status === "IN_PROGRESS") && (
                    <div className="grid gap-2">
                      <input
                        value={rejectDrafts[ticket.id] || ""}
                        onChange={(event) => setRejectDrafts((current) => ({ ...current, [ticket.id]: event.target.value }))}
                        className="input"
                        placeholder="Rejection reason"
                      />
                      <button onClick={() => reject(ticket)} disabled={busyId === ticket.id} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">
                        Reject
                      </button>
                    </div>
                  )}
                </ActionPanel>
              </div>

              {(ticket.resolutionNotes || ticket.rejectionReason) && (
                <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                  {ticket.resolutionNotes && <p><span className="font-semibold">Resolution:</span> {ticket.resolutionNotes}</p>}
                  {ticket.rejectionReason && <p><span className="font-semibold">Rejection:</span> {ticket.rejectionReason}</p>}
                </div>
              )}

              <div className="mt-5 border-t border-slate-100 pt-4">
                <h3 className="text-sm font-bold text-slate-900">Comments</h3>
                <div className="mt-3 grid gap-2">
                  {(ticket.comments || []).map((comment) => {
                    const editingValue = editingComments[comment.id];
                    return (
                      <div key={comment.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold text-slate-700">{comment.authorEmail} <span className="text-xs font-normal text-slate-400">{comment.authorRole}</span></span>
                          <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                        </div>
                        {editingValue !== undefined ? (
                          <div className="mt-2 flex gap-2">
                            <input value={editingValue} onChange={(event) => setEditingComments((current) => ({ ...current, [comment.id]: event.target.value }))} className="input py-2 text-sm" />
                            <button onClick={() => saveComment(ticket.id, comment.id)} className="btn-dark">Save</button>
                          </div>
                        ) : (
                          <p className="mt-1 text-slate-600">{comment.content}</p>
                        )}
                        {editingValue === undefined && (
                          <div className="mt-2 flex gap-2">
                            <button onClick={() => setEditingComments((current) => ({ ...current, [comment.id]: comment.content }))} className="text-xs font-semibold text-blue-700">Edit</button>
                            <button onClick={() => runAction(ticket.id, () => deleteTicketComment(ticket.id, comment.id), "Comment deleted.")} className="text-xs font-semibold text-red-700">Delete</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={commentDrafts[ticket.id] || ""}
                    onChange={(event) => setCommentDrafts((current) => ({ ...current, [ticket.id]: event.target.value }))}
                    className="input py-2 text-sm"
                    placeholder="Add staff comment"
                  />
                  <button onClick={() => addComment(ticket.id)} disabled={busyId === ticket.id} className="btn-dark">Send</button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

function Badge({ className, children }) {
  return <span className={`rounded-full px-2 py-1 text-xs font-bold ring-1 ${className}`}>{children}</span>;
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function ActionPanel({ title, children }) {
  return (
    <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</h3>
      {children}
    </div>
  );
}

function Alert({ tone, children }) {
  const className = tone === "success"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-red-200 bg-red-50 text-red-700";
  return <div className={`mt-5 rounded-lg border p-3 text-sm ${className}`}>{children}</div>;
}

export default TicketManagementPage;
