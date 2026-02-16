import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";

/** Authentication controller - handles HTTP requests for auth endpoints */
export class AuthController {
  /** POST /api/auth/register */
  static register = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  });

  /** POST /api/auth/login */
  static login = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  });

  /** GET /api/auth/me */
  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.getProfile(req.user!.userId);

    res.status(200).json({
      success: true,
      data: { user },
    });
  });
}
