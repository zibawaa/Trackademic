import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type {
  ApiResponse,
  Assignment,
  AssignmentStats,
  AuthResponse,
  CreateAssignmentData,
  UpdateAssignmentData,
} from "../types";

/** Base API client with interceptors for auth and error handling */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Attach JWT token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses by clearing auth state
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<never>>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth API ─────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>("/auth/login", data),

  getProfile: () => api.get<ApiResponse<{ user: AuthResponse["user"] }>>("/auth/me"),
};

// ── Assignment API ───────────────────────────────────────────────────────

export const assignmentApi = {
  getAll: (params?: { course?: string; status?: string; priority?: string }) =>
    api.get<ApiResponse<{ assignments: Assignment[] }>>("/assignments", {
      params,
    }),

  getById: (id: string) =>
    api.get<ApiResponse<{ assignment: Assignment }>>(`/assignments/${id}`),

  create: (data: CreateAssignmentData) =>
    api.post<ApiResponse<{ assignment: Assignment }>>("/assignments", data),

  update: (id: string, data: UpdateAssignmentData) =>
    api.put<ApiResponse<{ assignment: Assignment }>>(`/assignments/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/assignments/${id}`),

  toggleComplete: (id: string) =>
    api.patch<ApiResponse<{ assignment: Assignment }>>(
      `/assignments/${id}/toggle`
    ),

  getStats: () =>
    api.get<ApiResponse<{ stats: AssignmentStats }>>("/assignments/stats"),

  getCourses: () =>
    api.get<ApiResponse<{ courses: string[] }>>("/assignments/courses"),
};

export default api;
