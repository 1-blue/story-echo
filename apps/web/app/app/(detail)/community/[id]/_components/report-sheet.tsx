"use client";

import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BottomSheet,
  BottomSheetContent,
} from "@/components/ui/bottom-sheet";

type ReportSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
};

export function ReportSheet({ open, onClose, onConfirm, isSubmitting }: ReportSheetProps) {
  return (
    <BottomSheet open={open} onOpenChange={(next) => !next && onClose()}>
      <BottomSheetContent>
        <div className="text-center">
          <div className="bg-surface-cream text-charcoal mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
            <Flag className="size-6" strokeWidth={1.75} />
          </div>
          <h3 className="text-ink mb-2 text-xl font-semibold">이 토론을 신고할까요?</h3>
          <p className="text-slate mb-6 text-sm leading-relaxed">
            신고된 내용은 관리자 검토 후 조치됩니다.
            <br />
            건강한 커뮤니티를 위해 신중하게 결정해주세요.
          </p>
          <div className="flex flex-col gap-2">
            <Button
              className="w-full rounded-full"
              variant="destructive"
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              신고하기
            </Button>
            <Button className="w-full rounded-full" variant="outline" onClick={onClose}>
              취소
            </Button>
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
}
