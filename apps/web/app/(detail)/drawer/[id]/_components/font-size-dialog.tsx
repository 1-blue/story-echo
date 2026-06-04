"use client";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FONT_SIZE_OPTIONS, type FontSizePreference } from "../_hooks/use-font-size";

type FontSizeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fontSize: FontSizePreference;
  onFontSizeChange: (size: FontSizePreference) => void;
};

export function FontSizeDialog({
  open,
  onOpenChange,
  fontSize,
  onFontSizeChange,
}: FontSizeDialogProps) {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle>글자 크기</BottomSheetTitle>
          <BottomSheetDescription className="sr-only">
            읽기 글자 크기를 선택합니다.
          </BottomSheetDescription>
        </BottomSheetHeader>
        <div className="flex gap-1 rounded-xl bg-muted p-1">
          {FONT_SIZE_OPTIONS.map(({ value, label }) => (
            <Button
              key={value}
              type="button"
              variant={fontSize === value ? "default" : "ghost"}
              className={cn("flex-1 rounded-lg", fontSize !== value && "text-stone")}
              onClick={() => onFontSizeChange(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-stone">
          기기의 설정보다 이 앱의 설정이 우선 적용됩니다.
        </p>
      </BottomSheetContent>
    </BottomSheet>
  );
}
