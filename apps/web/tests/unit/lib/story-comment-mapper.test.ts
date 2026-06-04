import { describe, expect, it } from "vitest";
import { toStoryCommentTree } from "@/lib/story-comment-mapper";

describe("story-comment-mapper", () => {
  it("toStoryCommentTree maps nested replies", () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const tree = toStoryCommentTree([
      {
        id: "c1",
        bodyText: "parent",
        parentId: null,
        createdAt,
        user: { id: "u1", nickname: "A" },
        replies: [
          {
            id: "c2",
            bodyText: "reply",
            parentId: "c1",
            createdAt,
            user: { id: "u2", nickname: "B" },
          },
        ],
      },
    ] as never[]);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.replies).toHaveLength(1);
    expect(tree[0]?.replies[0]?.bodyText).toBe("reply");
  });
});
