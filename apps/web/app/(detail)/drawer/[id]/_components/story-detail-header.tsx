"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ALargeSmall, ArrowLeft, Bookmark, Pencil } from "lucide-react";
import { useGetApiV1StoriesIdSuspense } from "@storyecho/api-client";
import { Button } from "@/components/ui/button";
import { useToggleStoryBookmark } from "@/lib/stories/use-toggle-story-bookmark";
import { cn } from "@/lib/utils";

type StoryDetailHeaderProps = {
  storyId: string;
  onFontSizeClick: () => void;
};

export function StoryDetailHeader({ storyId, onFontSizeClick }: StoryDetailHeaderProps) {
  const router = useRouter();
  const { data } = useGetApiV1StoriesIdSuspense(storyId);
  const story = data.data;
  const { toggleBookmark, isPending } = useToggleStoryBookmark(storyId);

  const handleBookmarkClick = async () => {
    try {
      await toggleBookmark(!story.isBookmarked);
    } catch {
      // optimistic rollback handled in hook
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-[calc(4rem+var(--safe-area-top))] items-center justify-between border-b border-hairline bg-canvas/90 px-3 pt-[var(--safe-area-top)] backdrop-blur-sm">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 text-slate"
        aria-label="뒤로 가기"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-5" strokeWidth={1.75} />
      </Button>
      <h1 className="text-lg font-semibold text-ink">이야기</h1>
      <div className="flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 text-slate"
          aria-label="수정"
          asChild
        >
          <Link href={`/write/${storyId}`}>
            <Pencil className="size-[18px]" strokeWidth={1.75} />
          </Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("size-10", story.isBookmarked ? "text-primary" : "text-slate")}
          aria-label={story.isBookmarked ? "북마크 해제" : "북마크"}
          disabled={isPending}
          onClick={handleBookmarkClick}
        >
          <Bookmark
            className="size-[18px]"
            strokeWidth={1.75}
            fill={story.isBookmarked ? "currentColor" : "none"}
          />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 text-slate"
          aria-label="글자 크기"
          onClick={onFontSizeClick}
        >
          <ALargeSmall className="size-5" strokeWidth={1.75} />
        </Button>
      </div>
    </header>
  );
}
