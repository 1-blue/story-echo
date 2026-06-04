export type StoryDateInput = string | Date;

export function formatStoryDay(dateInput: StoryDateInput): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function formatStoryMonthGroup(dateInput: StoryDateInput): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

export function formatStoryDayLong(dateInput: StoryDateInput): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function formatDrawerStats(totalCount: number, oldestStoryAt: string | null): string {
  if (totalCount === 0) {
    return "아직 작성한 이야기가 없어요";
  }

  if (!oldestStoryAt) {
    return `${totalCount}개의 이야기`;
  }

  return `${totalCount}개의 이야기 · ${formatStoryMonthGroup(oldestStoryAt)}부터`;
}

export type DrawerStoryGroup<T extends { createdAt: string }> = {
  monthLabel: string;
  stories: T[];
};

export function groupStoriesByMonth<T extends { createdAt: string }>(
  stories: T[],
): DrawerStoryGroup<T>[] {
  const groups = new Map<string, T[]>();

  for (const story of stories) {
    const monthLabel = formatStoryMonthGroup(story.createdAt);
    const existing = groups.get(monthLabel) ?? [];
    existing.push(story);
    groups.set(monthLabel, existing);
  }

  return Array.from(groups.entries()).map(([monthLabel, monthStories]) => ({
    monthLabel,
    stories: monthStories,
  }));
}
