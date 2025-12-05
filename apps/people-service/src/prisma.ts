import { PrismaClient } from "../generated/prisma-client";

declare global {
  var __prismaPeople: PrismaClient | undefined;
}

export const prisma = global.__prismaPeople ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.__prismaPeople = prisma;
