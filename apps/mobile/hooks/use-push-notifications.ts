import { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import type { NotificationPermissionFailureReason } from "@/lib/push-messages";

const PROMPTED_KEY = "@storyecho/notification_prompted";

export type NotificationPermissionOutcome = {
  granted: boolean;
  needsSettings: boolean;
  reason?: NotificationPermissionFailureReason;
  expoPushToken?: string;
  platform?: "ios" | "android";
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "기본",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

function getExpoProjectId(): string | null {
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  return typeof projectId === "string" ? projectId : null;
}

async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  const projectId = getExpoProjectId();
  if (!projectId) {
    return null;
  }

  await ensureAndroidChannel();
  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
}

export function usePushNotifications(_deviceId: string | null) {
  const requestPermissionAndRegister =
    useCallback(async (): Promise<NotificationPermissionOutcome> => {
      const existing = await Notifications.getPermissionsAsync();
      let finalStatus = existing.status;
      let canAskAgain = existing.canAskAgain ?? true;

      if (existing.status !== "granted") {
        const requested = await Notifications.requestPermissionsAsync();
        finalStatus = requested.status;
        canAskAgain = requested.canAskAgain ?? canAskAgain;
      }

      if (finalStatus !== "granted") {
        const needsSettings =
          finalStatus === "denied" && (Platform.OS === "android" || canAskAgain === false);
        return { granted: false, needsSettings, reason: "permission_denied" };
      }

      const expoPushToken = await getExpoPushToken();
      if (!expoPushToken) {
        return { granted: false, needsSettings: false, reason: "token_failed" };
      }

      const platform = Platform.OS === "ios" ? "ios" : "android";
      return { granted: true, needsSettings: false, expoPushToken, platform };
    }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(() => {
      // WebView loads home URL by default; deep link handled via notification data in future.
    });

    return () => subscription.remove();
  }, []);

  return {
    requestPermissionAndRegister,
    hasAutoPrompted: useCallback(async () => {
      const prompted = await AsyncStorage.getItem(PROMPTED_KEY);
      return prompted === "1";
    }, []),
    markAutoPrompted: useCallback(async () => {
      await AsyncStorage.setItem(PROMPTED_KEY, "1");
    }, []),
  };
}

export async function handleNotificationPermissionRequest(
  register: () => Promise<NotificationPermissionOutcome>,
): Promise<NotificationPermissionOutcome> {
  return register();
}
