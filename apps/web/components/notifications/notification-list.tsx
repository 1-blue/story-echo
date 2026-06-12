"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { AtSign, Bell, Lock, MessageCircle, NotebookPen, Reply, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getApiV1Notifications,
  getGetApiV1NotificationsQueryKey,
  useDeleteApiV1Notifications,
  usePatchApiV1Notifications,
} from "@storyecho/api-client";
import type { Notification } from "@storyecho/schemas";
import { AuthorAvatar } from "@/components/community/author-avatar";
import { ListLoadMore } from "@/components/list-load-more";
import { AnimatedList } from "@/components/magicui/animated-list";
import { BlurFade } from "@/components/magicui/blur-fade";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLoadMoreSentinel } from "@/hooks/use-load-more-sentinel";
import { formatRelativeTime } from "@/lib/community-mapper";
import { getErrorMessage } from "@/lib/get-error-message";
import { getNotificationHref } from "@/lib/notifications/notification-mapper";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

function notificationMessage(notification: Notification): string {
  const name = notification.actor?.nickname ?? "이야기해줘";
  switch (notification.type) {
    case "comment_on_post":
      return `${name}님이 회원님의 토론에 댓글을 남겼어요`;
    case "reply_to_comment":
      return `${name}님이 회원님의 댓글에 답글을 남겼어요`;
    case "mention":
      return `${name}님이 댓글에서 회원님을 언급했어요`;
    case "comment_on_public_story":
      return `${name}님이 회원님의 이야기에 댓글을 남겼어요`;
    case "reply_to_story_comment":
      return `${name}님이 회원님의 댓글에 답글을 남겼어요`;
    case "daily_question_reminder":
      return "오늘의 질문이 도착했어요. 이야기를 남겨 보세요";
    case "capsule_unlocked":
      return "타임캡슐을 열 수 있어요";
    default:
      return "새 알림이 있어요";
  }
}

function NotificationIcon({ type }: { type: Notification["type"] }) {
  const className = "size-5";
  switch (type) {
    case "comment_on_post":
    case "comment_on_public_story":
      return <MessageCircle className={cn(className, "text-community-green")} strokeWidth={1.75} />;
    case "reply_to_comment":
    case "reply_to_story_comment":
      return <Reply className={cn(className, "text-community-green")} strokeWidth={1.75} />;
    case "mention":
      return <AtSign className={cn(className, "text-community-green")} strokeWidth={1.75} />;
    case "daily_question_reminder":
      return <NotebookPen className={cn(className, "text-primary")} strokeWidth={1.75} />;
    case "capsule_unlocked":
      return <Lock className={cn(className, "text-capsule")} strokeWidth={1.75} />;
    default:
      return <Bell className={cn(className, "text-primary")} strokeWidth={1.75} />;
  }
}

type NotificationListProps = {
  enabled?: boolean;
  onNavigate?: () => void;
};

