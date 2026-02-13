import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit during Next.js hot reloads.

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // ✅ PERFORMANCE: Only log errors in production, queries in dev
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
    // ✅ RELIABILITY: Set datasource URL with pool params if not already set
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ✅ RELIABILITY: Graceful shutdown to release connections
if (process.env.NODE_ENV === "production") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}

export const db = prisma;

/**
 * Wrapper for Prisma queries with automatic retry on transient errors
 * (e.g., connection timeouts, pool exhaustion, "timer has gone away")
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 500
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isTransient =
        error.code === "P2024" || // Connection pool timeout
        error.code === "P1017" || // Server has closed the connection
        error.code === "P1001" || // Can't reach database server
        error.message?.includes("timer has gone away") ||
        error.message?.includes("PANIC") ||
        error.message?.includes("Connection refused");

      if (isTransient && attempt < retries) {
        console.warn(
          `[Prisma] Transient error (attempt ${attempt + 1}/${retries + 1}), retrying in ${delayMs}ms...`,
          error.code || error.message?.substring(0, 100)
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));

        // Try to reconnect
        try {
          await prisma.$disconnect();
          await prisma.$connect();
        } catch {
          // Ignore reconnect errors, the next query attempt will try to connect
        }
        continue;
      }
      throw error;
    }
  }
  // This should never be reached, but TypeScript needs it
  throw new Error("Retry logic exhausted");
}
