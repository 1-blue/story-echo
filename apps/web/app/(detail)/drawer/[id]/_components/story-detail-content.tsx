"use client";

import { useGetApiV1StoriesIdSuspense } from "@storyecho/api-client";
import { BlurFade } from "@/components/magicui/blur-fade";
import type { StoryDetailItem } from "@/features/stories/types";
import { formatStoryDayLong } from "@/lib/format-story-date";
import type { FontSizePreference } from "../_hooks/use-font-size";
import { StoryDetailBody } from "./story-detail-body";
import { StoryDetailGallery } from "./story-detail-gallery";
import { StoryDetailMeta } from "./story-detail-meta";
import { StoryDetailQuestion } from "./story-detail-question";

type StoryDetailContentProps = {
  storyId: string;
  fontSize: FontSizePreference;
};

export function StoryDetailContent({ storyId, fontSize }: StoryDetailContentProps) {
  const { data } = useGetApiV1StoriesIdSuspense(storyId);
  const story: StoryDetailItem = {
    ...data.data,
    photoUrls: data.data.photoUrls ?? [],
  };

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-5 py-6 pb-12">
      <BlurFade>
        <StoryDetailMeta story={story} />
        <StoryDetailQuestion questionText={story.questionText} fontSize={fontSize} />
      </BlurFade>
      <StoryDetailBody bodyText={story.bodyText} fontSize={fontSize} />
      <StoryDetailGallery photoUrls={story.photoUrls} />
      <footer className="border-hairline pt-6 text-center">
        <p className="text-xs text-stone">{formatStoryDayLong(story.createdAt)}에 작성</p>
      </footer>
    </main>
  );
}
