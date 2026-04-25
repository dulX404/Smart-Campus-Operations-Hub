import apiClient from "./client";

const authService = {
  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },

  registerAdmin: async (adminData) => {
    const response = await apiClient.post("/auth/register/admin", adminData);
    return response.data;
  },

  registerStudent: async (studentData) => {
    const response = await apiClient.post("/auth/register/student", studentData);
    return response.data;
  },
};

export default authService;
