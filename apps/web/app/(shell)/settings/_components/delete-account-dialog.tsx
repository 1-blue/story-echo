"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getGetApiV1UsersMeQueryKey, useDeleteApiV1UsersMe } from "@storyecho/api-client";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/get-error-message";

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteApiV1UsersMe();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync();
      await queryClient.invalidateQueries({ queryKey: getGetApiV1UsersMeQueryKey() });
      toast.success("회원탈퇴가 완료되었어요.");
      onOpenChange(false);
      router.push("/settings");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle>정말 탈퇴할까요?</BottomSheetTitle>
          <BottomSheetDescription className="text-left leading-relaxed">
            탈퇴하면 모든 이야기와 설정이 삭제되며 되돌릴 수 없어요.
          </BottomSheetDescription>
        </BottomSheetHeader>
        <BottomSheetFooter className="flex-col gap-2 sm:flex-col">
          <Button
            variant="destructive"
            className="w-full rounded-full"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            탈퇴하기
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}
