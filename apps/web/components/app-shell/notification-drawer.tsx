"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { NotificationList } from "@/components/notifications/notification-list";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type NotificationDrawerProps = {
  trigger: React.ReactNode;
  unreadCount?: number;
};

export function NotificationDrawer({ trigger }: NotificationDrawerProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnPullRefresh = () => setOpen(false);
    document.addEventListener("storyecho:pull-refresh", closeOnPullRefresh);
    return () => document.removeEventListener("storyecho:pull-refresh", closeOnPullRefresh);
  }, []);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setOpen(true);
      return;
    }
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        fullScreen
        dismissOnOutside={false}
        showClose={false}
        className="flex flex-col gap-0 bg-canvas p-0 pb-[var(--safe-area-bottom)]"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-hairline px-5 pt-[var(--safe-area-top)] pb-4">
          <SheetTitle className="text-xl font-semibold text-ink">알림</SheetTitle>
          <SheetClose
            className="-mr-1 rounded-sm p-2 text-charcoal opacity-80 transition-opacity hover:text-ink hover:opacity-100"
            aria-label="알림 닫기"
          >
            <X className="size-5" />
          </SheetClose>
        </header>
        <NotificationList enabled={open} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
