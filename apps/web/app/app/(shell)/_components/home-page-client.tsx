"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { QuestionCard } from "@/components/question-card";
import { PublicStoriesFeed } from "./public-stories-feed";

type HomePageClientProps = {
  questionText: string;
  dateLabel: string;
  todayStoryId?: string | null;
};

export function HomePageClient({
  questionText,
  dateLabel,
  todayStoryId = null,
}: HomePageClientProps) {
  return (
    <main className="flex flex-1 flex-col overflow-y-auto px-5 pt-6 pb-[calc(var(--shell-tab-height)+var(--ad-strip-height)+2rem+var(--safe-area-bottom))]">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <BlurFade delay={0}>
          <p className="relative mb-6 w-full text-center text-xs tracking-widest text-stone uppercase">
            <span className="relative z-10 bg-canvas px-4">{dateLabel}</span>
            <span className="absolute top-1/2 left-0 block h-px w-full -translate-y-1/2 bg-hairline-strong opacity-30" />
          </p>
        </BlurFade>

        <BlurFade delay={0.08} className="w-full">
          <QuestionCard question={questionText} todayStoryId={todayStoryId} />
        </BlurFade>

        <BlurFade delay={0.16} className="w-full">
          <PublicStoriesFeed />
        </BlurFade>
      </div>
    </main>
  );
}
