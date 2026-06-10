"use client";

import { Bell, BookOpen } from "lucide-react";
import { useGetApiV1Notifications } from "@storyecho/api-client";
import { NotificationDrawer } from "@/components/app-shell/notification-drawer";
import { useMounted } from "@/components/client-only";
import { Button } from "@/components/ui/button";

const HEADER_ICON_CLASS = "text-primary size-7 shrink-0";
const HEADER_ICON_STROKE = 1.75;
const HEADER_SIDE_SLOT_CLASS = "flex size-12 shrink-0 items-center justify-center";

export function AppHeader() {
  const mounted = useMounted();
  const { data } = useGetApiV1Notifications(undefined, {
    query: { enabled: mounted, staleTime: 30_000 },
  });
  const unreadCount = data?.meta?.unreadCount ?? 0;

  return (
    <header className="flex h-[calc(4rem+var(--safe-area-top))] shrink-0 items-center justify-between border-b border-hairline bg-canvas px-5 pt-[var(--safe-area-top)] shadow-[0_1px_0_0_hsl(var(--border))]">
      <div className="flex flex-1 items-center justify-start">
        <div className={HEADER_SIDE_SLOT_CLASS} aria-hidden>
          <BookOpen className={HEADER_ICON_CLASS} strokeWidth={HEADER_ICON_STROKE} />
        </div>
      </div>
      <h1 className="flex-1 text-center font-display text-xl leading-none whitespace-nowrap text-primary">
        이야기해줘
      </h1>
      <div className="relative flex flex-1 items-center justify-end">
        <NotificationDrawer
          unreadCount={unreadCount}
          trigger={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-12 w-12 text-primary ${HEADER_SIDE_SLOT_CLASS} [&_svg]:size-6`}
              aria-label="알림"
            >
              <Bell className={HEADER_ICON_CLASS} strokeWidth={HEADER_ICON_STROKE} />
            </Button>
          }
        />
        {mounted && unreadCount > 0 && (
          <span className="pointer-events-none absolute top-1 right-1 size-2 rounded-full bg-primary ring-1 ring-canvas" />
        )}
      </div>
    </header>
  );
}
