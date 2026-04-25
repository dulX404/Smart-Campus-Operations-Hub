import apiClient from "./client";

const notificationService = {
  getNotifications: async () => {
    const response = await apiClient.get("/notifications");
    return response.data;
  },

  createNotification: async (data) => {
    const response = await apiClient.post("/notifications", data);
    return response.data;
  },

  updateNotification: async (id, data) => {
    const response = await apiClient.put(`/notifications/${id}`, data);
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },
};

export default notificationService;
