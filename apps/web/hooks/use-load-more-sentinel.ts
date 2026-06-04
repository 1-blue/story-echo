"use client";

import { useEffect, useRef, type RefObject } from "react";

type UseLoadMoreSentinelOptions = {
  enabled?: boolean;
  rootRef?: RefObject<Element | null>;
};

export function useLoadMoreSentinel(
  onLoadMore: () => void,
  { enabled = true, rootRef }: UseLoadMoreSentinelOptions = {},
) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { root: rootRef?.current ?? null, rootMargin: "120px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, onLoadMore, rootRef]);

  return sentinelRef;
}
