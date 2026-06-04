"use client";

import { Flag, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BottomSheet,
  BottomSheetContent,
} from "@/components/ui/bottom-sheet";

type PostActionSheetProps = {
  open: boolean;
  isMine: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
  isDeleting: boolean;
};

export function PostActionSheet({
  open,
  isMine,
  onClose,
  onEdit,
  onDelete,
  onReport,
  isDeleting,
}: PostActionSheetProps) {
  return (
    <BottomSheet open={open} onOpenChange={(next) => !next && onClose()}>
      <BottomSheetContent unpadded>
        <div className="flex flex-col gap-1 px-4 pb-8">
          {isMine ? (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="text-charcoal hover:bg-surface-cream/60 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors"
              >
                <Pencil className="size-5" strokeWidth={1.75} />
                수정
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="text-destructive hover:bg-surface-cream/60 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Trash2 className="size-5" strokeWidth={1.75} />
                삭제
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onReport}
              className="text-charcoal hover:bg-surface-cream/60 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors"
            >
              <Flag className="size-5" strokeWidth={1.75} />
              신고
            </button>
          )}
          <Button variant="outline" className="mt-2 w-full rounded-full" onClick={onClose}>
            취소
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
}
