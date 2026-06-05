"use client";

import { Bell, BookOpen } from "lucide-react";
import { useGetApiV1Notifications } from "@storyecho/api-client";
import { Button } from "@/components/ui/button";
import { NotificationDrawer } from "@/components/app-shell/notification-drawer";
import { useMounted } from "@/components/client-only";

export function AppHeader() {
  const mounted = useMounted();
  const { data } = useGetApiV1Notifications(undefined, {
    query: { enabled: mounted, staleTime: 30_000 },
  });
  const unreadCount = data?.meta?.unreadCount ?? 0;

  return (
    <header className="border-hairline bg-canvas flex h-[calc(4rem+var(--safe-area-top))] shrink-0 items-center justify-between border-b px-5 pt-[var(--safe-area-top)] shadow-[0_1px_0_0_hsl(var(--border))]">
      <div className="flex flex-1 items-center justify-start">
        <BookOpen className="text-primary size-6" strokeWidth={1.75} aria-hidden />
      </div>
      <h1 className="text-primary font-display flex-1 text-center text-xl leading-none whitespace-nowrap">
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
              className="text-primary size-10"
              aria-label="알림"
            >
              <Bell className="size-6" strokeWidth={1.75} />
            </Button>
          }
        />
        {mounted && unreadCount > 0 && (
          <span className="bg-primary ring-canvas pointer-events-none absolute top-0.5 right-0.5 size-1.5 rounded-full ring-1" />
        )}
      </div>
    </header>
  );
}
