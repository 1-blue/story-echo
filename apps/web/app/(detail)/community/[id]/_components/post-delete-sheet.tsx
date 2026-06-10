"use client";

import { Trash2 } from "lucide-react";
import { BottomSheet, BottomSheetContent } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

type PostDeleteSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
};

export function PostDeleteSheet({ open, onClose, onConfirm, isSubmitting }: PostDeleteSheetProps) {
  return (
    <BottomSheet open={open} onOpenChange={(next) => !next && onClose()}>
      <BottomSheetContent>
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-surface-cream text-charcoal">
            <Trash2 className="size-6" strokeWidth={1.75} />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-ink">토론을 삭제할까요?</h3>
          <p className="mb-6 text-sm leading-relaxed text-slate">삭제하면 복구할 수 없어요.</p>
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
