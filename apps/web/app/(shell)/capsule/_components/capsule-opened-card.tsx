import Link from "next/link";
import type { CapsuleStorySummary } from "@storyecho/schemas";
import { formatStoryDayLong } from "@/lib/format-story-date";

type CapsuleOpenedCardProps = {
  capsule: CapsuleStorySummary;
};

export function CapsuleOpenedCard({ capsule }: CapsuleOpenedCardProps) {
  return (
    <Link
      href={`/capsule/${capsule.id}`}
      className="flex flex-col gap-3 rounded-xl border border-hairline bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center rounded-full bg-capsule-soft px-2.5 py-1 text-xs font-semibold text-capsule">
          열림
        </span>
        <span className="text-xs text-stone">{formatStoryDayLong(capsule.unlockAt)}</span>
      </div>

      {capsule.questionText && (
        <h3 className="line-clamp-2 font-display text-lg leading-snug text-ink">
          {capsule.questionText}
        </h3>
      )}

      {capsule.bodyPreview && (
        <p className="line-clamp-3 text-sm leading-relaxed text-charcoal">{capsule.bodyPreview}</p>
      )}
    </Link>
  );
}
