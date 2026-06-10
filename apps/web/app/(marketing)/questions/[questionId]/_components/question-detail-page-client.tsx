"use client";

import { Suspense } from "react";
import { useGetApiV1QuestionsIdSuspense } from "@storyecho/api-client";
import { BlurFade } from "@/components/magicui/blur-fade";
import { PublicStoriesFeed } from "@/components/public/public-stories-feed";
import { QuestionDetailHeader } from "./question-detail-header";
import { QuestionDetailHero } from "./question-detail-hero";

type QuestionDetailContentProps = {
  questionId: string;
};

function QuestionDetailFeed({ questionId }: { questionId: string }) {
  return (
    <BlurFade delay={0.12} inView>
      <PublicStoriesFeed
        questionId={questionId}
        title="이 질문의 공개 이야기"
        hideQuestionOnCard
        emptyState={
          <div className="rounded-xl border border-hairline bg-white px-5 py-10 text-center shadow-sm">
            <p className="text-sm leading-relaxed text-charcoal">
              아직 이 질문에 공개된 이야기가 없어요.
            </p>
          </div>
        }
      />
    </BlurFade>
  );
}

function QuestionDetailInner({ questionId }: QuestionDetailContentProps) {
  const { data } = useGetApiV1QuestionsIdSuspense(questionId);
  const question = data.data;

  return (
    <>
      <QuestionDetailHero question={question} />
      <Suspense
        fallback={<div className="h-32 animate-pulse rounded-xl border border-hairline bg-white" />}
      >
        <QuestionDetailFeed questionId={questionId} />
      </Suspense>
    </>
  );
}

export function QuestionDetailPageClient({ questionId }: QuestionDetailContentProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <QuestionDetailHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-5 py-8">
        <Suspense
          fallback={
            <div className="h-40 animate-pulse rounded-xl border border-hairline bg-white" />
          }
        >
          <QuestionDetailInner questionId={questionId} />
        </Suspense>
      </main>
    </div>
  );
}
