"use client";

import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BottomSheet,
  BottomSheetContent,
} from "@/components/ui/bottom-sheet";

type DeleteSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
};

export function DeleteSheet({ open, onClose, onConfirm, isSubmitting }: DeleteSheetProps) {
  return (
    <BottomSheet open={open} onOpenChange={(next) => !next && onClose()}>
      <BottomSheetContent>
        <div className="text-center">
          <div className="bg-surface-cream text-charcoal mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
            <Flag className="size-6" strokeWidth={1.75} />
          </div>
          <h3 className="text-ink mb-2 text-xl font-semibold">타임캡슐을 삭제할까요?</h3>
          <p className="text-slate mb-6 text-sm leading-relaxed">삭제하면 복구할 수 없어요.</p>
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
