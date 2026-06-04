"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { PublicStoryFeedItem as PublicStoryFeedItemDto } from "@storyecho/api-client";
import { AuthorAvatar } from "@/components/community/author-avatar";
import { ReactionPills } from "@/components/community/reaction-pills";
import { formatRelativeTime } from "@/lib/community-mapper";

type PublicStoryCardProps = {
  story: PublicStoryFeedItemDto;
};

export function PublicStoryCard({ story }: PublicStoryCardProps) {
  return (
    <Link
      href={`/public/${story.id}`}
      className="border-hairline hover:shadow-md flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm transition-shadow"
    >
      <div className="flex items-start gap-2">
        <AuthorAvatar nickname={story.author.nickname} />
        <div>
          <span className="text-ink block text-sm font-medium">{story.author.nickname}</span>
          <span className="text-stone block text-xs">{formatRelativeTime(story.createdAt)}</span>
        </div>
      </div>

      {story.questionText && (
        <h3 className="text-ink font-display pt-1 text-lg leading-snug">{story.questionText}</h3>
      )}

      <p className="text-charcoal line-clamp-3 text-sm leading-relaxed">{story.bodyText}</p>

      <div className="border-hairline mt-1 flex items-center gap-3 border-t pt-2">
        <ReactionPills
          reactions={(story.reactionCounts ?? []).map((r) => ({
            ...r,
            reactedByMe: r.reactedByMe ?? false,
          }))}
          compact
        />
        <div className="text-slate ml-auto flex items-center gap-1 text-xs">
          <MessageCircle className="size-4" strokeWidth={1.75} />
          {story.commentCount}
        </div>
      </div>
    </Link>
  );
}
