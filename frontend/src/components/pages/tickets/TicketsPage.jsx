import { useEffect, useState } from "react";
import { getResources } from "../../../api/resources";
import {
  addTicketComment,
  attachmentUrl,
  createTicket,
  deleteTicket,
  deleteTicketComment,
  getMyTickets,
  updateTicketComment,
} from "../../../api/tickets";
import { useAuth } from "../../../context/AuthContext";

const categories = ["ELECTRICAL", "PLUMBING", "IT", "FURNITURE", "CLEANING", "SAFETY", "OTHER"];
const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const statusStyles = {
  OPEN: "bg-blue-50 text-blue-700 ring-blue-200",
  IN_PROGRESS: "bg-amber-50 text-amber-700 ring-amber-200",
  RESOLVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CLOSED: "bg-slate-100 text-slate-700 ring-slate-200",
  REJECTED: "bg-red-50 text-red-700 ring-red-200",
};

const initialForm = {
  resourceId: "",
  location: "",
  category: "IT",
  description: "",
  priority: "MEDIUM",
  preferredContactName: "",
  preferredContactEmail: "",
  preferredContactPhone: "",
};

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function label(value) {
  return value ? value.replaceAll("_", " ") : "-";
}

const TicketsPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(() => ({ ...initialForm, preferredContactEmail: user?.sub || "" }));
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [commentDrafts, setCommentDrafts] = useState({});
  const [editingComments, setEditingComments] = useState({});

  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
    setLoading(true);
    setError("");
    try {
      const [ticketData, resourceData] = await Promise.all([getMyTickets(), getResources()]);
      setTickets(ticketData);
      setResources(resourceData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleResourceChange(resourceId) {
    const resource = resources.find((item) => item.id === resourceId);
    setForm((current) => ({
      ...current,
      resourceId,
      location: resource?.location || current.location,
    }));
  }

  function handleFiles(event) {
    const selected = Array.from(event.target.files || []).slice(0, 3);
    setFiles(selected);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await createTicket(form, files);
      setForm({ ...initialForm, preferredContactEmail: user?.sub || "" });
      setFiles([]);
      setSuccess("Ticket submitted successfully.");
      await loadPageData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit ticket.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(ticketId) {
    if (!window.confirm("Delete this open ticket?")) return;
    setDeletingId(ticketId);
    setError("");
    try {
      await deleteTicket(ticketId);
      await loadPageData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete ticket.");
    } finally {
      setDeletingId("");
    }
  }

  async function submitComment(ticketId) {
    const content = (commentDrafts[ticketId] || "").trim();
    if (!content) return;
    try {
      await addTicketComment(ticketId, content);
      setCommentDrafts((current) => ({ ...current, [ticketId]: "" }));
      await loadPageData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment.");
    }
  }

  async function saveComment(ticketId, commentId) {
    const content = (editingComments[commentId] || "").trim();
    if (!content) return;
    try {
      await updateTicketComment(ticketId, commentId, content);
      setEditingComments((current) => {
        const next = { ...current };
        delete next[commentId];
        return next;
      });
      await loadPageData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update comment.");
    }
  }

  async function removeComment(ticketId, commentId) {
    try {
      await deleteTicketComment(ticketId, commentId);
      await loadPageData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete comment.");
    }
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter((ticket) => ticket.status === "OPEN").length,
    active: tickets.filter((ticket) => ticket.status === "IN_PROGRESS").length,
    resolved: tickets.filter((ticket) => ticket.status === "RESOLVED" || ticket.status === "CLOSED").length,
  };
  const selectedResource = resources.find((resource) => resource.id === form.resourceId);
  const locationRequired = !selectedResource;

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Maintenance Desk</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Incident Tickets</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Report damaged facilities, equipment problems, and campus incidents with evidence photos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Open" value={stats.open} />
        <StatCard label="In progress" value={stats.active} />
        <StatCard label="Resolved" value={stats.resolved} />
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {success && <Alert tone="success">{success}</Alert>}

      <div className="mt-6 grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Create Ticket</h2>
          <p className="mt-1 text-sm text-slate-500">Attach up to 3 images if you have evidence.</p>

          <div className="mt-5 grid gap-4">
            <Field label="Resource">
              <select
                value={form.resourceId}
                onChange={(event) => handleResourceChange(event.target.value)}
                className="input"
              >
                <option value="">No specific resource</option>
                {resources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name} ({label(resource.type)})
                  </option>
                ))}
              </select>
            </Field>

            <Field label={locationRequired ? "Location" : "Location (optional)"}>
              <input
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
                className="input"
                placeholder={selectedResource?.type === "EQUIPMENT" ? "Optional for equipment" : "Building, room, lab, or area"}
                required={locationRequired}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <select value={form.category} onChange={(event) => updateField("category", event.target.value)} className="input">
                  {categories.map((item) => <option key={item} value={item}>{label(item)}</option>)}
                </select>
              </Field>
              <Field label="Priority">
                <select value={form.priority} onChange={(event) => updateField("priority", event.target.value)} className="input">
                  {priorities.map((item) => <option key={item} value={item}>{label(item)}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                className="input min-h-28 resize-y"
                placeholder="What happened? Include useful details."
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact email">
                <input
                  type="email"
                  value={form.preferredContactEmail}
                  onChange={(event) => updateField("preferredContactEmail", event.target.value)}
                  className="input"
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Contact phone">
                <input
                  value={form.preferredContactPhone}
                  onChange={(event) => updateField("preferredContactPhone", event.target.value)}
                  className="input"
                  placeholder="+94..."
                />
              </Field>
            </div>

            <Field label="Contact name">
              <input
                value={form.preferredContactName}
                onChange={(event) => updateField("preferredContactName", event.target.value)}
                className="input"
                placeholder="Optional"
              />
            </Field>

            <Field label="Evidence images">
              <input type="file" accept="image/*" multiple onChange={handleFiles} className="input file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white" />
              <p className="mt-1 text-xs text-slate-500">Maximum 3 images, 5MB each.</p>
              {files.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {files.map((file) => <Preview key={`${file.name}-${file.lastModified}`} file={file} />)}
                </div>
              )}
            </Field>

            <button disabled={saving} className="rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50">
              {saving ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-950">My Tickets</h2>
              <p className="mt-1 text-sm text-slate-500">Track workflow updates and reply to staff.</p>
            </div>
            <button onClick={loadPageData} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Refresh
            </button>
          </div>

          <div className="mt-5 grid gap-4">
            {loading ? (
              <div className="h-40 animate-pulse rounded-lg bg-slate-100" />
            ) : tickets.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                No tickets yet.
              </div>
            ) : (
              tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  currentEmail={user?.sub}
                  deletingId={deletingId}
                  onDelete={handleDelete}
                  commentDraft={commentDrafts[ticket.id] || ""}
                  onCommentChange={(value) => setCommentDrafts((current) => ({ ...current, [ticket.id]: value }))}
                  onSubmitComment={() => submitComment(ticket.id)}
                  editingComments={editingComments}
                  setEditingComments={setEditingComments}
                  onSaveComment={saveComment}
                  onDeleteComment={removeComment}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

function TicketCard({
  ticket,
  currentEmail,
  deletingId,
  onDelete,
  commentDraft,
  onCommentChange,
  onSubmitComment,
  editingComments,
  setEditingComments,
  onSaveComment,
  onDeleteComment,
}) {
  const statusClass = statusStyles[ticket.status] || statusStyles.OPEN;
  const canDelete = ticket.status === "OPEN";

  return (
    <article className="rounded-lg border border-slate-200 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-slate-950">{ticket.resourceName || ticket.location}</h3>
            <span className={`rounded-full px-2 py-1 text-xs font-bold ring-1 ${statusClass}`}>{label(ticket.status)}</span>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{label(ticket.priority)}</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{ticket.description}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>{label(ticket.category)}</span>
            <span>{ticket.location}</span>
            <span>{formatDate(ticket.createdAt)}</span>
            {ticket.assignedToEmail && <span>Assigned: {ticket.assignedToEmail}</span>}
          </div>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(ticket.id)}
            disabled={deletingId === ticket.id}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            {deletingId === ticket.id ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      {ticket.attachments?.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
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

      {(ticket.resolutionNotes || ticket.rejectionReason) && (
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          {ticket.resolutionNotes && <p><span className="font-semibold">Resolution:</span> {ticket.resolutionNotes}</p>}
          {ticket.rejectionReason && <p><span className="font-semibold">Rejected:</span> {ticket.rejectionReason}</p>}
        </div>
      )}

      <div className="mt-4 border-t border-slate-100 pt-4">
        <h4 className="text-sm font-bold text-slate-900">Comments</h4>
        <div className="mt-3 grid gap-2">
          {(ticket.comments || []).map((comment) => {
            const isOwner = comment.authorEmail?.toLowerCase() === currentEmail?.toLowerCase();
            const editingValue = editingComments[comment.id];
            return (
              <div key={comment.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-700">{comment.authorEmail}</span>
                  <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                </div>
                {editingValue !== undefined ? (
                  <div className="mt-2 flex gap-2">
                    <input value={editingValue} onChange={(event) => setEditingComments((current) => ({ ...current, [comment.id]: event.target.value }))} className="input py-2 text-sm" />
                    <button onClick={() => onSaveComment(ticket.id, comment.id)} className="rounded-md bg-slate-900 px-3 text-xs font-bold text-white">Save</button>
                  </div>
                ) : (
                  <p className="mt-1 text-slate-600">{comment.content}</p>
                )}
                {isOwner && editingValue === undefined && (
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => setEditingComments((current) => ({ ...current, [comment.id]: comment.content }))} className="text-xs font-semibold text-blue-700">Edit</button>
                    <button onClick={() => onDeleteComment(ticket.id, comment.id)} className="text-xs font-semibold text-red-700">Delete</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={commentDraft}
            onChange={(event) => onCommentChange(event.target.value)}
            className="input py-2 text-sm"
            placeholder="Add a comment"
          />
          <button onClick={onSubmitComment} className="rounded-lg bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-800">
            Send
          </button>
        </div>
      </div>
    </article>
  );
}

function Field({ label: text, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">{text}</span>
      {children}
    </label>
  );
}

function StatCard({ label: text, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{text}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function Alert({ tone, children }) {
  const className = tone === "success"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-red-200 bg-red-50 text-red-700";
  return <div className={`mt-5 rounded-lg border p-3 text-sm ${className}`}>{children}</div>;
}

function Preview({ file }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return <img src={url} alt={file.name} className="h-20 w-full rounded-lg border border-slate-200 object-cover" />;
}

export default TicketsPage;
