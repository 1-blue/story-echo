import Link from "next/link";
import { Plus } from "lucide-react";
import { MotionFab } from "@/components/motion/motion-fab";
import { SHELL_FAB_RIGHT_CLASS } from "@/lib/app-layout";
import { cn } from "@/lib/utils";

type DrawerFabProps = {
  writeHref?: string;
};

export function DrawerFab({ writeHref = "/write" }: DrawerFabProps) {
  return (
    <MotionFab
      className={cn(
        SHELL_FAB_RIGHT_CLASS,
        "z-40 bottom-[calc(var(--shell-tab-height)+var(--ad-strip-height)+1rem+var(--safe-area-bottom))]",
      )}
    >
      <Link
        href={writeHref}
        aria-label="이야기하기"
        className="bg-primary text-primary-foreground flex size-14 items-center justify-center rounded-full shadow-lg transition-colors hover:bg-primary/90"
      >
        <Plus className="size-7" strokeWidth={2} />
      </Link>
    </MotionFab>
  );
}
