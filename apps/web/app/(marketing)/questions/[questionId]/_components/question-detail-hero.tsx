"use client";

import type { QuestionArchiveItem } from "@storyecho/api-client";
import { getKstMonthDay } from "@storyecho/database/question-calendar";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { formatQuestionDate } from "@/lib/format-question-date";

type QuestionDetailHeroProps = {
  question: QuestionArchiveItem;
};

export function QuestionDetailHero({ question }: QuestionDetailHeroProps) {
  const today = getKstMonthDay();
  const isToday = question.month === today.month && question.day === today.day;

  return (
    <BlurFade delay={0} inView className="space-y-4 text-center">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant="secondary">{formatQuestionDate(question.month, question.day)}</Badge>
        {isToday && <Badge variant="echo">오늘</Badge>}
        {question.publicStoryCount > 0 && (
          <Badge variant="outline">공개 {question.publicStoryCount}</Badge>
        )}
      </div>
      <h2 className="font-display text-2xl leading-snug font-medium break-keep">{question.text}</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">
        이 질문에 대한 공개 이야기예요. 작성 날짜와 관계없이 모아볼 수 있어요.
      </p>
    </BlurFade>
  );
}
