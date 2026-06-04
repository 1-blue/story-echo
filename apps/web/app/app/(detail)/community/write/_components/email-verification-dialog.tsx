import { Mail } from "lucide-react";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

type EmailVerificationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EmailVerificationDialog({ open, onOpenChange }: EmailVerificationDialogProps) {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader className="items-center text-center">
          <div className="bg-destructive/10 text-destructive mb-2 flex size-16 items-center justify-center rounded-full">
            <Mail className="size-8" strokeWidth={1.75} />
          </div>
          <BottomSheetTitle>이메일 인증이 필요해요</BottomSheetTitle>
          <BottomSheetDescription>
            커뮤니티에 글을 남기려면 먼저 이메일 인증을 완료해주세요. 안전하고 따뜻한 커뮤니티를
            만들기 위한 과정입니다.
          </BottomSheetDescription>
        </BottomSheetHeader>
        <BottomSheetFooter className="flex-col gap-2 sm:flex-col">
          <Button className="w-full rounded-full" onClick={() => onOpenChange(false)}>
            나중에 하기
          </Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}
