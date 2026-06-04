import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CommunityComment } from "@storyecho/schemas";
import { CommentList } from "@/app/(detail)/community/[id]/_components/comment-list";

vi.mock("@storyecho/api-client", () => ({
  useDeleteApiV1CommunityCommentsId: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteApiV1StoryCommentsId: () => ({ mutateAsync: vi.fn(), isPending: false }),
  usePatchApiV1CommunityCommentsId: () => ({ mutateAsync: vi.fn(), isPending: false }),
  usePatchApiV1StoryCommentsId: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

const sampleComments: CommunityComment[] = [
  {
    id: "c1",
    author: { id: "u1", nickname: "Alice" },
    bodyText: "첫 댓글",
    parentId: null,
    createdAt: new Date().toISOString(),
    replies: [
      {
        id: "c2",
        author: { id: "u2", nickname: "Bob" },
        bodyText: "답글 본문",
        parentId: "c1",
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

describe("CommentList", () => {
  it("shows empty message", () => {
    render(
      <CommentList
        comments={[]}
        currentUserId={null}
        onReply={vi.fn()}
        onInvalidate={async () => {}}
      />,
    );
    expect(screen.getByText("첫 댓글을 남겨보세요.")).toBeInTheDocument();
  });

  it("renders parent and reply comments", () => {
    render(
      <CommentList
        comments={sampleComments}
        currentUserId="u1"
        onReply={vi.fn()}
        onInvalidate={async () => {}}
        variant="community"
      />,
    );
    expect(screen.getByText("첫 댓글")).toBeInTheDocument();
    expect(screen.getByText("답글 본문")).toBeInTheDocument();
  });
});
