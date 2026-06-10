import { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {
  registerPushToken,
  setNotificationsEnabled,
  unregisterPushToken,
} from "@/lib/push-api";

const PROMPTED_KEY = "@storyecho/notification_prompted";

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

export function usePushNotifications(deviceId: string | null) {
  const deviceIdRef = useRef(deviceId);
  deviceIdRef.current = deviceId;

  const registerTokenForDevice = useCallback(async (): Promise<boolean> => {
    const currentDeviceId = deviceIdRef.current;
    if (!currentDeviceId) {
      return false;
    }

    const token = await getExpoPushToken();
    if (!token) {
      return false;
    }

    const platform = Platform.OS === "ios" ? "ios" : "android";
    await registerPushToken(currentDeviceId, token, platform);
    return true;
  }, []);

  const requestPermissionAndRegister = useCallback(async (): Promise<boolean> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return false;
    }

    return registerTokenForDevice();
  }, [registerTokenForDevice]);

  useEffect(() => {
    if (!deviceId) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const prompted = await AsyncStorage.getItem(PROMPTED_KEY);
      if (prompted || cancelled) {
        return;
      }

      await AsyncStorage.setItem(PROMPTED_KEY, "1");
      const granted = await requestPermissionAndRegister();
      if (granted && !cancelled) {
        await setNotificationsEnabled(deviceId, true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [deviceId, requestPermissionAndRegister]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(() => {
      // WebView loads home URL by default; deep link handled via notification data in future.
    });

    return () => subscription.remove();
  }, []);

  return {
    requestPermissionAndRegister,
    unregisterPush: useCallback(async () => {
      const currentDeviceId = deviceIdRef.current;
      if (!currentDeviceId) {
        return;
      }
      await unregisterPushToken(currentDeviceId);
    }, []),
  };
}

export async function handleNotificationPermissionRequest(
  deviceId: string | null,
  register: () => Promise<boolean>,
): Promise<boolean> {
  if (!deviceId) {
    return false;
  }

  const granted = await register();
  return granted;
}

export async function handleUnregisterPush(
  deviceId: string | null,
  unregister: () => Promise<void>,
): Promise<void> {
  if (!deviceId) {
    return;
  }
  await unregister();
}
