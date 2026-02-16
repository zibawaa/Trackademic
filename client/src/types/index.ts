/** Priority levels matching the backend enum */
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

/** Assignment status for filtering */
export type AssignmentStatus = "completed" | "pending" | "overdue";

/** User object returned from the API */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

/** Assignment object returned from the API */
export interface Assignment {
  id: string;
  title: string;
  description: string | null;
  course: string;
  deadline: string;
  priority: Priority;
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Form data for creating a new assignment */
export interface CreateAssignmentData {
  title: string;
  description?: string;
  course: string;
  deadline: string;
  priority: Priority;
}

/** Form data for updating an assignment */
export interface UpdateAssignmentData {
  title?: string;
  description?: string | null;
  course?: string;
  deadline?: string;
  priority?: Priority;
  isCompleted?: boolean;
}

/** Dashboard statistics */
export interface AssignmentStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

/** Standard API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { field: string; message: string }[];
}

/** Auth response from login/register */
export interface AuthResponse {
  user: User;
  token: string;
}
