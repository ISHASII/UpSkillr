import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_STORAGE_KEY = "token";

let unauthorizedHandler = null;

const api = axios.create({
  baseURL,
});

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.status === 401 &&
      typeof unauthorizedHandler === "function"
    ) {
      unauthorizedHandler(error);
    }

    return Promise.reject(error);
  },
);

export const authApi = {
  register: (payload) => api.post("/api/auth/register", payload),
  login: (payload) => api.post("/api/auth/login", payload),
  loginWithGoogle: (payload) => api.post("/api/auth/google", payload),
  requestForgotPasswordOtp: (payload) =>
    api.post("/api/auth/forgot-password/request-otp", payload),
  verifyForgotPasswordOtp: (payload) =>
    api.post("/api/auth/forgot-password/verify-otp", payload),
  resetPasswordWithOtp: (payload) =>
    api.post("/api/auth/forgot-password/reset", payload),
};

export const moduleApi = {
  getAll: () => api.get("/api/modules"),
  getRecommendedForMe: () => api.get("/api/modules/recommendations/me"),
  create: (payload) => api.post("/api/modules", payload),
  update: (id, payload) => api.put(`/api/modules/${id}`, payload),
  remove: (id) => api.delete(`/api/modules/${id}`),
};

export const userApi = {
  getAll: () => api.get("/api/users"),
  getPendingRegistrations: () => api.get("/api/users/registrations/pending"),
  decideRegistration: (id, payload) =>
    api.put(`/api/users/registrations/${id}/decision`, payload),
  create: (payload) => api.post("/api/users", payload),
  getById: (id) => api.get(`/api/users/${id}`),
  update: (id, payload) => api.put(`/api/users/${id}`, payload),
  remove: (id) => api.delete(`/api/users/${id}`),
  updateProfileSkills: (skills) => api.put("/api/users/profile", { skills }),
};

export const skillApi = {
  getAll: () => api.get("/api/skills"),
  create: (payload) => api.post("/api/skills", payload),
  update: (id, payload) => api.put(`/api/skills/${id}`, payload),
  remove: (id) => api.delete(`/api/skills/${id}`),
  getById: (id) => api.get(`/api/skills/${id}`),
};

export const logApi = {
  getAll: () => api.get("/api/logs"),
  getMine: () => api.get("/api/logs/me"),
  getByModule: (moduleId) => api.get(`/api/logs/module/${moduleId}`),
  create: (moduleId) => api.post("/api/logs", { module_id: moduleId }),
  submitTask: (id, payload) => api.put(`/api/logs/${id}/submission`, payload),
  validate: (id, payload) => api.put(`/api/logs/${id}/validation`, payload),
};

export default api;
