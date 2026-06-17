"use client";

import { BottomSheet, BottomSheetContent } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

type StoryDeleteSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  title: string;
  description: string;
};

export function StoryDeleteSheet({
  open,
  onClose,
  onConfirm,
  isSubmitting,
  title,
  description,
}: StoryDeleteSheetProps) {
  return (
    <BottomSheet open={open} onOpenChange={(next) => !next && onClose()}>
      <BottomSheetContent>
        <div className="text-center">
          <h3 className="mb-2 text-xl font-semibold text-ink">{title}</h3>
          <p className="mb-6 text-sm leading-relaxed text-slate">{description}</p>
          <div className="flex flex-col gap-2">
            <Button
              variant="destructive"
              className="w-full rounded-full"
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              삭제하기
            </Button>
            <Button variant="outline" className="w-full rounded-full" onClick={onClose}>
              취소
            </Button>
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
}
