"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function QuestionsHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex h-[calc(4rem+var(--safe-area-top))] shrink-0 items-center justify-between border-b border-hairline bg-canvas px-5 pt-[var(--safe-area-top)]">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-sm font-medium text-slate transition-colors hover:text-charcoal"
      >
        ← 뒤로
      </button>
      <h1 className="text-lg font-semibold text-ink">질문 모아보기</h1>
      <Link
        href="/"
        className="text-sm font-medium text-slate transition-colors hover:text-charcoal"
      >
        홈
      </Link>
    </header>
  );
}
