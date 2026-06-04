"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getApiV1StoriesDrawer,
  getGetApiV1StoriesDrawerQueryKey,
} from "@storyecho/api-client";
import { ListLoadMore } from "@/components/list-load-more";
import type { DrawerStoryItem, DrawerStoryListMeta } from "@/features/stories/types";
import { formatDrawerStats } from "@/lib/format-story-date";
import { useLoadMoreSentinel } from "@/hooks/use-load-more-sentinel";
import { useDrawerFilters } from "../_hooks/use-drawer-filters";
import { useDrawerGroups } from "../_hooks/use-drawer-groups";
import { useDrawerRevisit } from "../_hooks/use-drawer-revisit";
import { DrawerActivityGrass } from "./drawer-activity-grass";
import { DrawerCapsuleBanner } from "./drawer-capsule-banner";
import { DrawerDateBanner } from "./drawer-date-banner";
import { DrawerEmptyState } from "./drawer-empty-state";
import { DrawerFab } from "./drawer-fab";
import { DrawerListFilterTabs } from "./drawer-list-filter-tabs";
import { DrawerMonthSection } from "./drawer-month-section";
import { DrawerPageHeader } from "./drawer-page-header";
import { DrawerRevisitCard } from "./drawer-revisit-card";
import { DrawerSearchBar } from "./drawer-search-bar";

const PAGE_SIZE = 20;

const defaultMeta: DrawerStoryListMeta = {
  totalCount: 0,
  activeCapsuleCount: 0,
  oldestStoryAt: null,
  pagination: { nextCursor: null, hasMore: false },
};

type DrawerContentProps = {
  writeHref?: string;
};

export function DrawerContent({ writeHref = "/app/write" }: DrawerContentProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [...getGetApiV1StoriesDrawerQueryKey(), "infinite"],
    queryFn: ({ pageParam }) =>
      getApiV1StoriesDrawer({
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

  const meta: DrawerStoryListMeta = data?.pages[0]?.meta ?? defaultMeta;
  const stories: DrawerStoryItem[] = (data?.pages ?? [])
    .flatMap((page) => page.data ?? [])
    .map((story) => ({
      ...story,
      photoUrls: story.photoUrls ?? [],
    }));

  const {
    query,
    setQuery,
    listFilter,
    setListFilter,
    selectedDate,
    setSelectedDate,
    filteredStories,
    hasActiveQuery,
    hasActiveFilters,
    selectedDateQuestion,
  } = useDrawerFilters(stories);
  const groups = useDrawerGroups(filteredStories);
  const revisitStory = useDrawerRevisit(stories);
  const statsLabel = formatDrawerStats(meta.totalCount, meta.oldestStoryAt);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col px-5 pt-4 pb-[calc(var(--shell-tab-height)+var(--ad-strip-height)+2rem+var(--safe-area-bottom))]">
        <div className="bg-surface-cream/60 mb-6 h-24 animate-pulse rounded-2xl" />
        <div className="space-y-3">
          <div className="bg-surface-cream/60 h-36 animate-pulse rounded-2xl" />
          <div className="bg-surface-cream/60 h-36 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return <DrawerEmptyState writeHref={writeHref} />;
  }

  const showRevisit = !hasActiveFilters && revisitStory;
  const showCapsuleBanner = !hasActiveFilters;
  const isBookmarkEmpty = listFilter === "bookmarked" && filteredStories.length === 0;

  return (
    <>
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-[calc(var(--shell-tab-height)+var(--ad-strip-height)+2rem+var(--safe-area-bottom))]">
        <DrawerPageHeader statsLabel={statsLabel} />

        <DrawerActivityGrass
          stories={stories}
          oldestStoryAt={meta.oldestStoryAt}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {selectedDate && (
          <DrawerDateBanner
            selectedDate={selectedDate}
            questionText={selectedDateQuestion}
            onClear={() => setSelectedDate(null)}
          />
        )}

        <DrawerListFilterTabs value={listFilter} onChange={setListFilter} />
        <DrawerSearchBar query={query} onQueryChange={setQuery} />

        {showRevisit && <DrawerRevisitCard story={revisitStory} />}
        {showCapsuleBanner && <DrawerCapsuleBanner activeCapsuleCount={meta.activeCapsuleCount} />}

        {hasActiveQuery && (
          <p className="text-stone mb-4 text-xs">검색 결과 {filteredStories.length}개</p>
        )}

        {filteredStories.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <p className="text-charcoal text-base font-medium">
              {isBookmarkEmpty ? "북마크한 이야기가 없어요" : "검색 결과가 없어요"}
            </p>
            {(hasActiveQuery || listFilter === "bookmarked" || selectedDate) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setListFilter("all");
                  setSelectedDate(null);
                }}
                className="text-primary mt-3 text-sm font-medium underline-offset-2 hover:underline"
              >
                {isBookmarkEmpty ? "전체 보기" : "필터 지우기"}
              </button>
            )}
          </div>
        ) : (
          groups.map((group) => (
            <DrawerMonthSection
              key={group.monthLabel}
              monthLabel={group.monthLabel}
              stories={group.stories}
            />
          ))
        )}

        <ListLoadMore
          sentinelRef={sentinelRef}
          isLoading={isFetchingNextPage}
          hasMore={hasNextPage}
        />
      </div>
      <DrawerFab writeHref={writeHref} />
    </>
  );
}
