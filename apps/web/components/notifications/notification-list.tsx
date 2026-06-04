"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  AtSign,
  Bell,
  Lock,
  MessageCircle,
  NotebookPen,
  Reply,
} from "lucide-react";
import {
  getApiV1Notifications,
  getGetApiV1NotificationsQueryKey,
  usePatchApiV1Notifications,
} from "@storyecho/api-client";
import { AuthorAvatar } from "@/components/community/author-avatar";
import { AnimatedList } from "@/components/magicui/animated-list";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ListLoadMore } from "@/components/list-load-more";
import { formatRelativeTime } from "@/lib/community-mapper";
import { getNotificationHref } from "@/lib/notifications/notification-mapper";
import { useLoadMoreSentinel } from "@/hooks/use-load-more-sentinel";
import type { Notification } from "@storyecho/schemas";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

function notificationMessage(notification: Notification): string {
  const name = notification.actor?.nickname ?? "StoryEcho";
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

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [...getGetApiV1NotificationsQueryKey(), "infinite"],
    queryFn: ({ pageParam }) =>
      getApiV1Notifications({
        limit: PAGE_SIZE,
        ...(pageParam ? { cursor: pageParam } : {}),
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) =>
      last.meta?.pagination?.hasMore
        ? (last.meta.pagination.nextCursor ?? undefined)
        : undefined,
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

  const handleClick = async (notification: Notification) => {
    if (!notification.readAt) {
      await markRead.mutateAsync({ data: { ids: [notification.id] } });
      await queryClient.invalidateQueries({
        queryKey: getGetApiV1NotificationsQueryKey(),
      });
    }
    onNavigate?.();
    router.push(getNotificationHref(notification));
  };

  const handleMarkAllRead = async () => {
    await markRead.mutateAsync({ data: { markAll: true } });
    await queryClient.invalidateQueries({
      queryKey: getGetApiV1NotificationsQueryKey(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <p className="text-stone text-sm">불러오는 중…</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <BlurFade className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-charcoal font-medium">알림이 없어요</p>
        <p className="text-stone mt-2 text-sm">활동이 생기면 여기에 표시됩니다.</p>
      </BlurFade>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-hairline flex shrink-0 items-center justify-end border-b px-4 py-3">
        <button
          type="button"
          onClick={() => void handleMarkAllRead()}
          disabled={markRead.isPending || unreadCount === 0}
          className="text-primary text-xs font-medium disabled:opacity-40"
        >
          모두 읽음
        </button>
      </div>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <AnimatedList className="divide-hairline divide-y overflow-hidden rounded-xl border border-hairline bg-white">
          {notifications.map((notification) => (
            <div key={notification.id}>
              <button
                type="button"
                onClick={() => void handleClick(notification)}
                className="hover:bg-surface-cream/40 relative flex w-full items-start gap-3 px-4 py-4 text-left transition-colors"
              >
                {!notification.readAt && (
                  <span
                    aria-label="읽지 않은 알림"
                    className="bg-primary absolute top-4 right-4 size-2 rounded-full"
                  />
                )}
                <div className="bg-community-soft flex size-12 shrink-0 items-center justify-center rounded-full">
                  <NotificationIcon type={notification.type} />
                </div>
                <div className="min-w-0 flex-1 pr-4">
                  <p className="text-charcoal text-sm leading-relaxed">
                    {notificationMessage(notification)}
                  </p>
                  <p className="text-stone mt-1 text-xs">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
                {notification.actor && (
                  <AuthorAvatar nickname={notification.actor.nickname} />
                )}
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
    </div>
  );
}
