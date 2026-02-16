import { PrismaClient } from "@prisma/client";
import { env } from "./env";

/** Singleton Prisma client instance */
const prisma = new PrismaClient({
  log: env.isDev ? ["query", "error", "warn"] : ["error"],
});

export default prisma;
