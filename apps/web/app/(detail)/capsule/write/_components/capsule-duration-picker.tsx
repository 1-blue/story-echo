"use client";

import { useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import {
  addMonths,
  addYears,
  CAPSULE_MONTH_PRESETS,
  CAPSULE_YEAR_PRESETS,
  formatUnlockPreview,
} from "@/lib/capsule-utils";
import { cn } from "@/lib/utils";

type CapsuleDurationPickerProps = {
  unlockAt: string | null;
  onChange: (unlockAt: string) => void;
};

const chipClassName =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-0";

function toDateInputValue(unlockAt: string | null): string {
  if (!unlockAt) return "";
  return unlockAt.slice(0, 10);
}

function formatCustomDateLabel(dateValue: string): string {
  const [year, month, day] = dateValue.split("-").map(Number);
  if (!year || !month || !day) return "날짜를 선택해주세요";
  return new Date(year, month - 1, day).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function CapsuleDurationPicker({ unlockAt, onChange }: CapsuleDurationPickerProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  }, []);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const customDateValue = toDateInputValue(unlockAt);

  const applyPreset = (key: string, date: Date) => {
    setSelectedKey(key);
    onChange(date.toISOString());
  };

  const applyCustomDate = (dateValue: string) => {
    if (!dateValue) return;
    const date = new Date(`${dateValue}T09:00:00.000Z`);
    setSelectedKey("custom");
    onChange(date.toISOString());
  };

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
    input.click();
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-charcoal">언제 열까요?</h2>

      <div className="flex flex-wrap gap-2.5">
        {CAPSULE_MONTH_PRESETS.map((preset) => {
          const key = `m-${preset.months}`;
          const isSelected = selectedKey === key;
          return (
            <button
              key={key}
              type="button"
              className={cn(
                chipClassName,
                isSelected && "border-capsule bg-capsule-soft text-capsule hover:bg-capsule-soft",
              )}
              onClick={() => applyPreset(key, addMonths(new Date(), preset.months))}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2.5 overflow-x-auto px-0.5 pb-1">
        {CAPSULE_YEAR_PRESETS.map((preset) => {
          const key = `y-${preset.years}`;
          const isSelected = selectedKey === key;
          return (
            <button
              key={key}
              type="button"
              className={cn(
                chipClassName,
                "whitespace-nowrap",
                isSelected && "border-capsule bg-capsule-soft text-capsule hover:bg-capsule-soft",
              )}
              onClick={() => applyPreset(key, addYears(new Date(), preset.years))}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-charcoal">직접 날짜 선택</p>
        <button
          type="button"
          onClick={openDatePicker}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-xl border border-hairline bg-white px-3 text-sm transition-colors",
            "hover:bg-surface-cream/40 focus-visible:ring-2 focus-visible:ring-capsule/30 focus-visible:outline-none",
            selectedKey === "custom" && customDateValue
              ? "text-charcoal"
              : "text-stone",
          )}
        >
          <span className="flex items-center gap-2">
            <CalendarDays className="size-4 text-capsule" strokeWidth={1.75} />
            {customDateValue ? formatCustomDateLabel(customDateValue) : "날짜를 선택해주세요"}
          </span>
          <ChevronDown className="size-4 text-stone" strokeWidth={1.75} />
        </button>
        <input
          ref={dateInputRef}
          id="capsule-unlock-date"
          type="date"
          min={minDate}
          value={customDateValue}
          onChange={(event) => applyCustomDate(event.target.value)}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          tabIndex={-1}
          aria-hidden
        />
      </div>

      {unlockAt && (
        <p className="text-sm font-medium text-capsule">{formatUnlockPreview(unlockAt)}</p>
      )}
    </section>
  );
}
