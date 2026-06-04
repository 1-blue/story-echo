"use client";

import { useMemo } from "react";
import { Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type CapsuleDialogProps = {
  unlockAt: string | null;
  isCapsule: boolean;
  onApply: (unlockAt: string | null) => void;
};

const PRESETS = [
  { label: "1개월", months: 1 },
  { label: "3개월", months: 3 },
  { label: "6개월", months: 6 },
  { label: "12개월", months: 12 },
] as const;

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function toDateInputValue(iso: string | null): string {
  if (!iso) {
    return "";
  }
  return iso.slice(0, 10);
}

function dateInputToIso(value: string): string | null {
  if (!value) {
    return null;
  }
  const date = new Date(`${value}T09:00:00.000Z`);
  return date.toISOString();
}

export function CapsuleDialog({ unlockAt, isCapsule, onApply }: CapsuleDialogProps) {
  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  }, []);

  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>
        <button
          type="button"
          className={cn(
            "group relative flex size-10 items-center justify-center rounded-full transition-colors hover:bg-capsule-soft",
            isCapsule && "bg-capsule-soft",
          )}
          title="타임캡슐 설정"
        >
          <Hourglass
            className={cn(
              "size-6 text-capsule transition-transform group-hover:scale-110",
              isCapsule && "fill-capsule/20",
            )}
          />
          {isCapsule && (
            <span className="absolute top-2 right-2 size-1.5 rounded-full border border-canvas bg-capsule" />
          )}
        </button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle>타임캡슐</BottomSheetTitle>
          <BottomSheetDescription>해제일까지 이야기를 봉인합니다.</BottomSheetDescription>
        </BottomSheetHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.months}
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => onApply(addMonths(new Date(), preset.months).toISOString())}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capsule-date">직접 날짜 선택</Label>
            <input
              id="capsule-date"
              type="date"
              min={minDate}
              defaultValue={toDateInputValue(unlockAt)}
              className="border-hairline-strong h-11 w-full rounded-xl border bg-white px-3 text-sm"
              onChange={(event) => {
                const iso = dateInputToIso(event.target.value);
                if (iso) {
                  onApply(iso);
                }
              }}
            />
          </div>
        </div>

        <BottomSheetFooter className="mt-4 gap-2 sm:justify-between">
          <Button type="button" variant="ghost" onClick={() => onApply(null)} disabled={!isCapsule}>
            캡슐 해제
          </Button>
          <BottomSheetClose asChild>
            <Button type="button">확인</Button>
          </BottomSheetClose>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}
