import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { isAwsConfigured } from "@/lib/env/aws";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { getTodayQuestion } from "@/lib/today-question";
import { getWriteCapabilities } from "@/lib/get-write-capabilities";
import { requireMemberUser } from "@/lib/user/require-member-user";
import { CommunityWriteForm } from "./_components/community-write-form";

export const metadata: Metadata = getSharedMetadata({
  title: "토론 시작",
  description: "오늘의 질문으로 토론을 시작하세요.",
});

async function getPreviousQuestions(excludeId: string | null) {
  if (!isDatabaseConfigured()) return [];

  try {
    const questions = await prisma.question.findMany({
      where: excludeId ? { id: { not: excludeId } } : undefined,
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, text: true },
    });

    return questions.map((q) => ({
      id: q.id,
      text: q.text,
      label: "이전 질문",
    }));
  } catch {
    return [];
  }
}

export default async function CommunityWritePage() {
  await requireMemberUser("/app/community/write");

  const [todayQuestion, capabilities, previousQuestions] = await Promise.all([
    getTodayQuestion(),
    getWriteCapabilities(),
    getTodayQuestion().then((q) => getPreviousQuestions(q.id)),
  ]);

  return (
    <CommunityWriteForm
      mode="create"
      todayQuestion={todayQuestion}
      previousQuestions={previousQuestions}
      photoUploadEnabled={isAwsConfigured()}
      capabilities={capabilities}
    />
  );
}
