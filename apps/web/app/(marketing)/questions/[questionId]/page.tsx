import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { QuestionDetailPageClient } from "./_components/question-detail-page-client";

type QuestionDetailPageProps = {
  params: Promise<{ questionId: string }>;
};

export const dynamic = "force-dynamic";

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

export async function generateMetadata({ params }: QuestionDetailPageProps): Promise<Metadata> {
  const { questionId } = await params;

  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { text: true, month: true, day: true },
    });

    if (!question) {
      return getSharedMetadata({
        title: "질문 상세",
        description: "질문을 찾을 수 없습니다.",
        robots: { index: false, follow: false },
      });
    }

    return getSharedMetadata({
      title: truncate(question.text, 40),
      description: `${question.month}월 ${question.day}일 질문과 공개된 이야기를 모아봅니다.`,
      robots: { index: true, follow: true },
    });
  } catch {
    return getSharedMetadata({
      title: "질문 상세",
      robots: { index: true, follow: true },
    });
  }
}

export default async function QuestionDetailPage({ params }: QuestionDetailPageProps) {
  const { questionId } = await params;

  if (isDatabaseConfigured()) {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { id: true },
    });
    if (!question) {
      notFound();
    }
  }

  return <QuestionDetailPageClient questionId={questionId} />;
}
