"use client";

import type { QuestionTagKey } from "@/lib/question-tags";
import { QUESTION_TAG_KEYS, QUESTION_TAG_LABELS } from "@/lib/question-tags";
import { cn } from "@/lib/utils";

type QuestionTagFilterProps = {
  selected: QuestionTagKey[];
  onChange: (tags: QuestionTagKey[]) => void;
  className?: string;
};

export function QuestionTagFilter({ selected, onChange, className }: QuestionTagFilterProps) {
  const toggleTag = (tag: QuestionTagKey) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((item) => item !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  const clearAll = () => onChange([]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={clearAll}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            selected.length === 0
              ? "border-primary bg-terracotta-soft/50 text-charcoal"
              : "border-hairline bg-white text-stone hover:bg-surface-cream/60",
          )}
        >
          전체
        </button>
        {QUESTION_TAG_KEYS.map((tag) => {
          const isSelected = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                isSelected
                  ? "border-primary bg-terracotta-soft/50 text-charcoal"
                  : "border-hairline bg-white text-stone hover:bg-surface-cream/60",
              )}
            >
              {QUESTION_TAG_LABELS[tag]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
