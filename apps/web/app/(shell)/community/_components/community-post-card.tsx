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
      className="flex flex-col gap-3 rounded-xl border border-hairline bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <AuthorAvatar nickname={post.author.nickname} />
          <div>
            <span className="block text-sm font-medium text-ink">{post.author.nickname}</span>
            <span className="block text-xs text-stone">{formatRelativeTime(post.createdAt)}</span>
          </div>
        </div>
        <DiscussionBadge />
      </div>

      {post.questionText && (
        <h3 className="pt-1 font-display text-lg leading-snug text-ink">{post.questionText}</h3>
      )}

      <p className="line-clamp-3 text-sm leading-relaxed text-charcoal">{post.bodyText}</p>

      <div className="mt-1 flex items-center gap-3 border-t border-hairline pt-2">
        <ReactionPills
          reactions={(post.reactionCounts ?? []).map((r) => ({
            ...r,
            reactedByMe: r.reactedByMe ?? false,
          }))}
          compact
        />
        <div className="ml-auto flex items-center gap-1 text-xs text-slate">
          <MessageCircle className="size-4" strokeWidth={1.75} />
          {post.commentCount}
        </div>
      </div>
    </Link>
  );
}
