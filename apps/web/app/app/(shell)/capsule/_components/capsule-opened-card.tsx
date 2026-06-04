import Link from "next/link";
import type { CapsuleStorySummary } from "@storyecho/schemas";
import { formatStoryDayLong } from "@/lib/format-story-date";

type CapsuleOpenedCardProps = {
  capsule: CapsuleStorySummary;
};

export function CapsuleOpenedCard({ capsule }: CapsuleOpenedCardProps) {
  return (
    <Link
      href={`/app/capsule/${capsule.id}`}
      className="border-hairline hover:shadow-md flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="bg-capsule-soft text-capsule inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold">
          열림
        </span>
        <span className="text-stone text-xs">{formatStoryDayLong(capsule.unlockAt)}</span>
      </div>

      {capsule.questionText && (
        <h3 className="text-ink font-display line-clamp-2 text-lg leading-snug">
          {capsule.questionText}
        </h3>
      )}

      {capsule.bodyPreview && (
        <p className="text-charcoal line-clamp-3 text-sm leading-relaxed">{capsule.bodyPreview}</p>
      )}
    </Link>
  );
}
