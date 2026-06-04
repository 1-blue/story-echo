"use client";

import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";

type PublicDetailHeaderProps = {
  onReport: () => void;
};

export function PublicDetailHeader({ onReport }: PublicDetailHeaderProps) {
  const router = useRouter();

  return (
    <header className="border-hairline bg-canvas sticky top-0 z-50 flex h-[calc(4rem+var(--safe-area-top))] items-center justify-between border-b px-3 pt-[var(--safe-area-top)]">
      <button
        type="button"
        aria-label="뒤로 가기"
        onClick={() => router.back()}
        className="text-primary hover:bg-surface-cream/60 rounded-full p-2 transition-colors"
      >
        ←
      </button>
      <h1 className="text-primary text-xl font-semibold">공개 이야기</h1>
      <button
        type="button"
        aria-label="더보기"
        onClick={onReport}
        className="text-primary hover:bg-surface-cream/60 rounded-full p-2 transition-colors"
      >
        <MoreVertical className="size-5" strokeWidth={1.75} />
      </button>
    </header>
  );
}
