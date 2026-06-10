import { StoryMetaBadges } from "@/components/story/story-meta-badges";
import { Badge } from "@/components/ui/badge";
import type { StoryDetailItem } from "@/features/stories/types";
import { formatStoryDayLong } from "@/lib/format-story-date";

type StoryDetailMetaProps = {
  story: StoryDetailItem;
};

export function StoryDetailMeta({ story }: StoryDetailMetaProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <Badge variant="outline" className="border-hairline bg-surface-dim text-charcoal">
        {formatStoryDayLong(story.createdAt)}
      </Badge>
      {story.visibility === "community" && (
        <span className="inline-flex items-center rounded-full bg-community-soft px-2.5 py-1 text-xs font-semibold text-community">
          오늘 공개
        </span>
      )}
      <StoryMetaBadges story={story} />
    </div>
  );
}
