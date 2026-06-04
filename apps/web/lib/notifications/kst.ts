const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** KST 기준 오늘 00:00 ~ 내일 00:00 (UTC Date로 반환) */
export function getKstDayRangeUtc(now = new Date()): { start: Date; end: Date } {
  const kstNow = new Date(now.getTime() + KST_OFFSET_MS);
  const startKst = new Date(
    Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate()),
  );
  const start = new Date(startKst.getTime() - KST_OFFSET_MS);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

/** unlockAt이 KST 기준 '오늘'에 해당하는지 */
export function isUnlockDateKstToday(unlockAt: Date, now = new Date()): boolean {
  const { start, end } = getKstDayRangeUtc(now);
  return unlockAt >= start && unlockAt < end;
}
