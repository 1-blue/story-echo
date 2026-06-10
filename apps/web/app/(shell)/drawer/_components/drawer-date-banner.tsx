"use client";

import { formatStoryDayLong } from "@/lib/format-story-date";
import { parseLocalDateKey } from "@/lib/story-date-key";

type DrawerDateBannerProps = {
  selectedDate: string;
  questionText: string | null;
  onClear: () => void;
};

export function DrawerDateBanner({ selectedDate, questionText, onClear }: DrawerDateBannerProps) {
  const label = formatStoryDayLong(parseLocalDateKey(selectedDate));

  return (
    <div className="mb-4 flex items-start justify-between gap-3 rounded-2xl border border-hairline bg-surface-cream/70 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-charcoal">{label}</p>
        <p className="mt-1 line-clamp-2 text-sm text-slate">{questionText ?? "오늘의 질문"}</p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="shrink-0 text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        필터 해제
      </button>
    </div>
  );
}
