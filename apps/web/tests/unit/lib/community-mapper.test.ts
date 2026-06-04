import { describe, expect, it } from "vitest";
import {
  aggregateReactions,
  formatRelativeTime,
  getInitial,
  parseMentionNicknames,
  toCommunityAuthor,
} from "@/lib/community-mapper";

describe("community-mapper", () => {
  it("toCommunityAuthor uses 익명 for empty nickname", () => {
    expect(toCommunityAuthor({ id: "u1", nickname: null }).nickname).toBe("익명");
    expect(toCommunityAuthor({ id: "u1", nickname: "  " }).nickname).toBe("익명");
  });

  it("getInitial returns first char", () => {
    expect(getInitial("테스트")).toBe("테");
    expect(getInitial("")).toBe("?");
  });

  it("aggregateReactions counts and reactedByMe", () => {
    const result = aggregateReactions(
      [
        { emoji: "heart", userId: "u1" },
        { emoji: "heart", userId: "u2" },
        { emoji: "fire", userId: "u1" },
      ] as never[],
      "u1",
    );
    const heart = result.find((r) => r.emoji === "heart");
    expect(heart?.count).toBe(2);
    expect(heart?.reactedByMe).toBe(true);
  });

  it("parseMentionNicknames extracts unique nicknames", () => {
    expect(parseMentionNicknames("@alice hello @bob @alice")).toEqual(["alice", "bob"]);
    expect(parseMentionNicknames("no mentions")).toEqual([]);
  });

  it("formatRelativeTime returns 방금 전 for recent", () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe("방금 전");
  });

  it("formatRelativeTime returns minutes ago", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60_000);
    expect(formatRelativeTime(fiveMinAgo)).toBe("5분 전");
  });
});
