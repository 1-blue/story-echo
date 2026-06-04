/** 평년 기준 — 윤년 2/29는 normalizeMonthDay에서 2/28 처리 */
export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const QUESTION_ID_PREFIX = "10000000-0000-4000-8000-";

export type MonthDay = { month: number; day: number };

export type QuestionSeedLike = {
  id: string;
  text: string;
  month: number;
  day: number;
};

export function normalizeMonthDay(month: number, day: number): MonthDay {
  if (month === 2 && day === 29) {
    return { month: 2, day: 28 };
  }
  return { month, day };
}

export function getKstMonthDay(now = new Date()): MonthDay {
  const kst = new Date(now.getTime() + KST_OFFSET_MS);
  return normalizeMonthDay(kst.getUTCMonth() + 1, kst.getUTCDate());
}

export function dayOfYearFromMonthDay(month: number, day: number): number {
  const { month: m, day: d } = normalizeMonthDay(month, day);
  if (m < 1 || m > 12 || d < 1 || d > DAYS_IN_MONTH[m - 1]!) {
    throw new Error(`Invalid month/day: ${month}/${day}`);
  }
  let doy = d;
  for (let i = 0; i < m - 1; i += 1) {
    doy += DAYS_IN_MONTH[i]!;
  }
  return doy;
}

export function monthDayFromDayOfYear(doy: number): MonthDay {
  if (doy < 1 || doy > 365) {
    throw new Error(`Invalid day of year: ${doy}`);
  }
  let remaining = doy;
  for (let month = 1; month <= 12; month += 1) {
    const days = DAYS_IN_MONTH[month - 1]!;
    if (remaining <= days) {
      return { month, day: remaining };
    }
    remaining -= days;
  }
  throw new Error(`Invalid day of year: ${doy}`);
}

export function questionIdForDayOfYear(doy: number): string {
  if (doy < 1 || doy > 365) {
    throw new Error(`Invalid day of year: ${doy}`);
  }
  return `${QUESTION_ID_PREFIX}${doy.toString(16).padStart(12, "0")}`;
}

export function questionIdForMonthDay(month: number, day: number): string {
  return questionIdForDayOfYear(dayOfYearFromMonthDay(month, day));
}

export function getKstMonthDayDaysAgo(daysAgo: number, now = new Date()): MonthDay {
  const kst = new Date(now.getTime() + KST_OFFSET_MS);
  const anchor = Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate());
  const target = new Date(anchor - daysAgo * 24 * 60 * 60 * 1000);
  return normalizeMonthDay(target.getUTCMonth() + 1, target.getUTCDate());
}

export function assertQuestionSeedsValid(seeds: QuestionSeedLike[]): void {
  if (seeds.length !== 365) {
    throw new Error(`Expected 365 question seeds, got ${seeds.length}`);
  }

  const monthDayKeys = new Set<string>();
  const ids = new Set<string>();

  for (const seed of seeds) {
    const key = `${seed.month}-${seed.day}`;
    if (monthDayKeys.has(key)) {
      throw new Error(`Duplicate month/day: ${key}`);
    }
    monthDayKeys.add(key);

    if (ids.has(seed.id)) {
      throw new Error(`Duplicate id: ${seed.id}`);
    }
    ids.add(seed.id);

    const expectedId = questionIdForMonthDay(seed.month, seed.day);
    if (seed.id !== expectedId) {
      throw new Error(`ID mismatch for ${key}: expected ${expectedId}, got ${seed.id}`);
    }

    if (seed.text.trim().length < 8) {
      throw new Error(`Text too short for ${key}`);
    }
  }

  for (let month = 1; month <= 12; month += 1) {
    for (let day = 1; day <= DAYS_IN_MONTH[month - 1]!; day += 1) {
      if (!monthDayKeys.has(`${month}-${day}`)) {
        throw new Error(`Missing seed for ${month}/${day}`);
      }
    }
  }
}
