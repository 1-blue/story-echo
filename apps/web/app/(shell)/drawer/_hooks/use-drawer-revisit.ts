import { useMemo } from "react";
import type { DrawerStoryItem } from "@/features/stories/types";

function getDailySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export function useDrawerRevisit(stories: DrawerStoryItem[]) {
  return useMemo(() => {
    if (stories.length === 0) return null;

    const seed = getDailySeed();
    const index = seed % stories.length;
    return stories[index] ?? null;
  }, [stories]);
}
