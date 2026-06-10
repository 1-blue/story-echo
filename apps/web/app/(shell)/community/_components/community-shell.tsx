"use client";

import { useState } from "react";
import { useDebouncedValue } from "../_hooks/use-debounced-value";
import { CommunityFab } from "./community-fab";
import { CommunityPostList } from "./community-post-list";
import { CommunitySearch } from "./community-search";

export function CommunityShell() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-[calc(var(--shell-tab-height)+var(--ad-strip-height)+2rem+var(--safe-area-bottom))]" data-shell-scroll>
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-ink">커뮤니티</h2>
          <p className="text-base text-slate">오늘의 질문에 대한 생각을 나눠보세요</p>
        </div>

        <CommunitySearch query={query} onQueryChange={setQuery} />

        <CommunityPostList query={query} debouncedQuery={debouncedQuery} />
      </div>
      <CommunityFab />
    </>
  );
}
