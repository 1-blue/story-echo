import type { DrawerStoryItem } from "@/features/stories/types";

type StoryMetaBadgesProps = {
  story: Pick<DrawerStoryItem, "isEchoStory" | "isCapsule" | "isCapsuleActive">;
};

export function StoryMetaBadges({ story }: StoryMetaBadgesProps) {
  if (story.isEchoStory) {
    return (
      <span className="inline-flex items-center rounded-full bg-echo-soft px-2.5 py-1 text-xs font-semibold text-echo">
        1년 Echo
      </span>
    );
  }

  if (story.isCapsule && !story.isCapsuleActive) {
    return (
      <span className="inline-flex items-center rounded-full bg-capsule-soft px-2.5 py-1 text-xs font-semibold text-capsule">
        타임캡슐 해제됨
      </span>
    );
  }

  return null;
}
