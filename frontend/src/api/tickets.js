import apiClient from "./client";

function unwrapResponse(response) {
  return response?.data?.data;
}

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value !== null && value !== undefined)
  );
}

export async function createTicket(payload, files = []) {
  const formData = new FormData();
  formData.append("ticket", new Blob([JSON.stringify(payload)], { type: "application/json" }));
  files.forEach((file) => formData.append("attachments", file));

  const response = await apiClient.post("/tickets", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrapResponse(response);
}

export async function getMyTickets() {
  const response = await apiClient.get("/tickets/my");
  return unwrapResponse(response) ?? [];
}

export async function getAllTickets(filters = {}) {
  const response = await apiClient.get("/tickets", { params: cleanParams(filters) });
  return unwrapResponse(response) ?? [];
}

export async function getTicketById(id) {
  const response = await apiClient.get(`/tickets/${id}`);
  return unwrapResponse(response);
}

export async function updateTicket(id, payload) {
  const response = await apiClient.put(`/tickets/${id}`, payload);
  return unwrapResponse(response);
}

export async function deleteTicket(id) {
  await apiClient.delete(`/tickets/${id}`);
}

export async function assignTicket(id, assignedToEmail) {
  const response = await apiClient.post(`/tickets/${id}/assign`, { assignedToEmail });
  return unwrapResponse(response);
}

export async function updateTicketStatus(id, status, resolutionNotes = "") {
  const response = await apiClient.post(`/tickets/${id}/status`, { status, resolutionNotes });
  return unwrapResponse(response);
}

export async function rejectTicket(id, reason) {
  const response = await apiClient.post(`/tickets/${id}/reject`, { reason });
  return unwrapResponse(response);
}

export async function updateResolutionNotes(id, resolutionNotes) {
  const response = await apiClient.post(`/tickets/${id}/resolution`, { resolutionNotes });
  return unwrapResponse(response);
}

export async function addTicketComment(id, content) {
  const response = await apiClient.post(`/tickets/${id}/comments`, { content });
  return unwrapResponse(response);
}

export async function updateTicketComment(id, commentId, content) {
  const response = await apiClient.put(`/tickets/${id}/comments/${commentId}`, { content });
  return unwrapResponse(response);
}

export async function deleteTicketComment(id, commentId) {
  await apiClient.delete(`/tickets/${id}/comments/${commentId}`);
}

export function attachmentUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
  return `${baseUrl}${path}`;
}