export function NotificationList({ enabled = true, onNavigate }: NotificationListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const markRead = usePatchApiV1Notifications();
  const deleteNotifications = useDeleteApiV1Notifications();
  const [showDeleteReadConfirm, setShowDeleteReadConfirm] = useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [...getGetApiV1NotificationsQueryKey(), "infinite"],
    queryFn: ({ pageParam }) =>
      getApiV1Notifications({
        limit: PAGE_SIZE,
        ...(pageParam ? { cursor: pageParam } : {}),
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) =>
      last.meta?.pagination?.hasMore ? (last.meta.pagination.nextCursor ?? undefined) : undefined,
    enabled,
    staleTime: 30_000,
  });

  const sentinelRef = useLoadMoreSentinel(
    () => {
      if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
    },
    { enabled: Boolean(hasNextPage && enabled), rootRef: scrollRef },
  );

  const notifications = (data?.pages ?? []).flatMap((page) => page.data ?? []);
  const unreadCount = data?.pages[0]?.meta?.unreadCount ?? 0;
  const readCount = notifications.filter((n) => n.readAt).length;

  const invalidateNotifications = async () => {
    await queryClient.invalidateQueries({
      queryKey: getGetApiV1NotificationsQueryKey(),
    });
  };

  const handleClick = async (notification: Notification) => {
    if (!notification.readAt) {
      await markRead.mutateAsync({ data: { ids: [notification.id] } });
      await invalidateNotifications();
    }
    onNavigate?.();
    router.push(getNotificationHref(notification));
  };

  const handleMarkAllRead = async () => {
    await markRead.mutateAsync({ data: { markAll: true } });
    await invalidateNotifications();
  };

  const handleDeleteOne = async (notificationId: string) => {
    try {
      await deleteNotifications.mutateAsync({ data: { ids: [notificationId] } });
      await invalidateNotifications();
      toast.success("알림을 삭제했어요.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteRead = async () => {
    try {
      await deleteNotifications.mutateAsync({ data: { deleteRead: true } });
      await invalidateNotifications();
      setShowDeleteReadConfirm(false);
      toast.success("읽은 알림을 삭제했어요.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <p className="text-sm text-stone">불러오는 중…</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <BlurFade className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="font-medium text-charcoal">알림이 없어요</p>
        <p className="mt-2 text-sm text-stone">활동이 생기면 여기에 표시됩니다.</p>
      </BlurFade>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-end gap-3 border-b border-hairline px-4 py-3">
        <button
          type="button"
          onClick={() => setShowDeleteReadConfirm(true)}
          disabled={deleteNotifications.isPending || readCount === 0}
          className="text-xs font-medium text-stone transition-colors hover:text-charcoal disabled:opacity-40"
        >
          읽은 알림 삭제
        </button>
        <button
          type="button"
          onClick={() => void handleMarkAllRead()}
          disabled={markRead.isPending || unreadCount === 0}
          className="text-xs font-medium text-primary disabled:opacity-40"
        >
          모두 읽음
        </button>
      </div>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <AnimatedList className="divide-y divide-hairline overflow-hidden rounded-xl border border-hairline bg-white">
          {notifications.map((notification) => (
            <div key={notification.id} className="relative">
              <button
                type="button"
                onClick={() => void handleClick(notification)}
                className="relative flex w-full items-start gap-3 px-4 py-4 pr-12 text-left transition-colors hover:bg-surface-cream/40"
              >
                {!notification.readAt && (
                  <span
                    aria-label="읽지 않은 알림"
                    className="absolute top-4 right-10 size-2 rounded-full bg-primary"
                  />
                )}
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-community-soft">
                  <NotificationIcon type={notification.type} />
                </div>
                <div className="min-w-0 flex-1 pr-2">
                  <p className="text-sm leading-relaxed text-charcoal">
                    {notificationMessage(notification)}
                  </p>
                  <p className="mt-1 text-xs text-stone">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
                {notification.actor && <AuthorAvatar nickname={notification.actor.nickname} />}
              </button>
              <button
                type="button"
                aria-label="알림 삭제"
                onClick={(event) => {
                  event.stopPropagation();
                  void handleDeleteOne(notification.id);
                }}
                disabled={deleteNotifications.isPending}
                className="absolute top-4 right-3 rounded-sm p-1.5 text-stone transition-colors hover:bg-surface-cream/80 hover:text-charcoal disabled:opacity-40"
              >
                <Trash2 className="size-4" strokeWidth={1.75} />
              </button>
            </div>
          ))}
        </AnimatedList>
        <ListLoadMore
          sentinelRef={sentinelRef}
          isLoading={isFetchingNextPage}
          hasMore={hasNextPage}
        />
      </div>

      <Dialog open={showDeleteReadConfirm} onOpenChange={setShowDeleteReadConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>읽은 알림 삭제</DialogTitle>
            <DialogDescription>
              읽은 알림을 모두 삭제할까요? 읽지 않은 알림은 유지됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setShowDeleteReadConfirm(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleDeleteRead()}
              disabled={deleteNotifications.isPending}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
