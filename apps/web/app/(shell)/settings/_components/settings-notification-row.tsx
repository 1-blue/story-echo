"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getGetApiV1UsersMeQueryKey, usePatchApiV1UsersMe } from "@storyecho/api-client";
import type { UserMe } from "@storyecho/schemas";
import { Switch } from "@/components/ui/switch";
import { getErrorMessage } from "@/lib/get-error-message";
import {
  isNativeWebView,
  requestNativeNotificationPermission,
  unregisterNativePush,
} from "@/lib/native-bridge";
import { SettingsRow, SettingsSection } from "./settings-section";

type SettingsNotificationRowProps = {
  user: UserMe;
};

export function SettingsNotificationRow({ user }: SettingsNotificationRowProps) {
  const queryClient = useQueryClient();
  const patchUser = usePatchApiV1UsersMe();

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      if (isNativeWebView()) {
        const granted = await requestNativeNotificationPermission();
        if (!granted) {
          toast.error("알림 권한이 필요해요. 기기 설정에서 허용해 주세요.");
          return;
        }
      } else if (
        typeof Notification !== "undefined" &&
        Notification.permission === "default"
      ) {
        await Notification.requestPermission();
      }
    } else if (isNativeWebView()) {
      await unregisterNativePush();
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
