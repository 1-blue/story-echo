import Link from "next/link";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";

type DrawerEmptyStateProps = {
  canWriteToday?: boolean;
};

export function DrawerEmptyState({ canWriteToday = true }: DrawerEmptyStateProps) {
  return (
    <BlurFade className="flex flex-1 flex-col items-center justify-center px-5 py-16 text-center">
      <p className="text-base font-medium text-charcoal">아직 작성한 이야기가 없어요</p>
      <p className="mt-2 text-sm text-stone">오늘의 질문에 답하고 서랍을 채워보세요.</p>
      {canWriteToday && (
        <Button asChild className="mt-6 rounded-full">
          <Link href="/write">이야기하기</Link>
        </Button>
      )}
    </BlurFade>
  );
}
