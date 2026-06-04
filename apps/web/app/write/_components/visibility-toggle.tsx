"use client";

import { toast } from "sonner";
import type { CreateStoryRequest } from "@storyecho/schemas";
import { cn } from "@/lib/utils";
import { getCommunityBlockedMessage, type WriteCapabilities } from "@/lib/write-capabilities";

type Visibility = CreateStoryRequest["visibility"];

type VisibilityToggleProps = {
  value: Visibility;
  onChange: (value: Visibility) => void;
  capabilities: WriteCapabilities;
};

const options: { value: Visibility; label: string }[] = [
  { value: "private", label: "나만 보기" },
  { value: "community", label: "오늘 공개하기" },
];

export function VisibilityToggle({ value, onChange, capabilities }: VisibilityToggleProps) {
  const handleSelect = (option: Visibility) => {
    if (option === "community" && !capabilities.canUseCommunity) {
      toast(getCommunityBlockedMessage(capabilities));
      return;
    }
    onChange(option);
  };

  return (
    <div className="flex items-center rounded-full border border-hairline bg-surface-cream/50 p-1">
      {options.map((option) => {
        const active = value === option.value;
        const isCommunityBlocked = option.value === "community" && !capabilities.canUseCommunity;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs transition-all",
              active
                ? "bg-primary font-semibold text-white shadow-sm"
                : "font-normal text-slate hover:text-charcoal",
              isCommunityBlocked && !active && "cursor-not-allowed opacity-50",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
