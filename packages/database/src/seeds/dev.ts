import { seedCommunity } from "./community.seed";
import { seedQuestions } from "./questions.seed";
import { seedStories } from "./stories.seed";
import { seedStoryReports } from "./story-reports.seed";
import type { SeedContext } from "./types";
import { seedUserQuestionLogs } from "./user-question-log.seed";
import { seedUsers } from "./users.seed";

export async function runDevSeed(ctx: SeedContext) {
  await seedUsers(ctx);
  await seedQuestions(ctx);
  await seedStories(ctx);
  await seedUserQuestionLogs(ctx);
  await seedStoryReports(ctx);
  await seedCommunity(ctx);
}
