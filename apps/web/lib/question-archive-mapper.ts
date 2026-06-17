import type { QuestionArchiveItem, QuestionTagKey } from "@storyecho/schemas";
import { isQuestionTagKey } from "@storyecho/database/question-tags";

type QuestionRow = {
  id: string;
  text: string;
  month: number;
  day: number;
  tags: string[];
};

const PUBLIC_STORY_WHERE = {
  visibility: "community" as const,
  hiddenFromFeed: false,
  isCapsuleActive: false,
};

export { PUBLIC_STORY_WHERE };

function toQuestionTagKeys(tags: string[]): QuestionTagKey[] {
  return tags.filter(isQuestionTagKey);
}

export function toQuestionArchiveItem(
  question: QuestionRow,
  publicStoryCount: number,
): QuestionArchiveItem {
  return {
    id: question.id,
    text: question.text,
    month: question.month,
    day: question.day,
    tags: toQuestionTagKeys(question.tags),
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
