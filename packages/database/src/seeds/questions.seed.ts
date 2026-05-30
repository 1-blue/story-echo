import { QUESTION_SEEDS } from "./questions.data";
import type { SeedFn } from "./types";

export const seedQuestions: SeedFn = async ({ prisma }) => {
  let created = 0;
  let updated = 0;

  for (const question of QUESTION_SEEDS) {
    const existing = await prisma.question.findUnique({
      where: { id: question.id },
      select: { id: true },
    });

    await prisma.question.upsert({
      where: { id: question.id },
      create: {
        id: question.id,
        text: question.text,
        annualKey: question.annualKey,
      },
      update: {
        text: question.text,
        annualKey: question.annualKey,
      },
    });

    if (existing) updated++;
    else created++;
  }

  console.log(`[questions] ${QUESTION_SEEDS.length}건 upsert (신규 ${created}, 갱신 ${updated})`);
};
