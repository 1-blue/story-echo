import { describe, expect, it } from "vitest";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";

describe("getSharedMetadata", () => {
  it("uses default title when not provided", () => {
    const meta = getSharedMetadata();
    expect(meta.title).toBeDefined();
    expect(meta.keywords).toContain("이야기해줘");
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
      keywords: ["이야기해줘", "테스트 이야기해줘"],
    });
    const keywords = meta.keywords as string[];
    const brandCount = keywords.filter((k) => k === "이야기해줘").length;
    expect(brandCount).toBe(1);
  });
});
