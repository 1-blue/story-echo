import Link from "next/link";
import { Plus } from "lucide-react";
import { MotionFab } from "@/components/motion/motion-fab";
import { SHELL_FAB_RIGHT_CLASS } from "@/lib/app-layout";
import { cn } from "@/lib/utils";

export function DrawerFab() {
  return (
    <MotionFab
      className={cn(
        SHELL_FAB_RIGHT_CLASS,
        "bottom-[calc(var(--shell-tab-height)+var(--ad-strip-height)+1rem+var(--safe-area-bottom))] z-40",
      )}
    >
      <Link
        href="/write"
        aria-label="이야기하기"
        className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
      >
        <Plus className="size-7" strokeWidth={2} />
      </Link>
    </MotionFab>
  );
}
