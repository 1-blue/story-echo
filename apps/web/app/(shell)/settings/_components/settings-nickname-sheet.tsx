"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getGetApiV1UsersMeQueryKey, usePatchApiV1UsersMe } from "@storyecho/api-client";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/get-error-message";

type SettingsNicknameSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentNickname: string | null;
};

export function SettingsNicknameSheet({
  open,
  onOpenChange,
  currentNickname,
}: SettingsNicknameSheetProps) {
  const queryClient = useQueryClient();
  const patchUser = usePatchApiV1UsersMe();
  const [nickname, setNickname] = useState(currentNickname ?? "");

  const handleOpenChange = (next: boolean) => {
    if (next) setNickname(currentNickname ?? "");
    onOpenChange(next);
  };

  const handleSave = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }

    try {
      await patchUser.mutateAsync({ data: { nickname: trimmed } });
      await queryClient.invalidateQueries({ queryKey: getGetApiV1UsersMeQueryKey() });
      toast.success("닉네임을 변경했어요.");
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <BottomSheet open={open} onOpenChange={handleOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle>닉네임 변경</BottomSheetTitle>
          <BottomSheetDescription className="text-left">
            다른 사람과 겹치지 않는 이름이어야 해요.
          </BottomSheetDescription>
        </BottomSheetHeader>
        <Input
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          onFocus={(event) => {
            event.currentTarget.scrollIntoView({ block: "nearest", behavior: "smooth" });
          }}
          placeholder="닉네임"
          maxLength={30}
        />
        <BottomSheetFooter className="mt-4 gap-2 sm:flex-col">
          <Button
            className="w-full rounded-full"
            onClick={handleSave}
            disabled={patchUser.isPending}
          >
            저장
          </Button>
          <Button
            variant="ghost"
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
