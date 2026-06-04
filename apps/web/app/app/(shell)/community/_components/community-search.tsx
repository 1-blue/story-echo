"use client";

import { Search } from "lucide-react";

type CommunitySearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function CommunitySearch({ query, onQueryChange }: CommunitySearchProps) {
  return (
    <div className="bg-canvas/95 sticky top-0 z-10 py-2 backdrop-blur-sm">
      <label className="border-hairline relative flex items-center rounded-full border bg-white px-4 py-3 shadow-sm">
        <Search className="text-stone mr-2 size-[18px] shrink-0" strokeWidth={1.75} />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="주제·질문·내용 검색"
          className="text-ink placeholder:text-stone w-full border-none bg-transparent text-sm outline-none focus:ring-0"
        />
      </label>
    </div>
  );
}
