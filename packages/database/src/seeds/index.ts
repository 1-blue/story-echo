import { PrismaClient } from "@prisma/client";
import { seedQuestions } from "./questions.seed";
import { seedStories } from "./stories.seed";
import { seedStoryReports } from "./story-reports.seed";
import { seedUserQuestionLogs } from "./user-question-log.seed";
import { seedUsers } from "./users.seed";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 StoryEcho seed 시작\n");

  const ctx = { prisma };

  // FK 순서: users → questions → stories → logs/reports
  await seedUsers(ctx);
  await seedQuestions(ctx);
  await seedStories(ctx);
  await seedUserQuestionLogs(ctx);
  await seedStoryReports(ctx);

  console.log("\n✅ Seed 완료");
}

main()
  .catch((error) => {
    console.error("❌ Seed 실패:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
