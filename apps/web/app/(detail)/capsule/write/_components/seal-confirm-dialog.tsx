"use client";

import { Lock } from "lucide-react";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { formatUnlockPreview } from "@/lib/capsule-utils";

type SealConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unlockAt: string | null;
  bodyPreview: string;
  agreed: boolean;
  onAgreedChange: (agreed: boolean) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
};

function truncatePreview(text: string, maxLength = 80): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

export function SealConfirmDialog({
  open,
  onOpenChange,
  unlockAt,
  bodyPreview,
  agreed,
  onAgreedChange,
  onConfirm,
  isSubmitting,
}: SealConfirmDialogProps) {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader className="items-center text-center">
          <div className="mb-2 flex size-16 items-center justify-center rounded-full bg-capsule-soft">
            <Lock className="size-8 text-capsule" strokeWidth={1.75} />
          </div>
          <BottomSheetTitle>이 편지를 봉인할까요?</BottomSheetTitle>
          <BottomSheetDescription className="text-left leading-relaxed">
            봉인하면 <strong className="text-charcoal">수정할 수 없어요.</strong>
            <br />
            해제일까지 내용을 볼 수 없고, <strong className="text-charcoal">삭제</strong>만
            가능합니다.
          </BottomSheetDescription>
        </BottomSheetHeader>

        {unlockAt && (
          <div className="rounded-xl border border-hairline bg-surface-cream/50 p-4 text-sm">
            <p className="mb-1 text-stone">해제일</p>
            <p className="font-medium text-ink">{formatUnlockPreview(unlockAt)}</p>
            <p className="mt-3 mb-1 text-stone">편지 미리보기</p>
            <p className="font-display leading-relaxed text-ink">{truncatePreview(bodyPreview)}</p>
            <p className="mt-3 text-stone">받는 사람: 나에게</p>
          </div>
        )}

        <label className="mt-4 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => onAgreedChange(event.target.checked)}
            className="mt-0.5 size-4 rounded border-hairline-strong text-capsule"
          />
          <span className="text-sm leading-relaxed text-charcoal">
            수정이 불가능함을 이해했어요
          </span>
        </label>

        <BottomSheetFooter className="mt-4 flex-col gap-2 sm:flex-col">
          <Button
            className="w-full rounded-full bg-capsule hover:bg-capsule/90"
            disabled={!agreed || isSubmitting}
            onClick={onConfirm}
          >
            봉인하기
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={() => onOpenChange(false)}
          >
            다시 확인
          </Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}
