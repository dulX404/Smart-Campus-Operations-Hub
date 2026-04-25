import apiClient from "./client";

function unwrapResponse(response) {
  return response?.data?.data;
}

export async function getResources(filters = {}) {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== "" && value !== null && value !== undefined)
  );

  const response = await apiClient.get("/resources", { params });
  return unwrapResponse(response) ?? [];
}

export async function getResourceById(id) {
  const response = await apiClient.get(`/resources/${id}`);
  return unwrapResponse(response);
}

export async function createResource(payload) {
  const response = await apiClient.post("/resources", payload);
  return unwrapResponse(response);
}

export async function updateResource(id, payload) {
  const response = await apiClient.put(`/resources/${id}`, payload);
  return unwrapResponse(response);
}

export async function deleteResource(id) {
  await apiClient.delete(`/resources/${id}`);
}
