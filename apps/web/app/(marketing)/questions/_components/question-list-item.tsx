"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { QuestionArchiveItem } from "@storyecho/api-client";
import { Badge } from "@/components/ui/badge";
import { formatQuestionDate } from "@/lib/format-question-date";
import { questionDetailRoute } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

type QuestionListItemProps = {
  question: QuestionArchiveItem;
  isToday: boolean;
};

export function QuestionListItem({ question, isToday }: QuestionListItemProps) {
  const detail = questionDetailRoute(question.id);

  return (
    <Link
      id={`question-${question.month}-${question.day}`}
      href={detail.url}
      className={cn(
        "flex min-h-[4.5rem] items-start gap-3 rounded-xl border border-hairline bg-white p-4 shadow-sm transition-shadow hover:shadow-md",
        isToday && "ring-2 ring-primary/30",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-stone">
            {formatQuestionDate(question.month, question.day)}
          </span>
          {isToday && (
            <Badge variant="echo" className="px-2 py-0 text-[10px]">
              오늘
            </Badge>
          )}
          {question.publicStoryCount > 0 && (
            <Badge variant="secondary" className="px-2 py-0 text-[10px]">
              공개 {question.publicStoryCount}
            </Badge>
          )}
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink">{question.text}</p>
      </div>
      <ChevronRight className="mt-1 size-4 shrink-0 text-stone" strokeWidth={1.75} />
    </Link>
  );
}
