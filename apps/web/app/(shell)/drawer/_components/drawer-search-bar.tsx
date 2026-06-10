"use client";

import { Search } from "lucide-react";

type DrawerSearchBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function DrawerSearchBar({ query, onQueryChange }: DrawerSearchBarProps) {
  return (
    <div className="sticky top-0 z-10 mb-6 bg-canvas/95 py-2 backdrop-blur-sm">
      <label className="relative flex items-center rounded-full border border-hairline-strong bg-white px-4 py-2.5 shadow-sm">
        <Search className="mr-2 size-[18px] shrink-0 text-stone" strokeWidth={1.75} />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="질문이나 이야기 검색"
          className="w-full border-none bg-transparent text-sm text-ink outline-none placeholder:text-stone focus:ring-0"
        />
      </label>
    </div>
  );
}
