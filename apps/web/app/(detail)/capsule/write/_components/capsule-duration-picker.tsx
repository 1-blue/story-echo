"use client";

import { useMemo, useState } from "react";
import {
  CAPSULE_MONTH_PRESETS,
  CAPSULE_YEAR_PRESETS,
  addMonths,
  addYears,
  formatUnlockPreview,
} from "@/lib/capsule-utils";
import { cn } from "@/lib/utils";

type CapsuleDurationPickerProps = {
  unlockAt: string | null;
  onChange: (unlockAt: string) => void;
};

const chipClassName =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-0";

export function CapsuleDurationPicker({ unlockAt, onChange }: CapsuleDurationPickerProps) {
  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  }, []);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const applyPreset = (key: string, date: Date) => {
    setSelectedKey(key);
    onChange(date.toISOString());
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-charcoal text-lg font-semibold">언제 열까요?</h2>

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
        <label htmlFor="capsule-unlock-date" className="text-charcoal text-sm font-medium">
          직접 날짜 선택
        </label>
        <input
          id="capsule-unlock-date"
          type="date"
          min={minDate}
          className="border-hairline-strong h-11 w-full rounded-xl border bg-white px-3 text-sm"
          onChange={(event) => {
            if (!event.target.value) return;
            const date = new Date(`${event.target.value}T09:00:00.000Z`);
            setSelectedKey("custom");
            onChange(date.toISOString());
          }}
        />
      </div>

      {unlockAt && (
        <p className="text-capsule text-sm font-medium">{formatUnlockPreview(unlockAt)}</p>
      )}
    </section>
  );
}
