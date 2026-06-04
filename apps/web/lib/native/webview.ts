declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export function isNativeWebView(): boolean {
  if (typeof window === "undefined") return false;
  return (
    Boolean(window.ReactNativeWebView) || document.documentElement.dataset.native === "1"
  );
}

export function postNativeMessage(payload: unknown): void {
  window.ReactNativeWebView?.postMessage(JSON.stringify(payload));
}
