import { PrismaClient } from "../generated/prisma-client";

declare global {
  var __prismaEvent: PrismaClient | undefined;
}

export const prisma = global.__prismaEvent ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.__prismaEvent = prisma;
