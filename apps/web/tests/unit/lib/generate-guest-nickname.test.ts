import { describe, expect, it } from "vitest";
import {
  generateGuestNicknameSuffix,
  generateUniqueGuestNickname,
} from "@/lib/user/generate-guest-nickname";

describe("generate-guest-nickname", () => {
  it("generateGuestNicknameSuffix is 5-6 digits", () => {
    const suffix = generateGuestNicknameSuffix();
    expect(suffix).toMatch(/^\d{5,6}$/);
  });

  it("generateUniqueGuestNickname retries until unique", async () => {
    let calls = 0;
    const nickname = await generateUniqueGuestNickname(async () => {
      calls += 1;
      return calls === 1 ? ({ id: "x" } as never) : null;
    });
    expect(nickname.startsWith("게스트")).toBe(true);
    expect(calls).toBe(2);
  });
});
