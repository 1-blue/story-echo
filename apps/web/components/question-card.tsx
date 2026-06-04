import Link from "next/link";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuestionCardProps = {
  question: string;
  todayStoryId?: string | null;
};

export function QuestionCard({ question, todayStoryId }: QuestionCardProps) {
  const writeHref = todayStoryId ? `/write/${todayStoryId}` : "/write";
  const ctaLabel = todayStoryId ? "이야기 수정" : "이야기하기";

  return (
    <article className="relative flex w-full flex-col items-center overflow-hidden rounded-xl border border-hairline bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      <div className="pointer-events-none absolute -top-12 -right-12 size-32 rounded-full bg-terracotta-soft opacity-40 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 size-24 rounded-full bg-surface-cream opacity-60 blur-xl" />

      <h1 className="relative z-10 mt-3 mb-10 max-w-[280px] font-display text-[28px] leading-snug font-medium tracking-[-0.3px] break-keep text-ink">
        {question}
      </h1>

      <div className="relative z-10 mt-auto flex w-full flex-col gap-3">
        <Button
          asChild
          className="h-auto w-full gap-2 rounded-full py-3.5 text-[15px] shadow-[0_4px_14px_rgba(144,72,36,0.15)] active:scale-[0.98]"
        >
          <Link href={writeHref}>
            <PenLine className="size-5" />
            {ctaLabel}
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-auto w-full rounded-full border-hairline-strong bg-transparent py-3.5 text-[15px] text-charcoal hover:bg-surface-cream active:scale-[0.98]"
        >
          <Link href="/drawer">나중에</Link>
        </Button>
      </div>
    </article>
  );
}
