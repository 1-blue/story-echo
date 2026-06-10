"use client";

import { formatQuestionMonthLabel } from "@/lib/format-question-date";
import { cn } from "@/lib/utils";

type QuestionsMonthNavProps = {
  months: number[];
  activeMonth: number;
  onMonthSelect: (month: number) => void;
};

export function QuestionsMonthNav({ months, activeMonth, onMonthSelect }: QuestionsMonthNavProps) {
  return (
    <nav
      aria-label="월별 질문"
      className="sticky top-[calc(4rem+var(--safe-area-top))] z-30 -mx-5 border-b border-hairline bg-canvas/95 px-5 py-3 backdrop-blur-sm"
    >
      <div className="flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {months.map((month) => (
          <button
            key={month}
            type="button"
            onClick={() => onMonthSelect(month)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeMonth === month
                ? "bg-primary text-primary-foreground"
                : "border border-hairline bg-white text-charcoal",
            )}
          >
            {formatQuestionMonthLabel(month)}
          </button>
        ))}
      </div>
    </nav>
  );
}
