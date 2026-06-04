"use client";

import { useEffect, useRef } from "react";

type UseLoadMoreSentinelOptions = {
  enabled?: boolean;
  root?: Element | null;
};

export function useLoadMoreSentinel(
  onLoadMore: () => void,
  { enabled = true, root = null }: UseLoadMoreSentinelOptions = {},
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
      { root, rootMargin: "120px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, onLoadMore, root]);

  return sentinelRef;
}
