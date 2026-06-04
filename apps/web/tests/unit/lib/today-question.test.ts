import { describe, expect, it } from "vitest";
import { formatKoreanDate } from "@/lib/today-question";

describe("today-question", () => {
  it("formatKoreanDate includes month day weekday", () => {
    const label = formatKoreanDate(new Date("2026-06-04T12:00:00.000Z"));
    expect(label).toMatch(/6월/);
    expect(label).toMatch(/일/);
  });
});
