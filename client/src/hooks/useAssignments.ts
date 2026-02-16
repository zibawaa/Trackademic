import { useState, useEffect, useCallback } from "react";
import { assignmentApi } from "../services/api";
import type {
  Assignment,
  AssignmentStats,
  CreateAssignmentData,
  UpdateAssignmentData,
} from "../types";
import { AxiosError } from "axios";

/**
 * Custom hook that manages all assignment state and operations.
 * Provides CRUD functions and auto-fetches data on mount.
 */
export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState<AssignmentStats | null>(null);
  const [courses, setCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [courseFilter, setCourseFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  /** Fetch all assignments with current filters */
  const fetchAssignments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params: Record<string, string> = {};
      if (courseFilter) params.course = courseFilter;
      if (statusFilter) params.status = statusFilter;

      const [assignRes, statsRes, coursesRes] = await Promise.all([
        assignmentApi.getAll(params),
        assignmentApi.getStats(),
        assignmentApi.getCourses(),
      ]);

      setAssignments(assignRes.data.data!.assignments);
      setStats(statsRes.data.data!.stats);
      setCourses(coursesRes.data.data!.courses);
    } catch (err) {
      const msg =
        err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : "Failed to fetch assignments";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [courseFilter, statusFilter]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  /** Create a new assignment */
  const createAssignment = async (data: CreateAssignmentData) => {
    const res = await assignmentApi.create(data);
    await fetchAssignments();
    return res.data.data!.assignment;
  };

  /** Update an existing assignment */
  const updateAssignment = async (id: string, data: UpdateAssignmentData) => {
    const res = await assignmentApi.update(id, data);
    await fetchAssignments();
    return res.data.data!.assignment;
  };

  /** Delete an assignment */
  const deleteAssignment = async (id: string) => {
    await assignmentApi.delete(id);
    await fetchAssignments();
  };

  /** Toggle assignment completion */
  const toggleComplete = async (id: string) => {
    const res = await assignmentApi.toggleComplete(id);
    await fetchAssignments();
    return res.data.data!.assignment;
  };

  return {
    assignments,
    stats,
    courses,
    isLoading,
    error,
    courseFilter,
    setCourseFilter,
    statusFilter,
    setStatusFilter,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    toggleComplete,
  };
}
