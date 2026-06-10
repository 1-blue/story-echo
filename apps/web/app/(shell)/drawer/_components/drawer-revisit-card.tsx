"use client";

import Link from "next/link";
import { ChevronRight, History } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import type { DrawerStoryItem } from "@/features/stories/types";
import { formatStoryDayLong } from "@/lib/format-story-date";

type DrawerRevisitCardProps = {
  story: DrawerStoryItem;
};

export function DrawerRevisitCard({ story }: DrawerRevisitCardProps) {
  return (
    <BlurFade delay={0.05}>
      <Link
        href={`/drawer/${story.id}`}
        className="mb-4 flex w-full items-start justify-between rounded-2xl bg-terracotta-soft p-5 text-left transition-opacity hover:opacity-90"
      >
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-1.5 text-primary">
            <History className="size-[18px]" strokeWidth={1.75} />
            <span className="text-xs font-semibold">오늘의 회상</span>
          </div>
          <p className="mb-1 text-xs text-stone">{formatStoryDayLong(story.createdAt)}</p>
          <h3 className="mb-1 line-clamp-1 text-base font-semibold text-ink">
            {story.questionText ?? "오늘의 질문"}
          </h3>
          <p className="line-clamp-1 text-sm text-charcoal">{story.bodyText}</p>
        </div>
        <ChevronRight className="mt-1 size-5 shrink-0 text-primary" strokeWidth={1.75} />
      </Link>
    </BlurFade>
  );
}
