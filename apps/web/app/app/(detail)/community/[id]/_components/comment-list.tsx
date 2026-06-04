"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CornerDownRight, MoreHorizontal } from "lucide-react";
import type { CommunityComment } from "@storyecho/schemas";
import {
  useDeleteApiV1CommunityCommentsId,
  useDeleteApiV1StoryCommentsId,
  usePatchApiV1CommunityCommentsId,
  usePatchApiV1StoryCommentsId,
} from "@storyecho/api-client";
import { AuthorAvatar } from "@/components/community/author-avatar";
import { MentionText } from "@/components/community/mention-text";
import { formatRelativeTime } from "@/lib/community-mapper";
import { CommentDeleteSheet, CommentEditSheet } from "./comment-edit-sheet";
import { getErrorMessage } from "@/lib/get-error-message";

type CommentListProps = {
  comments: CommunityComment[];
  currentUserId: string | null;
  onReply: (commentId: string, nickname: string) => void;
  onInvalidate: () => Promise<void>;
  variant?: "community" | "story";
};

export function CommentList({
  comments,
  currentUserId,
  onReply,
  onInvalidate,
  variant = "community",
}: CommentListProps) {
  if (comments.length === 0) {
    return <p className="text-stone py-4 text-center text-sm">첫 댓글을 남겨보세요.</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      {comments.map((comment) => (
        <div key={comment.id}>
          <CommentRow
            comment={comment}
            currentUserId={currentUserId}
            onReply={onReply}
            onInvalidate={onInvalidate}
            variant={variant}
          />
          {comment.replies.map((reply) => (
            <div key={reply.id} className="mt-4 ml-10 flex gap-2">
              <CornerDownRight className="text-stone mt-2 size-4 shrink-0" strokeWidth={1.75} />
              <CommentRow
                comment={reply}
                currentUserId={currentUserId}
                onReply={onReply}
                onInvalidate={onInvalidate}
                variant={variant}
                isReply
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

type CommentRowData = CommunityComment | CommunityComment["replies"][number];

type CommentRowProps = {
  comment: CommentRowData;
  currentUserId: string | null;
  onReply: (commentId: string, nickname: string) => void;
  onInvalidate: () => Promise<void>;
  variant: "community" | "story";
  isReply?: boolean;
};

function CommentRow({
  comment,
  currentUserId,
  onReply,
  onInvalidate,
  variant,
  isReply = false,
}: CommentRowProps) {
  const isMine = currentUserId !== null && comment.author.id === currentUserId;
  const patchCommunity = usePatchApiV1CommunityCommentsId();
  const deleteCommunity = useDeleteApiV1CommunityCommentsId();
  const patchStory = usePatchApiV1StoryCommentsId();
  const deleteStory = useDeleteApiV1StoryCommentsId();
  const patchComment = variant === "story" ? patchStory : patchCommunity;
  const deleteComment = variant === "story" ? deleteStory : deleteCommunity;

  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [editText, setEditText] = useState(comment.bodyText);

  const handleSaveEdit = async () => {
    const text = editText.trim();
    if (!text) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    try {
      await patchComment.mutateAsync({ id: comment.id, data: { bodyText: text } });
      await onInvalidate();
      setShowEditSheet(false);
      toast.success("수정했어요.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment.mutateAsync({ id: comment.id });
      await onInvalidate();
      setShowDeleteSheet(false);
      toast.success("삭제했어요.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <div className="flex flex-1 gap-3">
        <AuthorAvatar nickname={comment.author.nickname} />
        <div className="flex-1">
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-ink text-sm font-medium">{comment.author.nickname}</span>
              <span className="text-stone text-xs">{formatRelativeTime(comment.createdAt)}</span>
            </div>
            {isMine && (
              <button
                type="button"
                aria-label="댓글 더보기"
                onClick={() => {
                  setEditText(comment.bodyText);
                  setShowEditSheet(true);
                }}
                className="text-stone hover:text-charcoal rounded p-1 transition-colors"
              >
                <MoreHorizontal className="size-4" strokeWidth={1.75} />
              </button>
            )}
          </div>
          <p className="text-charcoal text-sm leading-relaxed">
            <MentionText text={comment.bodyText} />
          </p>
          {!isReply && (
            <button
              type="button"
              onClick={() => onReply(comment.id, comment.author.nickname)}
              className="text-stone hover:text-primary mt-1 text-xs transition-colors"
            >
              답글
            </button>
          )}
          {isMine && (
            <div className="mt-1 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditText(comment.bodyText);
                  setShowEditSheet(true);
                }}
                className="text-stone hover:text-primary text-xs transition-colors"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteSheet(true)}
                className="text-stone hover:text-destructive text-xs transition-colors"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      <CommentEditSheet
        open={showEditSheet}
        value={editText}
        onChange={setEditText}
        onClose={() => setShowEditSheet(false)}
        onSave={handleSaveEdit}
        isSubmitting={patchComment.isPending}
      />

      <CommentDeleteSheet
        open={showDeleteSheet}
        onClose={() => setShowDeleteSheet(false)}
        onConfirm={handleDelete}
        isSubmitting={deleteComment.isPending}
      />
    </>
  );
}
