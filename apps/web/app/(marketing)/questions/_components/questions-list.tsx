"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useGetApiV1QuestionsSuspense } from "@storyecho/api-client";
import { getKstMonthDay } from "@storyecho/database/question-calendar";
import { AnimatedList, AnimatedListItem } from "@/components/magicui/animated-list";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { groupQuestionsByMonth } from "@/lib/format-question-date";
import { QuestionListItem } from "./question-list-item";
import { QuestionsMonthNav } from "./questions-month-nav";

export function QuestionsList() {
  const { data } = useGetApiV1QuestionsSuspense();
  const questions = data.data;
  const today = getKstMonthDay();

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
    if (hasInitialScrolled.current) return;
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
  }, [today.day, today.month]);

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

      <QuestionsMonthNav months={months} activeMonth={activeMonth} onMonthSelect={scrollToMonth} />

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
    </div>
  );
}
