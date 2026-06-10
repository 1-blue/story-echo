import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

type DrawerCapsuleBannerProps = {
  activeCapsuleCount: number;
};

export function DrawerCapsuleBanner({ activeCapsuleCount }: DrawerCapsuleBannerProps) {
  if (activeCapsuleCount <= 0) return null;

  return (
    <Link
      href="/capsule"
      className="mb-8 flex items-center justify-between rounded-lg border border-dashed border-capsule/30 bg-capsule-soft p-4 transition-opacity hover:opacity-90"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-charcoal">
        <Lock className="size-[18px] text-capsule" strokeWidth={1.75} />
        <span>봉인된 편지 {activeCapsuleCount}개</span>
      </div>
      <span className="flex items-center text-xs font-semibold text-capsule">
        타임캡슐 보기
        <ArrowRight className="ml-1 size-4" strokeWidth={1.75} />
      </span>
    </Link>
  );
}
