import type { PrismaClient } from "@storyecho/database";

declare global {
  var testPrisma: PrismaClient | undefined;
}

export {};
