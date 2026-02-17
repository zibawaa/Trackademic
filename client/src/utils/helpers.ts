import type { Priority } from "../types";

/** Get Tailwind color classes for a priority level */
export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    LOW: "bg-emerald-100 text-emerald-800",
    MEDIUM: "bg-blue-100 text-blue-800",
    HIGH: "bg-amber-100 text-amber-800",
    URGENT: "bg-red-100 text-red-800",
  };
  return colors[priority];
}

/** Get Tailwind border color for a priority level */
export function getPriorityBorderColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    LOW: "border-l-emerald-400",
    MEDIUM: "border-l-blue-400",
    HIGH: "border-l-amber-400",
    URGENT: "border-l-red-400",
  };
  return colors[priority];
}

/** Get display label for a priority */
export function getPriorityLabel(priority: Priority): string {
  const labels: Record<Priority, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
  };
  return labels[priority];
}

/** Format a date string to a readable format */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Format a date string with time */
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Format a date for input[type="datetime-local"] */
export function toDateTimeLocal(dateStr: string): string {
  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

/** Check if a deadline is overdue */
export function isOverdue(deadline: string, isCompleted: boolean): boolean {
  return !isCompleted && new Date(deadline) < new Date();
}

/** Get the error message from an Axios error */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: { data?: { message?: string; errors?: { message: string }[] } };
    };
    if (axiosError.response?.data?.errors?.length) {
      return axiosError.response.data.errors.map((e) => e.message).join(", ");
    }
    return axiosError.response?.data?.message || "An error occurred";
  }
  if (error instanceof Error) {
    if (error.message.includes("timeout")) {
      return "Server is starting up, please try again in a few seconds";
    }
    if (error.message === "Network Error") {
      return "Cannot reach the server. Please check your connection and try again";
    }
    return error.message;
  }
  return "An unexpected error occurred";
}
