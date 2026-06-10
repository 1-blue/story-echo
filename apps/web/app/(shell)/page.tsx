import type { Metadata } from "next";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { formatKoreanDate, getTodayQuestion, getTodayStoryForUser } from "@/lib/today-question";
import { resolveCurrentUserFromHeaders } from "@/lib/user/resolve-current-user";
import { HomePageClient } from "./_components/home-page-client";

export const metadata: Metadata = getSharedMetadata({
  title: "오늘의 질문",
  description: "매일 하나의 질문에 답하고 오늘의 이야기를 남기세요.",
});

export default async function AppHomePage() {
  const todayQuestion = await getTodayQuestion();
  const dateLabel = formatKoreanDate(new Date());

  let todayStoryId: string | null = null;
  if (todayQuestion.id) {
    try {
      const user = await resolveCurrentUserFromHeaders();
      todayStoryId = await getTodayStoryForUser(user.id, todayQuestion.id);
    } catch {
      todayStoryId = null;
    }
  }

  return (
    <HomePageClient
      questionText={todayQuestion.text}
      dateLabel={dateLabel}
      todayStoryId={todayStoryId}
    />
  );
}
