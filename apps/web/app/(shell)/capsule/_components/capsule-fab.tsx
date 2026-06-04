import Link from "next/link";
import { Plus } from "lucide-react";
import { MotionFab } from "@/components/motion/motion-fab";
import { SHELL_FAB_RIGHT_CLASS } from "@/lib/app-layout";
import { cn } from "@/lib/utils";

export function CapsuleFab() {
  return (
    <MotionFab
      className={cn(
        SHELL_FAB_RIGHT_CLASS,
        "z-40 bottom-[calc(var(--shell-tab-height)+var(--ad-strip-height)+1rem+var(--safe-area-bottom))]",
      )}
    >
      <Link
        href="/capsule/write"
        aria-label="새 타임캡슐"
        className="bg-capsule text-primary-foreground flex size-14 items-center justify-center rounded-full shadow-lg transition-colors hover:bg-capsule/90"
      >
        <Plus className="size-7 text-white" strokeWidth={2} />
      </Link>
    </MotionFab>
  );
}
