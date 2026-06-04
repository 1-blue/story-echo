import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { CommunityPostSummary } from "@storyecho/schemas";
import { AuthorAvatar } from "@/components/community/author-avatar";
import { DiscussionBadge } from "@/components/community/discussion-badge";
import { ReactionPills } from "@/components/community/reaction-pills";
import { formatRelativeTime } from "@/lib/community-mapper";

type CommunityPostCardProps = {
  post: CommunityPostSummary & { photoUrls?: string[] };
};

export function CommunityPostCard({ post }: CommunityPostCardProps) {
  return (
    <Link
      href={`/community/${post.id}`}
      className="border-hairline hover:shadow-md flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <AuthorAvatar nickname={post.author.nickname} />
          <div>
            <span className="text-ink block text-sm font-medium">{post.author.nickname}</span>
            <span className="text-stone block text-xs">
              {formatRelativeTime(post.createdAt)}
            </span>
          </div>
        </div>
        <DiscussionBadge />
      </div>

      {post.questionText && (
        <h3 className="text-ink font-display pt-1 text-lg leading-snug">{post.questionText}</h3>
      )}

      <p className="text-charcoal line-clamp-3 text-sm leading-relaxed">{post.bodyText}</p>

      <div className="border-hairline mt-1 flex items-center gap-3 border-t pt-2">
        <ReactionPills
          reactions={(post.reactionCounts ?? []).map((r) => ({
            ...r,
            reactedByMe: r.reactedByMe ?? false,
          }))}
          compact
        />
        <div className="text-slate ml-auto flex items-center gap-1 text-xs">
          <MessageCircle className="size-4" strokeWidth={1.75} />
          {post.commentCount}
        </div>
      </div>
    </Link>
  );
}
