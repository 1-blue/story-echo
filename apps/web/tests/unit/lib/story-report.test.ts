import { describe, expect, it, vi, beforeEach } from "vitest";
import { hideStoryIfReportThreshold } from "@/lib/story-report";

const mockCount = vi.fn();
const mockUpdate = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    storyReport: { count: (...args: unknown[]) => mockCount(...args) },
    story: { update: (...args: unknown[]) => mockUpdate(...args) },
  },
}));

describe("hideStoryIfReportThreshold", () => {
  beforeEach(() => {
    mockCount.mockReset();
    mockUpdate.mockReset();
  });

  it("does not hide below threshold", async () => {
    mockCount.mockResolvedValue(2);
    await hideStoryIfReportThreshold("story-1");
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("hides at 3 reports", async () => {
    mockCount.mockResolvedValue(3);
    await hideStoryIfReportThreshold("story-1");
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "story-1" },
      data: { hiddenFromFeed: true },
    });
  });
});
