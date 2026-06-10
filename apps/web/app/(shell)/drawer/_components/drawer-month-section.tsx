import { AnimatedList } from "@/components/magicui/animated-list";
import type { DrawerStoryItem } from "@/features/stories/types";
import { DrawerStoryCard } from "./drawer-story-card";

type DrawerMonthSectionProps = {
  monthLabel: string;
  stories: DrawerStoryItem[];
};

export function DrawerMonthSection({ monthLabel, stories }: DrawerMonthSectionProps) {
  return (
    <section className="mb-8">
      <div className="sticky top-[52px] z-[5] mb-4 border-b border-hairline bg-canvas/95 py-2 backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-ink">{monthLabel}</h3>
      </div>
      <AnimatedList className="gap-3">
        {stories.map((story) => (
          <DrawerStoryCard key={story.id} story={story} />
        ))}
      </AnimatedList>
    </section>
  );
}
