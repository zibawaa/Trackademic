import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps async route handlers to automatically catch errors
 * and forward them to Express error handling middleware.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
