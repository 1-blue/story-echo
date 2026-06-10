export function formatQuestionDate(month: number, day: number): string {
  return `${month}월 ${day}일`;
}

export function formatQuestionMonthLabel(month: number): string {
  return `${month}월`;
}

export type QuestionArchiveGroup<T extends { month: number }> = {
  month: number;
  monthLabel: string;
  items: T[];
};

export function groupQuestionsByMonth<T extends { month: number }>(
  questions: T[],
): QuestionArchiveGroup<T>[] {
  const groups = new Map<number, T[]>();

  for (const question of questions) {
    const existing = groups.get(question.month) ?? [];
    existing.push(question);
    groups.set(question.month, existing);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([month, items]) => ({
      month,
      monthLabel: formatQuestionMonthLabel(month),
      items,
    }));
}
