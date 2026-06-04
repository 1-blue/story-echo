"use client";

import { cn } from "@/lib/utils";
import type { DrawerListFilter } from "../_hooks/use-drawer-filters";

type DrawerListFilterTabsProps = {
  value: DrawerListFilter;
  onChange: (value: DrawerListFilter) => void;
};

const options: { value: DrawerListFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "bookmarked", label: "북마크" },
];

export function DrawerListFilterTabs({ value, onChange }: DrawerListFilterTabsProps) {
  return (
    <div className="mb-4 flex items-center rounded-full border border-hairline bg-surface-cream/50 p-1">
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 rounded-full px-4 py-1.5 text-xs transition-all",
              active
                ? "bg-primary font-semibold text-white shadow-sm"
                : "font-normal text-slate hover:text-charcoal",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
