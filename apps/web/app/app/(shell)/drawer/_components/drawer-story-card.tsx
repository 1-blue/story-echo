"use client";

import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, ChevronRight } from "lucide-react";
import { StoryMetaBadges } from "@/components/story/story-meta-badges";
import type { DrawerStoryItem } from "@/features/stories/types";
import { formatStoryDay } from "@/lib/format-story-date";
import { cn } from "@/lib/utils";
import { useToggleStoryBookmark } from "@/lib/stories/use-toggle-story-bookmark";

type DrawerStoryCardProps = {
  story: DrawerStoryItem;
};

function PhotoStrip({ photoUrls }: { photoUrls: string[] }) {
  if (photoUrls.length === 0) return null;

  const visiblePhotos = photoUrls.slice(0, 3);
  const remainingCount = photoUrls.length - visiblePhotos.length;

  return (
    <div className="flex gap-1.5">
      {visiblePhotos.map((url, index) => (
        <div
          key={`${url}-${index}`}
          className="relative size-12 shrink-0 overflow-hidden rounded-md bg-stone/20"
        >
          <Image src={url} alt="" fill className="object-cover" sizes="48px" unoptimized />
          {index === visiblePhotos.length - 1 && remainingCount > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-xs font-semibold text-white">
              +{remainingCount}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function DrawerStoryCard({ story }: DrawerStoryCardProps) {
  const { toggleBookmark, isPending } = useToggleStoryBookmark(story.id);

  const handleBookmarkClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await toggleBookmark(!story.isBookmarked);
    } catch {
      // rollback handled in hook
    }
  };

  return (
    <Link
      href={`/app/drawer/${story.id}`}
      className="border-hairline hover:border-hairline-strong group block cursor-pointer rounded-2xl border bg-white p-4 shadow-sm transition-colors hover:shadow"
    >
      <div className="mb-2 flex items-start justify-between">
        <span className="bg-surface-dim text-charcoal rounded-full px-2.5 py-1 text-xs font-semibold">
          {formatStoryDay(story.createdAt)}
        </span>
        <button
          type="button"
          aria-label={story.isBookmarked ? "북마크 해제" : "북마크"}
          disabled={isPending}
          className={cn(
            "transition-colors",
            story.isBookmarked ? "text-primary" : "text-stone group-hover:text-primary",
          )}
          onClick={handleBookmarkClick}
        >
          <Bookmark
            className="size-[18px]"
            strokeWidth={1.75}
            fill={story.isBookmarked ? "currentColor" : "none"}
          />
        </button>
      </div>

      <h3 className="text-ink mb-1 line-clamp-1 text-base font-semibold">
        {story.questionText ?? "오늘의 질문"}
      </h3>
      <p className="text-slate mb-4 line-clamp-2 text-sm leading-relaxed">{story.bodyText}</p>

      <div className="flex items-end justify-between gap-3">
        <PhotoStrip photoUrls={story.photoUrls} />
        <div className="ml-auto flex items-center gap-2">
          <StoryMetaBadges story={story} />
          <ChevronRight className="text-stone size-5 shrink-0" strokeWidth={1.75} />
        </div>
      </div>
    </Link>
  );
}
