import type { DrawerStoryItem } from "@/features/stories/types";
import { AnimatedList } from "@/components/magicui/animated-list";
import { DrawerStoryCard } from "./drawer-story-card";

type DrawerMonthSectionProps = {
  monthLabel: string;
  stories: DrawerStoryItem[];
};

export function DrawerMonthSection({ monthLabel, stories }: DrawerMonthSectionProps) {
  return (
    <section className="mb-8">
      <div className="border-hairline bg-canvas/95 sticky top-[52px] z-[5] mb-4 border-b py-2 backdrop-blur-sm">
        <h3 className="text-ink text-xl font-semibold">{monthLabel}</h3>
      </div>
      <AnimatedList className="gap-3">
        {stories.map((story) => (
          <DrawerStoryCard key={story.id} story={story} />
        ))}
      </AnimatedList>
    </section>
  );
}
