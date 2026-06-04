"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getGetApiV1StoriesPublicIdQueryKey,
  getGetApiV1StoriesPublicQueryKey,
  useGetApiV1StoriesPublicIdSuspense,
  useGetApiV1UsersMe,
  usePostApiV1StoriesPublicIdComments,
  usePostApiV1StoriesPublicIdReactions,
  usePostApiV1StoriesPublicIdReport,
} from "@storyecho/api-client";
import { CommentComposer } from "@/app/(detail)/community/[id]/_components/comment-composer";
import { CommentList } from "@/app/(detail)/community/[id]/_components/comment-list";
import { ReportSheet } from "@/app/(detail)/community/[id]/_components/report-sheet";
import { AuthorAvatar } from "@/components/community/author-avatar";
import { MentionText } from "@/components/community/mention-text";
import { ReactionPills } from "@/components/community/reaction-pills";
import { BlurFade } from "@/components/magicui/blur-fade";
import { formatRelativeTime } from "@/lib/community-mapper";
import { formatStoryDayLong } from "@/lib/format-story-date";
import { PublicDetailHeader } from "./public-detail-header";
import { getErrorMessage } from "@/lib/get-error-message";

type PublicDetailContentProps = {
  storyId: string;
};

export function PublicDetailContent({ storyId }: PublicDetailContentProps) {
  const queryClient = useQueryClient();
  const { data } = useGetApiV1StoriesPublicIdSuspense(storyId);
  const { data: meData } = useGetApiV1UsersMe();
  const story = data.data;
  const currentUserId = meData?.data.id ?? null;

  const reactionMutation = usePostApiV1StoriesPublicIdReactions();
  const commentMutation = usePostApiV1StoriesPublicIdComments();
  const reportMutation = usePostApiV1StoriesPublicIdReport();

  const [commentText, setCommentText] = useState("");
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [showReportSheet, setShowReportSheet] = useState(false);

  const invalidate = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getGetApiV1StoriesPublicIdQueryKey(storyId),
      }),
      queryClient.invalidateQueries({
        queryKey: getGetApiV1StoriesPublicQueryKey(),
      }),
    ]);
  }, [queryClient, storyId]);

  const handleReaction = async (
    emoji: Parameters<typeof reactionMutation.mutateAsync>[0]["data"]["emoji"],
  ) => {
    try {
      await reactionMutation.mutateAsync({ id: storyId, data: { emoji } });
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
        id: storyId,
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

  const handleReport = async () => {
    try {
      await reportMutation.mutateAsync({ id: storyId, data: {} });
      toast.success("신고가 접수되었습니다.");
      setShowReportSheet(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <PublicDetailHeader onReport={() => setShowReportSheet(true)} />

      <main className="mx-auto w-full max-w-lg flex-1 px-5 py-6 pb-[calc(7rem+var(--safe-area-bottom))]">
        <BlurFade>
          <div className="mb-6 flex items-start gap-3">
            <AuthorAvatar nickname={story.author.nickname} size="md" />
            <div>
              <div className="text-sm font-medium text-ink">{story.author.nickname}</div>
              <div className="text-xs text-stone">
                {formatStoryDayLong(story.createdAt)} · {formatRelativeTime(story.createdAt)}
              </div>
            </div>
          </div>

          {story.questionText && (
            <div className="mb-6 rounded-xl border border-hairline bg-white p-5 shadow-sm">
              <h2 className="font-display text-2xl leading-snug text-ink">{story.questionText}</h2>
            </div>
          )}
        </BlurFade>

        <hr className="mb-6 border-hairline" />

        <article className="mb-6 text-base leading-relaxed text-ink">
          <MentionText text={story.bodyText} />
        </article>

        {story.photoUrls && story.photoUrls.length > 0 && (
          <div className="mb-6 overflow-hidden rounded-xl border border-hairline bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={story.photoUrls[0]} alt="" className="max-h-[400px] w-full object-cover" />
          </div>
        )}

        <div className="mb-8">
          <ReactionPills
            reactions={(story.reactionCounts ?? []).map((r) => ({
              ...r,
              reactedByMe: r.reactedByMe ?? false,
            }))}
            onToggle={handleReaction}
          />
        </div>

        <hr className="mb-6 border-hairline-strong" />

        <section>
          <h3 className="mb-5 text-lg font-semibold text-charcoal">댓글 {story.commentCount}</h3>
          <CommentList
            comments={story.comments}
            currentUserId={currentUserId}
            onReply={handleReply}
            onInvalidate={invalidate}
            variant="story"
          />
        </section>
      </main>

      <CommentComposer
        value={commentText}
        onChange={setCommentText}
        onSubmit={handleComment}
        onMentionClick={() => {}}
        isSubmitting={commentMutation.isPending}
        placeholder={replyParentId ? "답글을 남겨보세요" : "댓글을 남겨보세요"}
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
