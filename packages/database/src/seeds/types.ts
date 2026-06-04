import type { PrismaClient } from "@prisma/client";

export type SeedContext = {
  prisma: PrismaClient;
  /** seedUsers 실행 후 설정 — stories 등에서 사용 */
  adminUserId?: string;
};

export type SeedFn = (ctx: SeedContext) => Promise<void>;

export type QuestionSeed = {
  id: string;
  text: string;
  month: number;
  day: number;
};
