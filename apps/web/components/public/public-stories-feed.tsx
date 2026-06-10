"use client";

import type { ReactNode } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getApiV1StoriesPublic, getGetApiV1StoriesPublicQueryKey } from "@storyecho/api-client";
import { PublicQuestionsListSkeleton } from "@/app/(shell)/_components/public-questions-list-skeleton";
import { ListLoadMore } from "@/components/list-load-more";
import { AnimatedList } from "@/components/magicui/animated-list";
import { useLoadMoreSentinel } from "@/hooks/use-load-more-sentinel";
import { cn } from "@/lib/utils";
import { PublicStoryCard } from "./public-story-card";

const PAGE_SIZE = 20;

type PublicStoriesFeedProps = {
  questionId?: string;
  title?: string;
  hideQuestionOnCard?: boolean;
  emptyState?: ReactNode;
  className?: string;
};

export function PublicStoriesFeed({
  questionId,
  title = "공개된 이야기",
  hideQuestionOnCard = false,
  emptyState,
  className,
}: PublicStoriesFeedProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [...getGetApiV1StoriesPublicQueryKey(), questionId ?? "all", "infinite"],
    queryFn: ({ pageParam }) =>
      getApiV1StoriesPublic({
        limit: PAGE_SIZE,
        ...(pageParam ? { cursor: pageParam } : {}),
        ...(questionId ? { questionId } : {}),
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) =>
      last.meta?.pagination?.hasMore ? (last.meta.pagination.nextCursor ?? undefined) : undefined,
  });

  const sentinelRef = useLoadMoreSentinel(
    () => {
      if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
    },
    { enabled: Boolean(hasNextPage) },
  );

  const stories = (data?.pages ?? []).flatMap((page) => page.data ?? []);

  if (isLoading) {
    return <PublicQuestionsListSkeleton />;
  }

  if (stories.length === 0) {
    if (emptyState) {
      return <>{emptyState}</>;
    }
    if (questionId) {
      return null;
    }
    return null;
  }

  return (
    <section className={cn("w-full", className)}>
      <h2 className="mb-4 text-base font-semibold text-charcoal">{title}</h2>
      <AnimatedList className="gap-3">
        {stories.map((story) => (
          <PublicStoryCard key={story.id} story={story} hideQuestionText={hideQuestionOnCard} />
        ))}
      </AnimatedList>
      <ListLoadMore
        sentinelRef={sentinelRef}
        isLoading={isFetchingNextPage}
        hasMore={hasNextPage}
      />
    </section>
  );
}
