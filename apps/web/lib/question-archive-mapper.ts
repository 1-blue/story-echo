import type { QuestionArchiveItem } from "@storyecho/schemas";

type QuestionRow = {
  id: string;
  text: string;
  month: number;
  day: number;
};

const PUBLIC_STORY_WHERE = {
  visibility: "community" as const,
  hiddenFromFeed: false,
  isCapsuleActive: false,
};

export { PUBLIC_STORY_WHERE };

export function toQuestionArchiveItem(
  question: QuestionRow,
  publicStoryCount: number,
): QuestionArchiveItem {
  return {
    id: question.id,
    text: question.text,
    month: question.month,
    day: question.day,
    publicStoryCount,
  };
}

export function buildPublicStoryCountMap(
  rows: Array<{ questionId: string | null; _count: { _all: number } }>,
): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of rows) {
    if (row.questionId) {
      map.set(row.questionId, row._count._all);
    }
  }
  return map;
}
