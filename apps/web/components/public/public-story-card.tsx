"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { PublicStoryFeedItem as PublicStoryFeedItemDto } from "@storyecho/api-client";
import { AuthorAvatar } from "@/components/community/author-avatar";
import { ReactionPills } from "@/components/community/reaction-pills";
import { formatRelativeTime } from "@/lib/community-mapper";
import { formatStoryDayLong } from "@/lib/format-story-date";

type PublicStoryCardProps = {
  story: PublicStoryFeedItemDto;
  hideQuestionText?: boolean;
};

export function PublicStoryCard({ story, hideQuestionText = false }: PublicStoryCardProps) {
  return (
    <Link
      href={`/public/${story.id}`}
      className="flex flex-col gap-3 rounded-xl border border-hairline bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-2">
        <AuthorAvatar nickname={story.author.nickname} />
        <div>
          <span className="block text-sm font-medium text-ink">{story.author.nickname}</span>
          <span className="block text-xs text-stone">
            {hideQuestionText
              ? formatStoryDayLong(story.createdAt)
              : formatRelativeTime(story.createdAt)}
          </span>
        </div>
      </div>

      {!hideQuestionText && story.questionText && (
        <h3 className="pt-1 font-display text-lg leading-snug text-ink">{story.questionText}</h3>
      )}

      <p className="line-clamp-3 text-sm leading-relaxed text-charcoal">{story.bodyText}</p>

      <div className="mt-1 flex items-center gap-3 border-t border-hairline pt-2">
        <ReactionPills
          reactions={(story.reactionCounts ?? []).map((r) => ({
            ...r,
            reactedByMe: r.reactedByMe ?? false,
          }))}
          compact
        />
        <div className="ml-auto flex items-center gap-1 text-xs text-slate">
          <MessageCircle className="size-4" strokeWidth={1.75} />
          {story.commentCount}
        </div>
      </div>
    </Link>
  );
}
