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
      className="border-capsule/30 bg-capsule-soft mb-8 flex items-center justify-between rounded-lg border border-dashed p-4 transition-opacity hover:opacity-90"
    >
      <div className="text-charcoal flex items-center gap-2 text-sm font-medium">
        <Lock className="text-capsule size-[18px]" strokeWidth={1.75} />
        <span>봉인된 편지 {activeCapsuleCount}개</span>
      </div>
      <span className="text-capsule flex items-center text-xs font-semibold">
        타임캡슐 보기
        <ArrowRight className="ml-1 size-4" strokeWidth={1.75} />
      </span>
    </Link>
  );
}
