import Link from "next/link";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";

type DrawerEmptyStateProps = {
  writeHref?: string;
};

export function DrawerEmptyState({ writeHref = "/write" }: DrawerEmptyStateProps) {
  return (
    <BlurFade className="flex flex-1 flex-col items-center justify-center px-5 py-16 text-center">
      <p className="text-charcoal text-base font-medium">아직 작성한 이야기가 없어요</p>
      <p className="text-stone mt-2 text-sm">오늘의 질문에 답하고 서랍을 채워보세요.</p>
      <Button asChild className="mt-6 rounded-full">
        <Link href={writeHref}>이야기하기</Link>
      </Button>
    </BlurFade>
  );
}
