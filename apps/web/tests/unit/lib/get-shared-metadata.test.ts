import { describe, expect, it } from "vitest";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";

describe("getSharedMetadata", () => {
  it("uses default title when not provided", () => {
    const meta = getSharedMetadata();
    expect(meta.title).toBeDefined();
    expect(meta.keywords).toContain("StoryEcho");
  });

  it("merges custom title and robots", () => {
    const meta = getSharedMetadata({
      title: "공개 이야기",
      robots: { index: true, follow: true },
    });
    expect(meta.robots).toEqual({ index: true, follow: true });
    expect(meta.openGraph?.title).toBe("공개 이야기");
  });

  it("deduplicates keywords", () => {
    const meta = getSharedMetadata({
      title: "테스트",
      keywords: ["StoryEcho", "테스트 StoryEcho"],
    });
    const keywords = meta.keywords as string[];
    const storyEchoCount = keywords.filter((k) => k === "StoryEcho").length;
    expect(storyEchoCount).toBe(1);
  });
});
