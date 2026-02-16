import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import { ApiError } from "../utils/ApiError";
import {
  CreateAssignmentInput,
  UpdateAssignmentInput,
} from "../utils/validation";

/** Query filters for listing assignments */
interface AssignmentFilters {
  course?: string;
  status?: "completed" | "pending" | "overdue";
  priority?: string;
}

/** Assignment service - handles all assignment business logic */
export class AssignmentService {
  /**
   * Create a new assignment for the authenticated user.
   */
  static async create(userId: string, input: CreateAssignmentInput) {
    const assignment = await prisma.assignment.create({
      data: {
        title: input.title,
        description: input.description || null,
        course: input.course,
        deadline: new Date(input.deadline),
        priority: input.priority,
        userId,
      },
    });

    return assignment;
  }

  /**
   * Get all assignments for a user with optional filters.
   */
  static async getAll(userId: string, filters: AssignmentFilters) {
    const where: Prisma.AssignmentWhereInput = { userId };
    const now = new Date();

    // Filter by course
    if (filters.course) {
      where.course = filters.course;
    }

    // Filter by priority
    if (filters.priority) {
      where.priority = filters.priority as any;
    }

    // Filter by status
    if (filters.status === "completed") {
      where.isCompleted = true;
    } else if (filters.status === "pending") {
      where.isCompleted = false;
      where.deadline = { gte: now };
    } else if (filters.status === "overdue") {
      where.isCompleted = false;
      where.deadline = { lt: now };
    }

    const assignments = await prisma.assignment.findMany({
      where,
      orderBy: [{ deadline: "asc" }],
    });

    return assignments;
  }

  /**
   * Get a single assignment by ID (must belong to user).
   */
  static async getById(userId: string, assignmentId: string) {
    const assignment = await prisma.assignment.findFirst({
      where: { id: assignmentId, userId },
    });

    if (!assignment) {
      throw ApiError.notFound("Assignment not found");
    }

    return assignment;
  }

  /**
   * Update an assignment (must belong to user).
   */
  static async update(
    userId: string,
    assignmentId: string,
    input: UpdateAssignmentInput
  ) {
    // Verify ownership
    await AssignmentService.getById(userId, assignmentId);

    const data: Prisma.AssignmentUpdateInput = {};

    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.course !== undefined) data.course = input.course;
    if (input.deadline !== undefined) data.deadline = new Date(input.deadline);
    if (input.priority !== undefined) data.priority = input.priority;

    // Handle completion status with timestamp
    if (input.isCompleted !== undefined) {
      data.isCompleted = input.isCompleted;
      data.completedAt = input.isCompleted ? new Date() : null;
    }

    const updated = await prisma.assignment.update({
      where: { id: assignmentId },
      data,
    });

    return updated;
  }

  /**
   * Delete an assignment (must belong to user).
   */
  static async delete(userId: string, assignmentId: string) {
    // Verify ownership
    await AssignmentService.getById(userId, assignmentId);

    await prisma.assignment.delete({
      where: { id: assignmentId },
    });
  }

  /**
   * Toggle the completion status of an assignment.
   */
  static async toggleComplete(userId: string, assignmentId: string) {
    const assignment = await AssignmentService.getById(userId, assignmentId);

    const updated = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        isCompleted: !assignment.isCompleted,
        completedAt: !assignment.isCompleted ? new Date() : null,
      },
    });

    return updated;
  }

  /**
   * Get distinct courses for a user (for filter dropdowns).
   */
  static async getCourses(userId: string) {
    const assignments = await prisma.assignment.findMany({
      where: { userId },
      select: { course: true },
      distinct: ["course"],
      orderBy: { course: "asc" },
    });

    return assignments.map((a) => a.course);
  }

  /**
   * Get assignment stats for the dashboard.
   */
  static async getStats(userId: string) {
    const now = new Date();

    const [total, completed, pending, overdue] = await Promise.all([
      prisma.assignment.count({ where: { userId } }),
      prisma.assignment.count({ where: { userId, isCompleted: true } }),
      prisma.assignment.count({
        where: { userId, isCompleted: false, deadline: { gte: now } },
      }),
      prisma.assignment.count({
        where: { userId, isCompleted: false, deadline: { lt: now } },
      }),
    ]);

    return { total, completed, pending, overdue };
  }
}
