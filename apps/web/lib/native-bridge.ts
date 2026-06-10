import { getDeviceId } from "@/lib/device-id";

const NATIVE_PERMISSION_EVENT = "storyecho-notification-permission";
const NATIVE_UNREGISTER_EVENT = "storyecho-push-unregistered";

export type NativeNotificationFailureReason =
  | "permission_denied"
  | "token_failed"
  | "no_device_id";

export type NativeNotificationPermissionResult = {
  granted: boolean;
  needsSettings: boolean;
  reason?: NativeNotificationFailureReason;
  expoPushToken?: string;
  platform?: "ios" | "android";
};

export function isNativeWebView(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  return document.documentElement.dataset.native === "1";
}

function postNativeMessage(payload: Record<string, unknown>): void {
  const bridge = (
    window as Window & {
      ReactNativeWebView?: { postMessage: (message: string) => void };
    }
  ).ReactNativeWebView;

  bridge?.postMessage(JSON.stringify(payload));
}

/** WebView 앱에 localStorage deviceId를 즉시 전달 */
export function postNativeDeviceId(): void {
  if (!isNativeWebView()) {
    return;
  }
  const deviceId = getDeviceId();
  if (deviceId) {
    postNativeMessage({ type: "device-id", deviceId });
  }
}

export function requestNativeNotificationPermission(): Promise<NativeNotificationPermissionResult> {
  return new Promise((resolve) => {
    if (!isNativeWebView()) {
      resolve({ granted: false, needsSettings: false });
      return;
    }

    const timeout = window.setTimeout(() => {
      window.removeEventListener(NATIVE_PERMISSION_EVENT, onResult as EventListener);
      resolve({ granted: false, needsSettings: false });
    }, 30_000);

    function onResult(event: Event) {
      window.clearTimeout(timeout);
      window.removeEventListener(NATIVE_PERMISSION_EVENT, onResult as EventListener);
      const detail = (event as CustomEvent<NativeNotificationPermissionResult>).detail;
      resolve({
        granted: Boolean(detail?.granted),
        needsSettings: Boolean(detail?.needsSettings),
        reason: detail?.reason,
        expoPushToken: detail?.expoPushToken,
        platform: detail?.platform,
      });
    }

    window.addEventListener(NATIVE_PERMISSION_EVENT, onResult as EventListener);
    const deviceId = getDeviceId();
    postNativeMessage({
      type: "request-notification-permission",
      ...(deviceId ? { deviceId } : {}),
    });
  });
}

export function openNativeAppSettings(): void {
  if (!isNativeWebView()) {
    return;
  }
  postNativeMessage({ type: "open-app-settings" });
}

export function unregisterNativePush(): Promise<void> {
  return new Promise((resolve) => {
    if (!isNativeWebView()) {
      resolve();
      return;
    }

    const timeout = window.setTimeout(() => {
      window.removeEventListener(NATIVE_UNREGISTER_EVENT, onDone as EventListener);
      resolve();
    }, 10_000);

    function onDone() {
      window.clearTimeout(timeout);
      window.removeEventListener(NATIVE_UNREGISTER_EVENT, onDone as EventListener);
      resolve();
    }

    window.addEventListener(NATIVE_UNREGISTER_EVENT, onDone as EventListener);
    postNativeMessage({ type: "unregister-push" });
  });
}
