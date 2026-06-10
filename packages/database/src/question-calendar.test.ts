import { describe, expect, it } from "vitest";
import {
  dayOfYearFromMonthDay,
  getKstMonthDay,
  monthDayFromDayOfYear,
  normalizeMonthDay,
  questionIdForDayOfYear,
  questionIdForMonthDay,
} from "./question-calendar";
import { QUESTION_SEEDS } from "./seeds/questions.data/index";

describe("question-calendar", () => {
  it("dayOfYear round-trips for Jan 1 and Dec 31", () => {
    expect(dayOfYearFromMonthDay(1, 1)).toBe(1);
    expect(dayOfYearFromMonthDay(12, 31)).toBe(365);
    expect(monthDayFromDayOfYear(1)).toEqual({ month: 1, day: 1 });
    expect(monthDayFromDayOfYear(365)).toEqual({ month: 12, day: 31 });
  });

  it("normalizes leap day to Feb 28", () => {
    expect(normalizeMonthDay(2, 29)).toEqual({ month: 2, day: 28 });
    expect(dayOfYearFromMonthDay(2, 29)).toBe(dayOfYearFromMonthDay(2, 28));
  });

  it("questionId encodes day of year", () => {
    expect(questionIdForDayOfYear(1)).toBe("10000000-0000-4000-8000-000000000001");
    expect(questionIdForDayOfYear(365)).toBe("10000000-0000-4000-8000-00000000016d");
    expect(questionIdForMonthDay(6, 4)).toBe(questionIdForDayOfYear(dayOfYearFromMonthDay(6, 4)));
  });

  it("getKstMonthDay uses KST calendar date", () => {
    const utcLate = new Date("2026-01-01T14:00:00.000Z");
    expect(getKstMonthDay(utcLate)).toEqual({ month: 1, day: 1 });
  });
});

describe("QUESTION_SEEDS", () => {
  it("has 365 valid calendar entries", () => {
    expect(QUESTION_SEEDS).toHaveLength(365);
    expect(QUESTION_SEEDS[0]?.month).toBe(1);
    expect(QUESTION_SEEDS[0]?.day).toBe(1);
    expect(QUESTION_SEEDS[364]?.month).toBe(12);
    expect(QUESTION_SEEDS[364]?.day).toBe(31);
  });
});
