"use client";

import Link from "next/link";
import { ChevronRight, History } from "lucide-react";
import type { DrawerStoryItem } from "@/features/stories/types";
import { BlurFade } from "@/components/magicui/blur-fade";
import { formatStoryDayLong } from "@/lib/format-story-date";

type DrawerRevisitCardProps = {
  story: DrawerStoryItem;
};

export function DrawerRevisitCard({ story }: DrawerRevisitCardProps) {
  return (
    <BlurFade delay={0.05}>
      <Link
        href={`/drawer/${story.id}`}
        className="bg-terracotta-soft mb-4 flex w-full items-start justify-between rounded-2xl p-5 text-left transition-opacity hover:opacity-90"
      >
        <div className="min-w-0 flex-1">
          <div className="text-primary mb-2 flex items-center gap-1.5">
            <History className="size-[18px]" strokeWidth={1.75} />
            <span className="text-xs font-semibold">오늘의 회상</span>
          </div>
          <p className="text-stone mb-1 text-xs">{formatStoryDayLong(story.createdAt)}</p>
          <h3 className="text-ink mb-1 line-clamp-1 text-base font-semibold">
            {story.questionText ?? "오늘의 질문"}
          </h3>
          <p className="text-charcoal line-clamp-1 text-sm">{story.bodyText}</p>
        </div>
        <ChevronRight className="text-primary mt-1 size-5 shrink-0" strokeWidth={1.75} />
      </Link>
    </BlurFade>
  );
}
