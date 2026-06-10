"use client";

import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";

type PublicDetailHeaderProps = {
  onReport: () => void;
};

export function PublicDetailHeader({ onReport }: PublicDetailHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 flex h-[calc(4rem+var(--safe-area-top))] items-center justify-between border-b border-hairline bg-canvas px-3 pt-[var(--safe-area-top)]">
      <button
        type="button"
        aria-label="뒤로 가기"
        onClick={() => router.back()}
        className="rounded-full p-2 text-primary transition-colors hover:bg-surface-cream/60"
      >
        ←
      </button>
      <h1 className="text-xl font-semibold text-primary">공개 이야기</h1>
      <button
        type="button"
        aria-label="더보기"
        onClick={onReport}
        className="rounded-full p-2 text-primary transition-colors hover:bg-surface-cream/60"
      >
        <MoreVertical className="size-5" strokeWidth={1.75} />
      </button>
    </header>
  );
}
