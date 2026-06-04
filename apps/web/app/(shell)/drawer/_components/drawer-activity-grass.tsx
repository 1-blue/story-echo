"use client";

import { useEffect, useMemo, useRef } from "react";
import type { DrawerStoryItem } from "@/features/stories/types";
import { cn } from "@/lib/utils";
import { parseLocalDateKey, toLocalDateKey } from "@/lib/story-date-key";

type DayActivity = {
  dateKey: string;
  count: number;
  questionText: string | null;
};

type DrawerActivityGrassProps = {
  stories: DrawerStoryItem[];
  oldestStoryAt: string | null;
  selectedDate: string | null;
  onSelectDate: (dateKey: string | null) => void;
};

const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
const VISIBLE_WEEKDAY_INDICES = new Set([0, 2, 4]);
const MAX_WEEKS = 53;
const FALLBACK_WEEKS = 12;
const CELL_CLASS = "size-3 shrink-0 rounded-[3px] border transition-colors";

function startOfWeekMonday(date: Date): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const daysFromMonday = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - daysFromMonday);
  return copy;
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function buildActivityMap(stories: DrawerStoryItem[]): Map<string, DayActivity> {
  const map = new Map<string, DayActivity>();

  for (const story of stories) {
    const dateKey = toLocalDateKey(story.createdAt);
    const existing = map.get(dateKey);

    if (existing) {
      map.set(dateKey, {
        dateKey,
        count: existing.count + 1,
        questionText: existing.questionText ?? story.questionText,
      });
    } else {
      map.set(dateKey, {
        dateKey,
        count: 1,
        questionText: story.questionText,
      });
    }
  }

  return map;
}

function buildWeekColumns(startDate: Date, endDate: Date): string[][] {
  const columns: string[][] = [];
  let cursor = startOfWeekMonday(startDate);
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  while (cursor <= end) {
    const column: string[] = [];
    for (let day = 0; day < 7; day += 1) {
      const cellDate = addDays(cursor, day);
      if (cellDate < startDate || cellDate > end) {
        column.push("");
      } else {
        column.push(toLocalDateKey(cellDate));
      }
    }
    columns.push(column);
    cursor = addDays(cursor, 7);
  }

  return columns;
}

function resolveRangeStart(oldestStoryAt: string | null): Date {
  const today = new Date();
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (oldestStoryAt) {
    const oldest = parseLocalDateKey(toLocalDateKey(oldestStoryAt));
    const minStart = addDays(end, -(MAX_WEEKS * 7 - 1));
    return oldest < minStart ? minStart : oldest;
  }

  return addDays(end, -(FALLBACK_WEEKS * 7 - 1));
}

function cellClassName(hasActivity: boolean, selected: boolean): string {
  return cn(
    CELL_CLASS,
    !hasActivity && "border-hairline bg-surface-cream",
    hasActivity && "border-primary/30 bg-primary",
    selected && hasActivity && "ring-primary ring-2 ring-offset-1",
  );
}

export function DrawerActivityGrass({
  stories,
  oldestStoryAt,
  selectedDate,
  onSelectDate,
}: DrawerActivityGrassProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activityMap = useMemo(() => buildActivityMap(stories), [stories]);

  const { columns, rangeStart, rangeEnd } = useMemo(() => {
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = resolveRangeStart(oldestStoryAt);
    return {
      columns: buildWeekColumns(start, end),
      rangeStart: start,
      rangeEnd: end,
    };
  }, [oldestStoryAt]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollLeft = container.scrollWidth;
  }, [columns.length]);

  const monthLabels = useMemo(() => {
    return columns.map((column, index) => {
      const firstDateKey = column.find(Boolean);
      if (!firstDateKey) return null;
      const date = parseLocalDateKey(firstDateKey);
      const prevColumn = columns[index - 1];
      const prevKey = prevColumn?.find(Boolean);
      if (prevKey) {
        const prevDate = parseLocalDateKey(prevKey);
        if (prevDate.getMonth() === date.getMonth()) return null;
      }
      return `${date.getMonth() + 1}월`;
    });
  }, [columns]);

  return (
    <section aria-label="작성 활동" className="mb-5">
      <div className="mb-2 flex items-end justify-between gap-3">
        <p className="text-charcoal text-sm font-medium">작성 기록</p>
        <p className="text-stone text-xs">
          {rangeStart.getFullYear()}년 {rangeStart.getMonth() + 1}월 – {rangeEnd.getFullYear()}년{" "}
          {rangeEnd.getMonth() + 1}월
        </p>
      </div>

      <div className="flex gap-2">
        <div className="text-stone flex shrink-0 flex-col justify-between py-5 text-[10px] leading-none">
          {WEEKDAY_LABELS.map((label, index) => (
            <span
              key={label}
              className={cn(VISIBLE_WEEKDAY_INDICES.has(index) ? "opacity-100" : "opacity-0")}
            >
              {label}
            </span>
          ))}
        </div>

        <div ref={scrollRef} className="min-w-0 flex-1 overflow-x-auto pb-1">
          <div className="inline-flex min-w-max flex-col gap-1">
            <div className="flex gap-1 pl-0.5">
              {monthLabels.map((label, index) => (
                <div
                  key={`month-${index}`}
                  className={cn(
                    "text-stone shrink-0 text-[10px] leading-none",
                    label ? "whitespace-nowrap" : "min-w-3",
                  )}
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="flex gap-1">
              {columns.map((column, columnIndex) => (
                <div key={`week-${columnIndex}`} className="flex flex-col gap-1">
                  {column.map((dateKey, rowIndex) => {
                    if (!dateKey) {
                      return (
                        <span
                          key={`empty-${columnIndex}-${rowIndex}`}
                          className={cellClassName(false, false)}
                          aria-hidden
                        />
                      );
                    }

                    const activity = activityMap.get(dateKey);
                    const hasActivity = (activity?.count ?? 0) > 0;
                    const selected = selectedDate === dateKey;
                    const labelDate = parseLocalDateKey(dateKey);

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        aria-label={`${labelDate.getFullYear()}년 ${labelDate.getMonth() + 1}월 ${labelDate.getDate()}일, ${hasActivity ? "작성함" : "작성 없음"}`}
                        aria-pressed={selected}
                        onClick={() => onSelectDate(selected ? null : dateKey)}
                        className={cellClassName(hasActivity, selected)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
