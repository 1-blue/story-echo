const NATIVE_PERMISSION_EVENT = "storyecho-notification-permission";
const NATIVE_UNREGISTER_EVENT = "storyecho-push-unregistered";

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

export function requestNativeNotificationPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isNativeWebView()) {
      resolve(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      window.removeEventListener(NATIVE_PERMISSION_EVENT, onResult as EventListener);
      resolve(false);
    }, 30_000);

    function onResult(event: Event) {
      window.clearTimeout(timeout);
      window.removeEventListener(NATIVE_PERMISSION_EVENT, onResult as EventListener);
      const detail = (event as CustomEvent<{ granted?: boolean }>).detail;
      resolve(Boolean(detail?.granted));
    }

    window.addEventListener(NATIVE_PERMISSION_EVENT, onResult as EventListener);
    postNativeMessage({ type: "request-notification-permission" });
  });
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
