"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getApiV1StoriesCapsule, getGetApiV1StoriesCapsuleQueryKey } from "@storyecho/api-client";
import { useAdEligible } from "@/components/app-shell/ad-eligibility-context";
import { ListLoadMore } from "@/components/list-load-more";
import { AnimatedList } from "@/components/magicui/animated-list";
import { useLoadMoreSentinel } from "@/hooks/use-load-more-sentinel";
import { CapsuleEmpty } from "./capsule-empty";
import { CapsuleFab } from "./capsule-fab";
import { CapsuleOpenedCard } from "./capsule-opened-card";
import { CapsuleSealedCard } from "./capsule-sealed-card";

const PAGE_SIZE = 20;

export function CapsuleContent() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [...getGetApiV1StoriesCapsuleQueryKey(), "infinite"],
    queryFn: ({ pageParam }) =>
      getApiV1StoriesCapsule({
        limit: PAGE_SIZE,
        ...(pageParam ? { cursor: pageParam } : {}),
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

  const sealed = (data?.pages ?? []).flatMap((page) => page.data?.sealed ?? []);
  const opened = (data?.pages ?? []).flatMap((page) => page.data?.opened ?? []);
  const isEmpty = !isLoading && sealed.length === 0 && opened.length === 0;

  useAdEligible(!isLoading && !isEmpty);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col px-5 pt-4 pb-[calc(var(--shell-tab-height)+var(--ad-strip-height)+2rem+var(--safe-area-bottom))]">
        <div className="mb-6 h-8 w-32 animate-pulse rounded bg-surface-cream/60" />
        <div className="h-44 animate-pulse rounded-xl border border-dashed border-capsule/20 bg-capsule-soft/40" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <>
        <CapsuleEmpty />
        <CapsuleFab />
      </>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-[calc(var(--shell-tab-height)+var(--ad-strip-height)+2rem+var(--safe-area-bottom))]" data-shell-scroll>
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-ink">타임캡슐</h2>
          <p className="text-base text-slate">미래의 나에게 봉인해 둔 편지예요</p>
        </div>

        {sealed.length > 0 && (
          <section className="mb-8">
            <h3 className="mb-3 text-sm font-semibold text-charcoal">봉인 중</h3>
            <AnimatedList className="gap-4">
              {sealed.map((capsule) => (
                <CapsuleSealedCard key={capsule.id} capsule={capsule} />
              ))}
            </AnimatedList>
          </section>
        )}

        {opened.length > 0 && (
          <section>
            <h3 className="mb-3 text-sm font-semibold text-charcoal">열린 캡슐</h3>
            <AnimatedList className="gap-4">
              {opened.map((capsule) => (
                <CapsuleOpenedCard key={capsule.id} capsule={capsule} />
              ))}
            </AnimatedList>
          </section>
        )}

        <ListLoadMore
          sentinelRef={sentinelRef}
          isLoading={isFetchingNextPage}
          hasMore={hasNextPage}
        />
      </div>
      <CapsuleFab />
    </>
  );
}
