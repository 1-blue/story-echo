import type { PrismaClient } from "@prisma/client";

export type SeedContext = {
  prisma: PrismaClient;
};

export type SeedFn = (ctx: SeedContext) => Promise<void>;

export type QuestionSeed = {
  id: string;
  text: string;
  annualKey?: string;
};
