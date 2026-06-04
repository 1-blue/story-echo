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
      className="border-capsule/30 bg-capsule-soft hover:shadow-md flex flex-col gap-3 rounded-xl border border-dashed p-4 shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="bg-capsule/10 text-capsule inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold">
          <Lock className="size-3.5" strokeWidth={2} />
          봉인 중
        </span>
        <span className="text-capsule text-sm font-bold">D-{capsule.daysUntilUnlock}</span>
      </div>

      {capsule.questionText && (
        <h3 className="text-ink font-display line-clamp-2 text-lg leading-snug">
          {capsule.questionText}
        </h3>
      )}

      <div className="border-capsule/20 bg-white/50 relative overflow-hidden rounded-lg border p-4">
        <div className="text-slate flex flex-col items-center gap-2 py-4 text-center text-sm">
          <Lock className="text-capsule/60 size-5" strokeWidth={1.75} />
          <span>봉인된 편지예요</span>
        </div>
      </div>

      <div className="text-stone flex items-center justify-between text-xs">
        <span>{formatUnlockDateKo(capsule.unlockAt)}에 열림</span>
        <span>{capsule.recipientLabel}</span>
      </div>
    </Link>
  );
}
