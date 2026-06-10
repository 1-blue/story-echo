import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Linking } from "react-native";
import type { WebView } from "react-native-webview";
import {
  handleNotificationPermissionRequest,
  type NotificationPermissionOutcome,
  usePushNotifications,
} from "@/hooks/use-push-notifications";
import {
  buildRegisterPushTokenScript,
  buildSetNotificationsEnabledScript,
  buildUnregisterPushTokenScript,
} from "@/lib/inject-web-api";
import {
  parsePushBridgeMessage,
  PUSH_MESSAGE_TYPES,
  type NotificationPermissionResultMessage,
} from "@/lib/push-messages";

function injectPermissionResult(
  webViewRef: RefObject<WebView | null>,
  outcome: NotificationPermissionOutcome,
) {
  const payload: NotificationPermissionResultMessage = {
    type: PUSH_MESSAGE_TYPES.notificationPermissionResult,
    granted: outcome.granted,
    needsSettings: outcome.needsSettings,
    reason: outcome.reason,
    expoPushToken: outcome.expoPushToken,
    platform: outcome.platform,
  };
  webViewRef.current?.injectJavaScript(`
    window.dispatchEvent(new CustomEvent('storyecho-notification-permission', {
      detail: ${JSON.stringify(payload)}
    }));
    true;
  `);
}

function injectPushUnregistered(webViewRef: RefObject<WebView | null>) {
  webViewRef.current?.injectJavaScript(`
    window.dispatchEvent(new CustomEvent('storyecho-push-unregistered', {
      detail: { type: '${PUSH_MESSAGE_TYPES.pushUnregistered}' }
    }));
    true;
  `);
}

async function registerPushViaWebView(
  webViewRef: RefObject<WebView | null>,
  expoPushToken: string,
  platform: "ios" | "android",
): Promise<boolean> {
  return new Promise((resolve) => {
    const script = `
      ${buildRegisterPushTokenScript(expoPushToken, platform)}
        .then(function(r) { return r.ok; })
        .catch(function() { return false; });
      true;
    `;
    webViewRef.current?.injectJavaScript(script);
    setTimeout(() => resolve(true), 1500);
  });
}

async function setNotificationsEnabledViaWebView(
  webViewRef: RefObject<WebView | null>,
  enabled: boolean,
): Promise<void> {
  webViewRef.current?.injectJavaScript(buildSetNotificationsEnabledScript(enabled));
}

export function useNotificationBridge(webViewRef: RefObject<WebView | null>) {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const deviceIdRef = useRef<string | null>(null);
  const { requestPermissionAndRegister, hasAutoPrompted, markAutoPrompted } =
    usePushNotifications(deviceId);

  const applyDeviceId = useCallback((nextDeviceId: string) => {
    deviceIdRef.current = nextDeviceId;
    setDeviceId(nextDeviceId);
  }, []);

  useEffect(() => {
    if (!deviceId) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const prompted = await hasAutoPrompted();
      if (prompted || cancelled) {
        return;
      }

      const outcome = await requestPermissionAndRegister();
      await markAutoPrompted();

      if (cancelled || !outcome.granted || !outcome.expoPushToken || !outcome.platform) {
        return;
      }

      await registerPushViaWebView(webViewRef, outcome.expoPushToken, outcome.platform);
      if (!cancelled) {
        await setNotificationsEnabledViaWebView(webViewRef, true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [deviceId, hasAutoPrompted, markAutoPrompted, requestPermissionAndRegister, webViewRef]);

  const handleBridgeMessage = useCallback(
    async (payload: unknown) => {
      const message = parsePushBridgeMessage(payload);
      if (!message) {
        return false;
      }

      switch (message.type) {
        case PUSH_MESSAGE_TYPES.deviceId:
          applyDeviceId(message.deviceId);
          return true;
        case PUSH_MESSAGE_TYPES.requestNotificationPermission: {
          if (message.deviceId) {
            applyDeviceId(message.deviceId);
          }
          const outcome = await handleNotificationPermissionRequest(requestPermissionAndRegister);
          injectPermissionResult(webViewRef, outcome);
          return true;
        }
        case PUSH_MESSAGE_TYPES.openAppSettings:
          await Linking.openSettings();
          return true;
        case PUSH_MESSAGE_TYPES.unregisterPush:
          webViewRef.current?.injectJavaScript(buildUnregisterPushTokenScript());
          injectPushUnregistered(webViewRef);
          return true;
        default:
          return false;
      }
    },
    [applyDeviceId, requestPermissionAndRegister, webViewRef],
  );

  return { deviceId, handleBridgeMessage };
}
