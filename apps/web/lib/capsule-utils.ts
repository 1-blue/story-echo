export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

export function computeDaysUntilUnlock(unlockAt: string | Date): number {
  const target = typeof unlockAt === "string" ? new Date(unlockAt) : unlockAt;
  const diffMs = target.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / 86_400_000));
}

export function formatUnlockDateKo(unlockAt: string | Date): string {
  const date = typeof unlockAt === "string" ? new Date(unlockAt) : unlockAt;
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function formatUnlockPreview(unlockAt: string | Date): string {
  return `${formatUnlockDateKo(unlockAt)}에 열립니다`;
}

export const CAPSULE_MONTH_PRESETS = [
  { label: "1달", months: 1 },
  { label: "3달", months: 3 },
  { label: "6달", months: 6 },
] as const;

export const CAPSULE_YEAR_PRESETS = Array.from({ length: 10 }, (_, index) => ({
  label: `${index + 1}년`,
  years: index + 1,
}));

export async function syncExpiredCapsules(userId: string) {
  const { prisma } = await import("@/lib/prisma");

  await prisma.story.updateMany({
    where: {
      userId,
      isCapsule: true,
      isCapsuleActive: true,
      unlockAt: { lte: new Date() },
    },
    data: { isCapsuleActive: false },
  });
}
