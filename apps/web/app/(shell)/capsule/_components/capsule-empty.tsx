import Link from "next/link";
import { Hourglass } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";

export function CapsuleEmpty() {
  return (
    <BlurFade className="flex flex-1 flex-col items-center justify-center px-5 py-16 text-center">
      <div className="mb-8 flex size-24 items-center justify-center rounded-full border border-capsule/20 bg-capsule-soft shadow-sm">
        <Hourglass className="size-10 text-capsule" strokeWidth={1.5} />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-ink">아직 타임캡슐이 없어요</h2>
      <p className="mb-8 max-w-xs text-sm leading-relaxed text-slate">
        미래의 나에게 편지를 봉인해 보세요.
      </p>
      <Button asChild className="rounded-full px-8">
        <Link href="/capsule/write">첫 타임캡슐 만들기</Link>
      </Button>
    </BlurFade>
  );
}
