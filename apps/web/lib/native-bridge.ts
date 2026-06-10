const NATIVE_PERMISSION_EVENT = "storyecho-notification-permission";
const NATIVE_UNREGISTER_EVENT = "storyecho-push-unregistered";

export type NativeNotificationPermissionResult = {
  granted: boolean;
  needsSettings: boolean;
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
      });
    }

    window.addEventListener(NATIVE_PERMISSION_EVENT, onResult as EventListener);
    postNativeMessage({ type: "request-notification-permission" });
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
