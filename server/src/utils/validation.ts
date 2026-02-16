import { z } from "zod";

/** Schema for user registration */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters"),
});

/** Schema for user login */
export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required"),
});

/** Schema for creating an assignment */
export const createAssignmentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .trim()
    .optional()
    .nullable(),
  course: z
    .string()
    .min(1, "Course is required")
    .max(100, "Course must be less than 100 characters")
    .trim(),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid deadline date"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

/** Schema for updating an assignment */
export const updateAssignmentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .trim()
    .optional()
    .nullable(),
  course: z
    .string()
    .min(1, "Course is required")
    .max(100, "Course must be less than 100 characters")
    .trim()
    .optional(),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid deadline date")
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  isCompleted: z.boolean().optional(),
});

// Export inferred types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
