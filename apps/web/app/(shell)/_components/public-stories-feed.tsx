"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getApiV1StoriesPublic,
  getGetApiV1StoriesPublicQueryKey,
} from "@storyecho/api-client";
import { AnimatedList } from "@/components/magicui/animated-list";
import { ListLoadMore } from "@/components/list-load-more";
import { useLoadMoreSentinel } from "@/hooks/use-load-more-sentinel";
import { PublicStoryCard } from "./public-story-card";
import { PublicQuestionsListSkeleton } from "./public-questions-list-skeleton";

const PAGE_SIZE = 20;

export function PublicStoriesFeed() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [...getGetApiV1StoriesPublicQueryKey(), "infinite"],
    queryFn: ({ pageParam }) =>
      getApiV1StoriesPublic({
        limit: PAGE_SIZE,
        ...(pageParam ? { cursor: pageParam } : {}),
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) =>
      last.meta?.pagination?.hasMore
        ? (last.meta.pagination.nextCursor ?? undefined)
        : undefined,
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

  if (stories.length === 0) return null;

  return (
    <section className="mt-10 w-full">
      <h2 className="text-charcoal mb-4 text-base font-semibold">공개된 이야기</h2>
      <AnimatedList className="gap-3">
        {stories.map((story) => (
          <PublicStoryCard key={story.id} story={story} />
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
