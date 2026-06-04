import type { DrawerStoryItem } from "@/features/stories/types";

type StoryMetaBadgesProps = {
  story: Pick<DrawerStoryItem, "isEchoStory" | "isCapsule" | "isCapsuleActive">;
};

export function StoryMetaBadges({ story }: StoryMetaBadgesProps) {
  if (story.isEchoStory) {
    return (
      <span className="bg-echo-soft text-echo inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold">
        1년 Echo
      </span>
    );
  }

  if (story.isCapsule && !story.isCapsuleActive) {
    return (
      <span className="bg-capsule-soft text-capsule inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold">
        타임캡슐 해제됨
      </span>
    );
  }

  return null;
}
