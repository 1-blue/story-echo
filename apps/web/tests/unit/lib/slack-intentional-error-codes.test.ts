import { describe, expect, it } from "vitest";
import {
  INTENTIONAL_ERROR_CODES,
  isIntentionalErrorCode,
} from "@/lib/slack/intentional-error-codes";

describe("isIntentionalErrorCode", () => {
  it("treats whitelisted 4xx codes as intentional", () => {
    for (const code of INTENTIONAL_ERROR_CODES) {
      expect(isIntentionalErrorCode(code, 400)).toBe(true);
    }
  });

  it("treats 5xx as unintentional", () => {
    expect(isIntentionalErrorCode("AUTH_FAILED", 503)).toBe(false);
    expect(isIntentionalErrorCode("DB_ERROR", 503)).toBe(false);
  });

  it("treats unknown 4xx as unintentional", () => {
    expect(isIntentionalErrorCode("MYSTERY", 400)).toBe(false);
  });
});
