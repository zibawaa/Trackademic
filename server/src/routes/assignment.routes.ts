import { Router } from "express";
import { AssignmentController } from "../controllers/assignment.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createAssignmentSchema,
  updateAssignmentSchema,
} from "../utils/validation";

const router = Router();

// All assignment routes require authentication
router.use(authenticate);

// Assignment CRUD
router.post("/", validate(createAssignmentSchema), AssignmentController.create);
router.get("/", AssignmentController.getAll);
router.get("/stats", AssignmentController.getStats);
router.get("/courses", AssignmentController.getCourses);
router.get("/:id", AssignmentController.getById);
router.put(
  "/:id",
  validate(updateAssignmentSchema),
  AssignmentController.update
);
router.delete("/:id", AssignmentController.delete);
router.patch("/:id/toggle", AssignmentController.toggleComplete);

export default router;
