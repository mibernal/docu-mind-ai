// apps/api/src/shared/db.ts
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

declare global {
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  console.log("Creating Prisma Client with PrismaBetterSqlite3 adapter...");

  // Normaliza DATABASE_URL (sin prefijos incorrectos)
  const rawUrl = process.env.DATABASE_URL ?? "file:./src/prisma/dev.db";

  // Prisma requiere URL tipo file:./db.sqlite
  const normalizedUrl = rawUrl.startsWith("file:")
    ? rawUrl
    : `file:${rawUrl}`;

  // Adapter recibe un objeto con url string
  const adapter = new PrismaBetterSqlite3({
    url: normalizedUrl,
  });

  return new PrismaClient({
    adapter,
    log: ["query", "info", "warn", "error"],
  });
};

export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ DB connected OK");
    return true;
  } catch (err) {
    console.error("❌ DB connection error:", err);
    return false;
  }
}
