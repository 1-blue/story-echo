import { useMemo, useState } from "react";
import type { DrawerStoryItem } from "@/features/stories/types";

function matchesQuery(story: DrawerStoryItem, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const question = story.questionText?.toLowerCase() ?? "";
  const body = story.bodyText.toLowerCase();

  return question.includes(normalized) || body.includes(normalized);
}

export function useDrawerSearch(stories: DrawerStoryItem[]) {
  const [query, setQuery] = useState("");

  const filteredStories = useMemo(
    () => stories.filter((story) => matchesQuery(story, query)),
    [stories, query],
  );

  const hasActiveQuery = query.trim().length > 0;

  return {
    query,
    setQuery,
    filteredStories,
    hasActiveQuery,
  };
}
