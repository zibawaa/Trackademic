import { Request, Response } from "express";
import { AssignmentService } from "../services/assignment.service";
import { asyncHandler } from "../utils/asyncHandler";

/** Assignment controller - handles HTTP requests for assignment endpoints */
export class AssignmentController {
  /** POST /api/assignments */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const assignment = await AssignmentService.create(
      req.user!.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: { assignment },
    });
  });

  /** GET /api/assignments */
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      course: req.query.course as string | undefined,
      status: req.query.status as "completed" | "pending" | "overdue" | undefined,
      priority: req.query.priority as string | undefined,
    };

    const assignments = await AssignmentService.getAll(
      req.user!.userId,
      filters
    );

    res.status(200).json({
      success: true,
      data: { assignments },
    });
  });

  /** GET /api/assignments/stats */
  static getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await AssignmentService.getStats(req.user!.userId);

    res.status(200).json({
      success: true,
      data: { stats },
    });
  });

  /** GET /api/assignments/courses */
  static getCourses = asyncHandler(async (req: Request, res: Response) => {
    const courses = await AssignmentService.getCourses(req.user!.userId);

    res.status(200).json({
      success: true,
      data: { courses },
    });
  });

  /** GET /api/assignments/:id */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const assignment = await AssignmentService.getById(
      req.user!.userId,
      id
    );

    res.status(200).json({
      success: true,
      data: { assignment },
    });
  });

  /** PUT /api/assignments/:id */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const assignment = await AssignmentService.update(
      req.user!.userId,
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      data: { assignment },
    });
  });

  /** DELETE /api/assignments/:id */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await AssignmentService.delete(req.user!.userId, id);

    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  });

  /** PATCH /api/assignments/:id/toggle */
  static toggleComplete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const assignment = await AssignmentService.toggleComplete(
      req.user!.userId,
      id
    );

    res.status(200).json({
      success: true,
      message: assignment.isCompleted
        ? "Assignment marked as complete"
        : "Assignment marked as pending",
      data: { assignment },
    });
  });
}
