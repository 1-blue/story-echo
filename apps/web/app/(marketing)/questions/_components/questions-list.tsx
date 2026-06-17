"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useGetApiV1Questions } from "@storyecho/api-client";
import { getKstMonthDay } from "@storyecho/database/question-calendar";
import { AnimatedList, AnimatedListItem } from "@/components/magicui/animated-list";
import { BlurFade } from "@/components/magicui/blur-fade";
import { QuestionTagFilter } from "@/components/question/question-tag-filter";
import { Button } from "@/components/ui/button";
import type { QuestionTagKey } from "@/lib/question-tags";
import { groupQuestionsByMonth } from "@/lib/format-question-date";
import { QuestionListItem } from "./question-list-item";
import { QuestionsMonthNav } from "./questions-month-nav";

export function QuestionsList() {
  const [selectedTags, setSelectedTags] = useState<QuestionTagKey[]>([]);
  const tagsQuery =
    selectedTags.length > 0 ? selectedTags.join(",") : undefined;

  const { data, isLoading, isError } = useGetApiV1Questions(
    { tags: tagsQuery },
    { query: { staleTime: 5 * 60_000 } },
  );

  const questions = data?.data ?? [];
  const today = getKstMonthDay();
  const isFiltered = selectedTags.length > 0;

  const groups = useMemo(() => groupQuestionsByMonth(questions), [questions]);
  const months = useMemo(() => groups.map((group) => group.month), [groups]);

  const [activeMonth, setActiveMonth] = useState(today.month);
  const hasInitialScrolled = useRef(false);

  const scrollToMonth = (month: number, behavior: ScrollBehavior = "smooth") => {
    setActiveMonth(month);
    document.getElementById(`month-${month}`)?.scrollIntoView({ behavior, block: "start" });
  };

  const scrollToToday = (behavior: ScrollBehavior = "smooth") => {
    scrollToMonth(today.month, behavior);
    window.requestAnimationFrame(() => {
      document.getElementById(`question-${today.month}-${today.day}`)?.scrollIntoView({
        behavior,
        block: "center",
      });
    });
  };

  useLayoutEffect(() => {
    if (isFiltered || hasInitialScrolled.current) return;
    hasInitialScrolled.current = true;

    setActiveMonth(today.month);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(`month-${today.month}`)?.scrollIntoView({
          behavior: "instant",
          block: "start",
        });
        document.getElementById(`question-${today.month}-${today.day}`)?.scrollIntoView({
          behavior: "instant",
          block: "center",
        });
      });
    });
  }, [isFiltered, today.day, today.month]);

  if (isLoading && questions.length === 0) {
    return (
      <div className="flex flex-col gap-4 pb-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-xl border border-hairline bg-white"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-destructive">질문 목록을 불러오지 못했어요.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <BlurFade delay={0} inView>
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            365일, 하루에 하나씩 이어지는 질문이에요. 날짜를 눌러 그날의 질문과 공개된 이야기를 볼
            수 있어요.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => scrollToToday("smooth")}>
            오늘로 이동
          </Button>
        </div>
      </BlurFade>

      <QuestionTagFilter selected={selectedTags} onChange={setSelectedTags} />

      {!isFiltered && (
        <QuestionsMonthNav months={months} activeMonth={activeMonth} onMonthSelect={scrollToMonth} />
      )}

      {questions.length === 0 ? (
        <p className="py-8 text-center text-sm text-stone">선택한 태그에 해당하는 질문이 없어요.</p>
      ) : (
        <div className="flex flex-col gap-8 pb-8">
          {groups.map((group, groupIndex) => (
            <BlurFade key={group.month} delay={0.04 * groupIndex} inView>
              <section id={`month-${group.month}`} className="scroll-mt-36 space-y-3">
                <h2 className="text-base font-semibold text-charcoal">{group.monthLabel}</h2>
                <AnimatedList className="gap-3">
                  {group.items.map((question) => (
                    <AnimatedListItem key={question.id}>
                      <QuestionListItem
                        question={question}
                        isToday={question.month === today.month && question.day === today.day}
                      />
                    </AnimatedListItem>
                  ))}
                </AnimatedList>
              </section>
            </BlurFade>
          ))}
        </div>
      )}
    </div>
  );
}
