"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NotificationList } from "@/components/notifications/notification-list";
import { registerAndroidBackHandler } from "@/lib/native/android-back";

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

  useEffect(() => {
    if (!open) return;

    return registerAndroidBackHandler(() => {
      setOpen(false);
      return true;
    });
  }, [open]);

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
        className="bg-canvas flex flex-col gap-0 p-0 pb-[var(--safe-area-bottom)]"
      >
        <header className="border-hairline flex shrink-0 items-center justify-between border-b px-5 pb-4 pt-[var(--safe-area-top)]">
          <SheetTitle className="text-ink text-xl font-semibold">알림</SheetTitle>
          <SheetClose
            className="text-charcoal hover:text-ink -mr-1 rounded-sm p-2 opacity-80 transition-opacity hover:opacity-100"
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
