import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { BackHandler, Platform, ToastAndroid } from "react-native";
import type { WebView } from "react-native-webview";

const ROOT_BACK_EXIT_MS = 2000;
const ROOT_BACK_HINT = "한 번 더 누르면 종료";

const RETRY_NAVIGATE_BACK_SCRIPT = `
  (function() {
    if (typeof window.__storyechoNavigateBack === "function") {
      window.__storyechoNavigateBack();
      return;
    }
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "back-result", handled: false }));
    }
  })();
  true;
`;

type BackResultMessage = {
  type: "back-result";
  handled?: boolean;
  allowExit?: boolean;
};

type NavigationMessage = {
  type: "navigation";
  pathname?: string;
  canGoBack?: boolean;
};

type RootBackHintMessage = {
  type: "root-back-hint";
};

function isBackResultMessage(value: unknown): value is BackResultMessage {
  return (
    typeof value === "object" && value !== null && "type" in value && value.type === "back-result"
  );
}

function isNavigationMessage(value: unknown): value is NavigationMessage {
  return (
    typeof value === "object" && value !== null && "type" in value && value.type === "navigation"
  );
}

function isRootBackHintMessage(value: unknown): value is RootBackHintMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "root-back-hint"
  );
}

function showRootBackHint() {
  if (Platform.OS === "android") {
    ToastAndroid.show(ROOT_BACK_HINT, ToastAndroid.SHORT);
  }
}

export function useAndroidWebViewBack(webViewRef: RefObject<WebView | null>) {
  const [canGoBack, setCanGoBack] = useState(false);
  const canGoBackRef = useRef(false);
  const lastRootBackAtRef = useRef(0);
  const retryBackRef = useRef(false);

  useEffect(() => {
    canGoBackRef.current = canGoBack;
  }, [canGoBack]);

  const tryNativeRootExit = useCallback((): boolean => {
    const now = Date.now();
    if (now - lastRootBackAtRef.current < ROOT_BACK_EXIT_MS) {
      lastRootBackAtRef.current = 0;
      BackHandler.exitApp();
      return true;
    }

    lastRootBackAtRef.current = now;
    showRootBackHint();
    return true;
  }, []);

  const handleNativeMessage = useCallback(
    (payload: unknown) => {
      if (isNavigationMessage(payload)) {
        if (typeof payload.canGoBack === "boolean") {
          setCanGoBack(payload.canGoBack);
        }
        return;
      }

      if (isRootBackHintMessage(payload)) {
        showRootBackHint();
        return;
      }

      if (!isBackResultMessage(payload)) return;

      if (payload.allowExit) {
        lastRootBackAtRef.current = 0;
        retryBackRef.current = false;
        if (Platform.OS === "android") {
          BackHandler.exitApp();
        }
        return;
      }

      if (payload.handled) {
        retryBackRef.current = false;
        return;
      }

      if (canGoBackRef.current && webViewRef.current && !retryBackRef.current) {
        retryBackRef.current = true;
        webViewRef.current.injectJavaScript(RETRY_NAVIGATE_BACK_SCRIPT);
        return;
      }

      retryBackRef.current = false;
      tryNativeRootExit();
    },
    [tryNativeRootExit, webViewRef],
  );

  const onAndroidBackPress = useCallback(() => {
    if (!webViewRef.current) return false;

    retryBackRef.current = false;
    webViewRef.current.injectJavaScript(RETRY_NAVIGATE_BACK_SCRIPT);
    return true;
  }, [webViewRef]);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const subscription = BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
    return () => subscription.remove();
  }, [onAndroidBackPress]);

  return { canGoBack, setCanGoBack, handleNativeMessage };
}
