import apiClient from "./client";

function unwrapResponse(response) {
  return response?.data?.data;
}

export async function createBooking(payload) {
  const response = await apiClient.post("/bookings", payload);
  return unwrapResponse(response);
}

export async function getMyBookings() {
  const response = await apiClient.get("/bookings/my");
  return unwrapResponse(response) ?? [];
}

export async function getAllBookings() {
  const response = await apiClient.get("/bookings");
  return unwrapResponse(response) ?? [];
}

export async function getBookingsForResource(resourceId) {
  const response = await apiClient.get(`/bookings/resource/${resourceId}`);
  return unwrapResponse(response) ?? [];
}

export async function getPendingBookings() {
  const response = await apiClient.get("/bookings/pending");
  return unwrapResponse(response) ?? [];
}

export async function approveBooking(id, adminNotes = "") {
  const response = await apiClient.post(`/bookings/${id}/approve`, adminNotes || undefined);
  return unwrapResponse(response);
}

export async function rejectBooking(id, adminNotes = "") {
  const response = await apiClient.post(`/bookings/${id}/reject`, adminNotes || undefined);
  return unwrapResponse(response);
}

export async function cancelBooking(id) {
  const response = await apiClient.post(`/bookings/${id}/cancel`);
  return unwrapResponse(response);
}
