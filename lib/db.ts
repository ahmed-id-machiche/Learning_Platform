import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

declare global {
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  if (connectionString) {
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({ adapter });
  }
  return new PrismaClient();
};

export const db = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;