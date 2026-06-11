"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getGetApiV1UsersMeQueryKey, usePatchApiV1UsersMe } from "@storyecho/api-client";
import type { UserMe } from "@storyecho/schemas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { getErrorMessage } from "@/lib/get-error-message";
import {
  isNativeWebView,
  openNativeAppSettings,
  requestNativeNotificationPermission,
  unregisterNativePush,
} from "@/lib/native-bridge";
import { registerPushTokenFromWeb, unregisterPushTokenFromWeb } from "@/lib/register-push-token";
import { DAILY_QUESTION_REMINDER_SETTINGS_DESCRIPTION } from "@/lib/notifications/daily-reminder-schedule";
import { SettingsRow, SettingsSection } from "./settings-section";

type SettingsNotificationRowProps = {
  user: UserMe;
};

export function SettingsNotificationRow({ user }: SettingsNotificationRowProps) {
  const queryClient = useQueryClient();
  const patchUser = usePatchApiV1UsersMe();
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      if (isNativeWebView()) {
        const outcome = await requestNativeNotificationPermission();
        if (!outcome.granted) {
          if (outcome.needsSettings) {
            setSettingsDialogOpen(true);
          } else if (outcome.reason === "token_failed") {
            toast.message("푸시 알림 등록에 실패했어요. 잠시 후 다시 시도해 주세요.");
          } else {
            toast.message("알림 권한이 필요해요.");
          }
          return;
        }

        if (!outcome.expoPushToken || !outcome.platform) {
          toast.message("푸시 알림 등록에 실패했어요. 잠시 후 다시 시도해 주세요.");
          return;
        }

        try {
          await registerPushTokenFromWeb(outcome.expoPushToken, outcome.platform);
        } catch (error) {
          toast.error(getErrorMessage(error));
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
      try {
        await unregisterPushTokenFromWeb();
      } catch {
        // WebView 브리지에서 이미 시도했을 수 있음
      }
    }

    try {
      await patchUser.mutateAsync({ data: { notificationsEnabled: checked } });
      await queryClient.invalidateQueries({ queryKey: getGetApiV1UsersMeQueryKey() });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <SettingsSection title="알림">
        <SettingsRow label="알림 받기">
          <Switch
            checked={user.notificationsEnabled}
            onCheckedChange={handleToggle}
            disabled={patchUser.isPending}
          />
        </SettingsRow>
        <p className="border-t border-hairline px-4 py-3 text-left text-xs leading-relaxed text-stone">
          {DAILY_QUESTION_REMINDER_SETTINGS_DESCRIPTION}
        </p>
      </SettingsSection>

      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>알림을 켜려면 권한이 필요해요</DialogTitle>
            <DialogDescription>
              기기 설정에서 이야기해줘 알림을 허용해 주세요. 설정에서 켠 뒤 앱으로 돌아와 다시
              알림 받기를 켜 주세요.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setSettingsDialogOpen(false)}>
              나중에
            </Button>
            <Button
              type="button"
              onClick={() => {
                openNativeAppSettings();
                setSettingsDialogOpen(false);
              }}
            >
              설정 열기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
