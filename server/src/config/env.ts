import dotenv from "dotenv";
import path from "path";

// Load .env file from server root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/** Validated environment configuration */
export const env = {
  // Server
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV !== "production",
  isProd: process.env.NODE_ENV === "production",

  // Database
  DATABASE_URL: process.env.DATABASE_URL!,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // SendGrid
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || "",
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || "noreply@trackademic.com",

  // Frontend
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
} as const;

/** Verify that all required environment variables are present */
export function validateEnv(): void {
  const required = ["DATABASE_URL", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        `Copy .env.example to .env and fill in the values.`
    );
  }
}
