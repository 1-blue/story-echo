import Link from "next/link";
import { Check, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes/routes";

type QuestionCardProps = {
  question: string;
  todayStoryId?: string | null;
};

export function QuestionCard({ question, todayStoryId }: QuestionCardProps) {
  const hasTodayStory = Boolean(todayStoryId);

  return (
    <article className="relative flex w-full flex-col items-center overflow-hidden rounded-xl border border-hairline bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      <div className="pointer-events-none absolute -top-12 -right-12 size-32 rounded-full bg-terracotta-soft opacity-40 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 size-24 rounded-full bg-surface-cream opacity-60 blur-xl" />

      <h1 className="relative z-10 mt-3 mb-10 max-w-[280px] font-display text-[28px] leading-snug font-medium tracking-[-0.3px] break-keep text-ink">
        {question}
      </h1>

      <div className="relative z-10 mt-auto flex w-full flex-col gap-3">
        {hasTodayStory ? (
          <>
            <div className="flex items-center justify-center gap-2 rounded-full bg-terracotta-soft/60 px-4 py-3.5 text-[15px] text-charcoal">
              <Check className="size-5 shrink-0 text-primary" strokeWidth={2} />
              <span className="font-medium">오늘의 이야기를 남겼어요</span>
            </div>
            <Button
              asChild
              className="h-auto w-full rounded-full py-3.5 text-[15px] shadow-[0_4px_14px_rgba(144,72,36,0.15)] active:scale-[0.98]"
            >
              <Link href={`/drawer/${todayStoryId}`}>서랍에서 보기</Link>
            </Button>
          </>
        ) : (
          <Button
            asChild
            className="h-auto w-full gap-2 rounded-full py-3.5 text-[15px] shadow-[0_4px_14px_rgba(144,72,36,0.15)] active:scale-[0.98]"
          >
            <Link href="/write">
              <PenLine className="size-5" />
              이야기하기
            </Link>
          </Button>
        )}
        <Button
          asChild
          variant="outline"
          className="h-auto w-full rounded-full border-hairline-strong bg-transparent py-3.5 text-[15px] text-charcoal hover:bg-surface-cream active:scale-[0.98]"
        >
          <Link href="/drawer">나중에</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-auto w-full rounded-full border-hairline-strong bg-transparent py-3 text-sm text-charcoal hover:bg-surface-cream active:scale-[0.98]"
        >
          <Link href={ROUTES.questions.url}>{ROUTES.questions.label}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-auto w-full rounded-full border-hairline-strong bg-transparent py-3 text-sm text-charcoal hover:bg-surface-cream active:scale-[0.98]"
        >
          <Link href={ROUTES.about.url}>{ROUTES.about.label}</Link>
        </Button>
      </div>
    </article>
  );
}
