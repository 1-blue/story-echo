"use client";

import { toast } from "sonner";
import {
  getGetApiV1UsersMeQueryKey,
  usePatchApiV1UsersMe,
} from "@storyecho/api-client";
import { useQueryClient } from "@tanstack/react-query";
import type { UserMe } from "@storyecho/schemas";
import { Switch } from "@/components/ui/switch";
import { SettingsRow, SettingsSection } from "./settings-section";
import { getErrorMessage } from "@/lib/get-error-message";

type SettingsNotificationRowProps = {
  user: UserMe;
};

export function SettingsNotificationRow({ user }: SettingsNotificationRowProps) {
  const queryClient = useQueryClient();
  const patchUser = usePatchApiV1UsersMe();

  const handleToggle = async (checked: boolean) => {
    if (checked && typeof Notification !== "undefined" && Notification.permission === "default") {
      await Notification.requestPermission();
    }

    try {
      await patchUser.mutateAsync({ data: { notificationsEnabled: checked } });
      await queryClient.invalidateQueries({ queryKey: getGetApiV1UsersMeQueryKey() });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <SettingsSection title="알림">
      <SettingsRow label="알림 받기">
        <Switch
          checked={user.notificationsEnabled}
          onCheckedChange={handleToggle}
          disabled={patchUser.isPending}
        />
      </SettingsRow>
    </SettingsSection>
  );
}
