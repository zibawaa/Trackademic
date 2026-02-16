import { Router } from "express";
import authRoutes from "./auth.routes";
import assignmentRoutes from "./assignment.routes";

const router = Router();

// Mount route modules
router.use("/auth", authRoutes);
router.use("/assignments", assignmentRoutes);

// Health check
router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Trackademic API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
