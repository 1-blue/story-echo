"use client";

import { Loader2 } from "lucide-react";

type ListLoadMoreProps = {
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
  hasMore?: boolean;
};

export function ListLoadMore({ sentinelRef, isLoading, hasMore }: ListLoadMoreProps) {
  if (!hasMore && !isLoading) return null;

  return (
    <div ref={sentinelRef} className="flex justify-center py-6">
      {isLoading && (
        <Loader2 className="size-5 animate-spin text-stone" aria-label="더 불러오는 중" />
      )}
    </div>
  );
}
