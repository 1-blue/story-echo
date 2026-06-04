import { describe, expect, it } from "vitest";
import { getCommunityBlockedMessage } from "@/lib/write-capabilities";

describe("write-capabilities", () => {
  it("guest message mentions login", () => {
    expect(getCommunityBlockedMessage({ canUseCommunity: false, isGuest: true })).toContain(
      "로그인",
    );
  });

  it("member unverified message mentions email", () => {
    expect(getCommunityBlockedMessage({ canUseCommunity: false, isGuest: false })).toContain(
      "이메일",
    );
  });
});
