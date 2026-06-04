"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import {
  getApiV1CommunityPosts,
  getGetApiV1CommunityPostsQueryKey,
} from "@storyecho/api-client";
import { AnimatedList } from "@/components/magicui/animated-list";
import { ListLoadMore } from "@/components/list-load-more";
import { useLoadMoreSentinel } from "@/hooks/use-load-more-sentinel";
import { CommunityEmpty } from "./community-empty";
import { CommunityPostCard } from "./community-post-card";
import { CommunityPostListSkeleton } from "./community-post-list-skeleton";

const PAGE_SIZE = 20;

type CommunityPostListProps = {
  query: string;
  debouncedQuery: string;
};

export function CommunityPostList({ query, debouncedQuery }: CommunityPostListProps) {
  const trimmedDebounced = debouncedQuery.trim();
  const listParams = {
    limit: PAGE_SIZE,
    ...(trimmedDebounced ? { q: trimmedDebounced } : {}),
  };

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [...getGetApiV1CommunityPostsQueryKey(listParams), "infinite"],
      queryFn: ({ pageParam }) =>
        getApiV1CommunityPosts({
          ...listParams,
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (last) =>
        last.meta?.pagination?.hasMore
          ? (last.meta.pagination.nextCursor ?? undefined)
          : undefined,
      placeholderData: keepPreviousData,
    });

  const sentinelRef = useLoadMoreSentinel(
    () => {
      if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
    },
    { enabled: Boolean(hasNextPage) },
  );

  const posts = (data?.pages ?? []).flatMap((page) => page.data ?? []);
  const hasActiveQuery = query.trim().length > 0;
  const isSearchPending = query !== debouncedQuery || (isFetching && !isFetchingNextPage);

  if (isLoading || isSearchPending) {
    return <CommunityPostListSkeleton />;
  }

  if (posts.length === 0 && !hasActiveQuery) {
    return <CommunityEmpty />;
  }

  return (
    <>
      {hasActiveQuery && (
        <p className="text-stone mb-4 text-xs">검색 결과 {posts.length}개</p>
      )}

      {posts.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <p className="text-charcoal text-base font-medium">검색 결과가 없어요</p>
          <p className="text-stone mt-2 text-sm">다른 검색어로 시도해 보세요.</p>
        </div>
      ) : (
        <AnimatedList key={trimmedDebounced || "all"} className="mt-4 gap-4">
          {posts.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={{
                ...post,
                photoUrls: post.photoUrls ?? [],
                reactionCounts: (post.reactionCounts ?? []).map((r) => ({
                  ...r,
                  reactedByMe: r.reactedByMe ?? false,
                })),
              }}
            />
          ))}
        </AnimatedList>
      )}

      <ListLoadMore
        sentinelRef={sentinelRef}
        isLoading={isFetchingNextPage}
        hasMore={hasNextPage}
      />
    </>
  );
}
