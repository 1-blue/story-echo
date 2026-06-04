import type { DrawerStoryItem } from "@/features/stories/types";
import { groupStoriesByMonth } from "@/lib/format-story-date";

export function useDrawerGroups(stories: DrawerStoryItem[]) {
  return groupStoriesByMonth(stories);
}
