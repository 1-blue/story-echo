import { seedQuestions } from "./questions.seed";
import type { SeedContext } from "./types";
import { seedUsers } from "./users.seed";

export async function runProdSeed(ctx: SeedContext) {
  console.warn("[seed] prod 프로필: 관리자 + 365 질문만 시드합니다.\n");
  await seedUsers(ctx);
  await seedQuestions(ctx);
}
