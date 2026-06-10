"use client";

import { Trash2 } from "lucide-react";
import { BottomSheet, BottomSheetContent } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type CommentEditSheetProps = {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
  isSubmitting: boolean;
};

export function CommentEditSheet({
  open,
  value,
  onChange,
  onClose,
  onSave,
  isSubmitting,
}: CommentEditSheetProps) {
  return (
    <BottomSheet open={open} onOpenChange={(next) => !next && onClose()}>
      <BottomSheetContent>
        <h3 className="mb-4 text-lg font-semibold text-ink">댓글 수정</h3>
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mb-4 min-h-[120px] resize-none"
          placeholder="댓글을 입력하세요"
        />
        <div className="flex flex-col gap-2">
          <Button className="w-full rounded-full" onClick={onSave} disabled={isSubmitting}>
            저장
          </Button>
          <Button variant="outline" className="w-full rounded-full" onClick={onClose}>
            취소
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
}

type CommentDeleteSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
};

export function CommentDeleteSheet({
  open,
  onClose,
  onConfirm,
  isSubmitting,
}: CommentDeleteSheetProps) {
  return (
    <BottomSheet open={open} onOpenChange={(next) => !next && onClose()}>
      <BottomSheetContent>
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-surface-cream text-charcoal">
            <Trash2 className="size-6" strokeWidth={1.75} />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-ink">댓글을 삭제할까요?</h3>
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
