"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useGetApiV1UsersMe } from "@storyecho/api-client";
import { MotionFab } from "@/components/motion/motion-fab";

export function CommunityFab() {
  const { data } = useGetApiV1UsersMe();
  const isMember = data?.data.role !== "guest";

  if (!isMember) return null;

  return (
    <MotionFab className="fixed right-5 bottom-[calc(var(--shell-tab-height)+var(--ad-strip-height)+1rem+var(--safe-area-bottom))] z-40">
      <Link
        href="/app/community/write"
        aria-label="새 글 작성"
        className="bg-primary text-primary-foreground flex size-14 items-center justify-center rounded-full shadow-lg transition-colors hover:bg-primary/90"
      >
        <Plus className="size-7" strokeWidth={2} />
      </Link>
    </MotionFab>
  );
}
