import { describe, expect, it } from "vitest";
import { formatKoreanDate } from "@/lib/today-question";
import {
  dayOfYearFromMonthDay,
  getKstMonthDay,
  normalizeMonthDay,
  questionIdForMonthDay,
} from "@storyecho/database/question-calendar";

describe("today-question", () => {
  it("formatKoreanDate includes month day weekday", () => {
    const label = formatKoreanDate(new Date("2026-06-04T12:00:00.000Z"));
    expect(label).toMatch(/6월/);
    expect(label).toMatch(/일/);
  });
});

describe("KST month/day (shared calendar)", () => {
  it("normalizes leap day to Feb 28", () => {
    expect(normalizeMonthDay(2, 29)).toEqual({ month: 2, day: 28 });
  });

  it("maps June 4 KST to stable question id", () => {
    const { month, day } = getKstMonthDay(new Date("2026-06-04T01:00:00.000Z"));
    const doy = dayOfYearFromMonthDay(month, day);
    expect(questionIdForMonthDay(month, day)).toBe(
      `10000000-0000-4000-8000-${doy.toString(16).padStart(12, "0")}`,
    );
  });
});
