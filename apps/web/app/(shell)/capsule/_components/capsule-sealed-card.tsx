import Link from "next/link";
import { Lock } from "lucide-react";
import type { CapsuleStorySummary } from "@storyecho/schemas";
import { formatUnlockDateKo } from "@/lib/capsule-utils";

type CapsuleSealedCardProps = {
  capsule: CapsuleStorySummary;
};

export function CapsuleSealedCard({ capsule }: CapsuleSealedCardProps) {
  return (
    <Link
      href={`/capsule/${capsule.id}`}
      className="flex flex-col gap-3 rounded-xl border border-dashed border-capsule/30 bg-capsule-soft p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-capsule/10 px-2.5 py-1 text-xs font-semibold text-capsule">
          <Lock className="size-3.5" strokeWidth={2} />
          봉인 중
        </span>
        <span className="text-sm font-bold text-capsule">D-{capsule.daysUntilUnlock}</span>
      </div>

      {capsule.questionText && (
        <h3 className="line-clamp-2 font-display text-lg leading-snug text-ink">
          {capsule.questionText}
        </h3>
      )}

      <div className="relative overflow-hidden rounded-lg border border-capsule/20 bg-white/50 p-4">
        <div className="flex flex-col items-center gap-2 py-4 text-center text-sm text-slate">
          <Lock className="size-5 text-capsule/60" strokeWidth={1.75} />
          <span>봉인된 편지예요</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-stone">
        <span>{formatUnlockDateKo(capsule.unlockAt)}에 열림</span>
        <span>{capsule.recipientLabel}</span>
      </div>
    </Link>
  );
}
