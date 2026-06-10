import type { Metadata } from "next";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { QuestionsPageClient } from "./_components/questions-page-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = getSharedMetadata({
  title: "질문 모아보기",
  description:
    "이야기해줘 365일 질문 아카이브. 날짜별 질문을 확인하고, 같은 질문에 대한 공개된 이야기를 모아볼 수 있어요.",
  robots: { index: true, follow: true },
});

export default function QuestionsPage() {
  return <QuestionsPageClient />;
}
