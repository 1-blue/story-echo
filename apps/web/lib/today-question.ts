import { prisma } from "@/lib/prisma";
import { getKstDayRangeUtc } from "@/lib/notifications/kst";
import { isDatabaseConfigured } from "@/lib/story-mapper";

const FALLBACK_QUESTION = {
  id: null as string | null,
  text: "오늘 가장 기억에 남는 순간은 무엇인가요?",
};

const KOREAN_WEEKDAYS = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"] as const;

export type TodayQuestion = {
  id: string | null;
  text: string;
};

export function formatKoreanDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = KOREAN_WEEKDAYS[date.getDay()];
  return `${month}월 ${day}일 ${weekday}`;
}

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export async function getTodayQuestion(): Promise<TodayQuestion> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_QUESTION;
  }

  try {
    const count = await prisma.question.count();
    if (count === 0) {
      return FALLBACK_QUESTION;
    }

    const index = dayOfYear(new Date()) % count;
    const question = await prisma.question.findFirst({
      skip: index,
      orderBy: { createdAt: "asc" },
      select: { id: true, text: true },
    });

    if (!question) {
      return FALLBACK_QUESTION;
    }

    return { id: question.id, text: question.text };
  } catch {
    return FALLBACK_QUESTION;
  }
}

/** @deprecated use getTodayQuestion().text */
export async function getTodayQuestionText(): Promise<string> {
  const question = await getTodayQuestion();
  return question.text;
}

/** 오늘 질문에 대한 KST 당일 일반 이야기(비캡슐) ID. 없으면 null */
export async function getTodayStoryForUser(
  userId: string,
  questionId: string,
): Promise<string | null> {
  if (!isDatabaseConfigured()) return null;

  const { start, end } = getKstDayRangeUtc();

  const story = await prisma.story.findFirst({
    where: {
      userId,
      questionId,
      isCapsule: false,
      createdAt: { gte: start, lt: end },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  return story?.id ?? null;
}
