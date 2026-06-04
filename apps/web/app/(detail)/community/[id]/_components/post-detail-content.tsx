"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getGetApiV1CommunityPostsIdQueryKey,
  getGetApiV1CommunityPostsQueryKey,
  useDeleteApiV1CommunityPostsId,
  useGetApiV1CommunityPostsIdSuspense,
  useGetApiV1CommunityUsersSearch,
  useGetApiV1UsersMe,
  usePostApiV1CommunityPostsIdComments,
  usePostApiV1CommunityPostsIdReactions,
  usePostApiV1CommunityPostsIdReport,
} from "@storyecho/api-client";
import { AuthorAvatar } from "@/components/community/author-avatar";
import { DiscussionBadge } from "@/components/community/discussion-badge";
import { MentionText } from "@/components/community/mention-text";
import { ReactionPills } from "@/components/community/reaction-pills";
import { BlurFade } from "@/components/magicui/blur-fade";
import { formatRelativeTime } from "@/lib/community-mapper";
import { formatStoryDayLong } from "@/lib/format-story-date";
import { CommentComposer } from "./comment-composer";
import { CommentList } from "./comment-list";
import { MentionSheet } from "./mention-sheet";
import { PostActionSheet } from "./post-action-sheet";
import { PostDeleteSheet } from "./post-delete-sheet";
import { PostDetailHeader } from "./post-detail-header";
import { ReportSheet } from "./report-sheet";
import { getErrorMessage } from "@/lib/get-error-message";

type PostDetailContentProps = {
  postId: string;
};

export function PostDetailContent({ postId }: PostDetailContentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useGetApiV1CommunityPostsIdSuspense(postId);
  const { data: meData } = useGetApiV1UsersMe();
  const post = data.data;
  const currentUserId = meData?.data.id ?? null;
  const isMine = currentUserId !== null && post.author.id === currentUserId;

  const reactionMutation = usePostApiV1CommunityPostsIdReactions();
  const commentMutation = usePostApiV1CommunityPostsIdComments();
  const reportMutation = usePostApiV1CommunityPostsIdReport();
  const deletePostMutation = useDeleteApiV1CommunityPostsId();

  const [commentText, setCommentText] = useState("");
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [showMentionSheet, setShowMentionSheet] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showReportSheet, setShowReportSheet] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");

  const mentionSearch = useGetApiV1CommunityUsersSearch(
    { q: mentionQuery, postId },
    { query: { enabled: showMentionSheet } },
  );

  const invalidate = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getGetApiV1CommunityPostsIdQueryKey(postId),
      }),
      queryClient.invalidateQueries({
        queryKey: getGetApiV1CommunityPostsQueryKey(),
      }),
    ]);
  }, [postId, queryClient]);

  const handleReaction = async (
    emoji: Parameters<typeof reactionMutation.mutateAsync>[0]["data"]["emoji"],
  ) => {
    try {
      await reactionMutation.mutateAsync({ id: postId, data: { emoji } });
      await invalidate();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleComment = async () => {
    const text = commentText.trim();
    if (!text || commentMutation.isPending) return;

    try {
      await commentMutation.mutateAsync({
        id: postId,
        data: { bodyText: text, parentId: replyParentId },
      });
      setCommentText("");
      setReplyParentId(null);
      await invalidate();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleReply = (commentId: string, nickname: string) => {
    setReplyParentId(commentId);
    setCommentText((prev) => (prev ? prev : `@${nickname} `));
  };

  const handleMentionSelect = (nickname: string) => {
    setCommentText((prev) => `${prev}${prev.endsWith(" ") || !prev ? "" : " "}@${nickname} `);
  };

  const handleReport = async () => {
    try {
      await reportMutation.mutateAsync({ id: postId, data: {} });
      toast.success("신고가 접수되었습니다.");
      setShowReportSheet(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePostMutation.mutateAsync({ id: postId });
      await queryClient.invalidateQueries({ queryKey: getGetApiV1CommunityPostsQueryKey() });
      toast.success("삭제했어요.");
      router.push("/community");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <PostDetailHeader onMore={() => setShowActionSheet(true)} />

      <main className="mx-auto w-full max-w-lg flex-1 px-5 py-6 pb-[calc(7rem+var(--safe-area-bottom))]">
        <BlurFade>
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <AuthorAvatar nickname={post.author.nickname} size="md" />
              <div>
                <div className="text-sm font-medium text-ink">{post.author.nickname}</div>
                <div className="text-xs text-stone">
                  {formatStoryDayLong(post.createdAt)} · {formatRelativeTime(post.createdAt)}
                </div>
              </div>
            </div>
            <DiscussionBadge />
          </div>

          {post.questionText && (
            <div className="mb-6 rounded-xl border border-hairline bg-white p-5 shadow-sm">
              <h2 className="text-xl leading-snug font-bold text-ink">{post.questionText}</h2>
            </div>
          )}
        </BlurFade>

        <hr className="mb-6 border-hairline" />

        <article className="mb-6 text-base leading-relaxed text-ink">
          <MentionText text={post.bodyText} />
        </article>

        {post.photoUrls && post.photoUrls.length > 0 && (
          <div className="mb-6 overflow-hidden rounded-xl border border-hairline bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.photoUrls[0]} alt="" className="max-h-[400px] w-full object-cover" />
          </div>
        )}

        <div className="mb-8">
          <ReactionPills
            reactions={(post.reactionCounts ?? []).map((r) => ({
              ...r,
              reactedByMe: r.reactedByMe ?? false,
            }))}
            onToggle={handleReaction}
          />
        </div>

        <hr className="mb-6 border-hairline-strong" />

        <section>
          <h3 className="mb-5 text-lg font-semibold text-charcoal">댓글 {post.commentCount}</h3>
          <CommentList
            comments={post.comments}
            currentUserId={currentUserId}
            onReply={handleReply}
            onInvalidate={invalidate}
          />
        </section>
      </main>

      <CommentComposer
        value={commentText}
        onChange={(value) => {
          setCommentText(value);
          const match = value.match(/@([\w가-힣]*)$/);
          if (match) {
            setMentionQuery(match[1] ?? "");
            setShowMentionSheet(true);
          }
        }}
        onSubmit={handleComment}
        onMentionClick={() => {
          setMentionQuery("");
          setShowMentionSheet(true);
        }}
        isSubmitting={commentMutation.isPending}
        placeholder={replyParentId ? "답글을 남겨보세요" : "댓글을 남겨보세요"}
      />

      <MentionSheet
        open={showMentionSheet}
        users={mentionSearch.data?.data ?? []}
        onSelect={handleMentionSelect}
        onClose={() => setShowMentionSheet(false)}
      />

      <PostActionSheet
        open={showActionSheet}
        isMine={isMine}
        onClose={() => setShowActionSheet(false)}
        onEdit={() => {
          setShowActionSheet(false);
          router.push(`/community/write/${postId}`);
        }}
        onDelete={() => {
          setShowActionSheet(false);
          setShowDeleteSheet(true);
        }}
        onReport={() => {
          setShowActionSheet(false);
          setShowReportSheet(true);
        }}
        isDeleting={deletePostMutation.isPending}
      />

      <PostDeleteSheet
        open={showDeleteSheet}
        onClose={() => setShowDeleteSheet(false)}
        onConfirm={handleDeletePost}
        isSubmitting={deletePostMutation.isPending}
      />

      <ReportSheet
        open={showReportSheet}
        onClose={() => setShowReportSheet(false)}
        onConfirm={handleReport}
        isSubmitting={reportMutation.isPending}
      />
    </>
  );
}
