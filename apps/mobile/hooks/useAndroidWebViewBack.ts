import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { BackHandler, Platform } from "react-native";
import type { WebView } from "react-native-webview";

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

function isBackResultMessage(value: unknown): value is BackResultMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "back-result"
  );
}

function isNavigationMessage(value: unknown): value is NavigationMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "navigation"
  );
}

export function useAndroidWebViewBack(webViewRef: RefObject<WebView | null>) {
  const [canGoBack, setCanGoBack] = useState(false);
  const canGoBackRef = useRef(false);

  useEffect(() => {
    canGoBackRef.current = canGoBack;
  }, [canGoBack]);

  const handleNativeMessage = useCallback(
    (payload: unknown) => {
      if (isNavigationMessage(payload)) {
        if (typeof payload.canGoBack === "boolean") {
          setCanGoBack(payload.canGoBack);
        }
        return;
      }

      if (!isBackResultMessage(payload)) return;

      if (payload.allowExit) {
        if (Platform.OS === "android") {
          BackHandler.exitApp();
        }
        return;
      }

      if (!payload.handled && canGoBackRef.current && webViewRef.current) {
        webViewRef.current.goBack();
      }
    },
    [webViewRef],
  );

  const onAndroidBackPress = useCallback(() => {
    if (!webViewRef.current) return false;

    webViewRef.current.injectJavaScript(`
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
    `);
    return true;
  }, [webViewRef]);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const subscription = BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
    return () => subscription.remove();
  }, [onAndroidBackPress]);

  return { canGoBack, setCanGoBack, handleNativeMessage };
}
