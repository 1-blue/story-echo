"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getGetApiV1UsersMeQueryKey,
  usePostApiV1AuthLogout,
} from "@storyecho/api-client";
import { useQueryClient } from "@tanstack/react-query";
import type { UserMe } from "@storyecho/schemas";
import { Button } from "@/components/ui/button";
import { SettingsRow, SettingsSection } from "./settings-section";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { getErrorMessage } from "@/lib/get-error-message";

type SettingsAccountSectionProps = {
  user: UserMe;
};

export function SettingsAccountSection({ user }: SettingsAccountSectionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutMutation = usePostApiV1AuthLogout();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isGuest = user.role === "guest";

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      await queryClient.invalidateQueries({ queryKey: getGetApiV1UsersMeQueryKey() });
      toast.success("로그아웃했어요.");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isGuest) {
    return (
      <SettingsSection title="계정">
        <div className="space-y-3 p-4">
          <p className="text-stone text-sm leading-relaxed">
            로그인하면 다른 기기에서도 이야기를 이어갈 수 있어요.
          </p>
          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={() => router.push("/settings/login")}
          >
            로그인
          </Button>
          <Button
            className="w-full rounded-full"
            onClick={() => router.push("/settings/signup")}
          >
            회원가입
          </Button>
        </div>
      </SettingsSection>
    );
  }

  return (
    <>
      <SettingsSection title="계정">
        <SettingsRow label="이메일" value={user.email ?? ""} />
        <SettingsRow label="로그아웃" onClick={handleLogout} />
        <SettingsRow
          label="회원탈퇴"
          destructive
          onClick={() => setShowDeleteDialog(true)}
        />
      </SettingsSection>

      <DeleteAccountDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} />
    </>
  );
}
