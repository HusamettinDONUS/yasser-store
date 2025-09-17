// Prisma client singleton with error handling
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaClient: PrismaClient | undefined;

try {
  prismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      errorFormat: "pretty",
    });
} catch (error) {
  console.error("Failed to initialize Prisma client:", error);
  // Fallback: Create a minimal client for development
  prismaClient = new PrismaClient({
    log: ["error"],
    errorFormat: "minimal",
  });
}

export const prisma = prismaClient!;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
