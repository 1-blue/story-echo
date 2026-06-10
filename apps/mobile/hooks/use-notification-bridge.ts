import { useCallback, useRef, useState, type RefObject } from "react";
import type { WebView } from "react-native-webview";
import {
  handleNotificationPermissionRequest,
  handleUnregisterPush,
  usePushNotifications,
} from "@/hooks/use-push-notifications";
import {
  parsePushBridgeMessage,
  PUSH_MESSAGE_TYPES,
  type NotificationPermissionResultMessage,
} from "@/lib/push-messages";

function injectPermissionResult(webViewRef: RefObject<WebView | null>, granted: boolean) {
  const payload: NotificationPermissionResultMessage = {
    type: PUSH_MESSAGE_TYPES.notificationPermissionResult,
    granted,
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

export function useNotificationBridge(webViewRef: RefObject<WebView | null>) {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const deviceIdRef = useRef<string | null>(null);
  const { requestPermissionAndRegister, unregisterPush } = usePushNotifications(deviceId);

  const handleBridgeMessage = useCallback(
    async (payload: unknown) => {
      const message = parsePushBridgeMessage(payload);
      if (!message) {
        return false;
      }

      switch (message.type) {
        case PUSH_MESSAGE_TYPES.deviceId:
          deviceIdRef.current = message.deviceId;
          setDeviceId(message.deviceId);
          return true;
        case PUSH_MESSAGE_TYPES.requestNotificationPermission: {
          const granted = await handleNotificationPermissionRequest(
            deviceIdRef.current,
            requestPermissionAndRegister,
          );
          injectPermissionResult(webViewRef, granted);
          return true;
        }
        case PUSH_MESSAGE_TYPES.unregisterPush:
          await handleUnregisterPush(deviceIdRef.current, unregisterPush);
          injectPushUnregistered(webViewRef);
          return true;
        default:
          return false;
      }
    },
    [requestPermissionAndRegister, unregisterPush, webViewRef],
  );

  return { deviceId, handleBridgeMessage };
}
