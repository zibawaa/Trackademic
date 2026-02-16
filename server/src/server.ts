import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env, validateEnv } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";
import { startReminderJob } from "./jobs/reminderJob";

// Validate environment variables before starting
validateEnv();

const app = express();

// ── Security Middleware ──────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL.split(",").map((url) => url.trim()),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting - 100 requests per 15 minutes per IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ── Body Parsing ─────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ── API Routes ───────────────────────────────────────────────────────────
app.use("/api", routes);

// ── 404 Handler ──────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global Error Handler ─────────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────────────────
app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`\n🚀 Trackademic API running on http://localhost:${env.PORT}`);
  console.log(`📋 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Client URL: ${env.CLIENT_URL}\n`);

  // Start the reminder cron job
  startReminderJob();
});

export default app;
