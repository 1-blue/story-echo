import { dayOfYearFromMonthDay, getKstMonthDayDaysAgo } from "../question-calendar";
import { QUESTION_SEEDS } from "./questions.data/index";
import type { SeedFn } from "./types";

/** Echo·질문 노출 테스트용 — 과거 8일치 shownAt */
export const seedUserQuestionLogs: SeedFn = async (ctx) => {
  const userId = ctx.adminUserId;
  if (!userId) {
    throw new Error("[user_question_log] adminUserId 없음");
  }

  await ctx.prisma.userQuestionLog.deleteMany({ where: { userId } });

  const rows = Array.from({ length: 8 }, (_, i) => {
    const daysAgo = i + 30;
    const { month, day } = getKstMonthDayDaysAgo(daysAgo);
    const doy = dayOfYearFromMonthDay(month, day);
    const question = QUESTION_SEEDS[doy - 1]!;
    const shownAt = new Date();
    shownAt.setUTCDate(shownAt.getUTCDate() - daysAgo);
    shownAt.setUTCHours(9, 0, 0, 0);

    return {
      userId,
      questionId: question.id,
      shownAt,
    };
  });

  await ctx.prisma.userQuestionLog.createMany({ data: rows, skipDuplicates: true });
  console.log(`[user_question_log] ${rows.length}건 생성 (관리자, Echo 테스트)`);
};
