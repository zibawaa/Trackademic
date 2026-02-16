import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

/**
 * Global error handling middleware.
 * Catches all errors thrown in route handlers and returns
 * a consistent JSON error response.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error in development
  if (env.isDev) {
    console.error("❌ Error:", err);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages,
    });
    return;
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Handle unknown errors
  res.status(500).json({
    success: false,
    message: env.isProd ? "Internal server error" : err.message,
  });
};
