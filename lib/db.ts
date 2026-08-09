import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

declare global {
  var prisma: PrismaClient | undefined;
  var pgPool: Pool | undefined;
}

const pool =
  globalThis.pgPool ||
  new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: connectionString?.includes("supabase") || connectionString?.includes("pooler")
      ? { rejectUnauthorized: false }
      : undefined,
  });

globalThis.pgPool = pool;

const adapter = new PrismaPg(pool);

export const db =
  globalThis.prisma ||
  new PrismaClient({
    adapter,
  });

globalThis.prisma = db;