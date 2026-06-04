import { useMemo, useState } from "react";
import type { DrawerStoryItem } from "@/features/stories/types";
import { toLocalDateKey } from "@/lib/story-date-key";

export type DrawerListFilter = "all" | "bookmarked";

function matchesQuery(story: DrawerStoryItem, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const question = story.questionText?.toLowerCase() ?? "";
  const body = story.bodyText.toLowerCase();

  return question.includes(normalized) || body.includes(normalized);
}

function matchesDate(story: DrawerStoryItem, selectedDate: string | null): boolean {
  if (!selectedDate) return true;
  return toLocalDateKey(story.createdAt) === selectedDate;
}

function matchesBookmarkFilter(story: DrawerStoryItem, listFilter: DrawerListFilter): boolean {
  if (listFilter === "bookmarked") return story.isBookmarked;
  return true;
}

export function useDrawerFilters(stories: DrawerStoryItem[]) {
  const [query, setQuery] = useState("");
  const [listFilter, setListFilter] = useState<DrawerListFilter>("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const filteredStories = useMemo(
    () =>
      stories.filter(
        (story) =>
          matchesQuery(story, query) &&
          matchesDate(story, selectedDate) &&
          matchesBookmarkFilter(story, listFilter),
      ),
    [stories, query, selectedDate, listFilter],
  );

  const hasActiveQuery = query.trim().length > 0;
  const hasActiveFilters = hasActiveQuery || listFilter === "bookmarked" || selectedDate !== null;

  const selectedDateQuestion = useMemo(() => {
    if (!selectedDate) return null;
    const match = stories.find((story) => toLocalDateKey(story.createdAt) === selectedDate);
    return match?.questionText ?? null;
  }, [stories, selectedDate]);

  return {
    query,
    setQuery,
    listFilter,
    setListFilter,
    selectedDate,
    setSelectedDate,
    filteredStories,
    hasActiveQuery,
    hasActiveFilters,
    selectedDateQuestion,
  };
}
