import { useCallback, useEffect, useState, type RefObject } from "react";
import { BackHandler, Platform } from "react-native";
import type { WebView } from "react-native-webview";

type NavigationBackMessage = {
  type: "navigation-back";
  allowExit?: boolean;
};

function isNavigationBackMessage(value: unknown): value is NavigationBackMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "navigation-back"
  );
}

export function useAndroidWebViewBack(webViewRef: RefObject<WebView | null>) {
  const [canGoBack, setCanGoBack] = useState(false);

  const handleNativeMessage = useCallback((payload: unknown) => {
    if (!isNavigationBackMessage(payload) || !payload.allowExit) return;

    if (Platform.OS === "android") {
      BackHandler.exitApp();
    }
  }, []);

  const onAndroidBackPress = useCallback(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        (function() {
          if (typeof window.__storyechoNavigateBack === "function") {
            window.__storyechoNavigateBack();
            return;
          }
          if (${canGoBack ? "true" : "false"}) {
            window.history.back();
          }
        })();
        true;
      `);
      return true;
    }
    return false;
  }, [canGoBack, webViewRef]);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const subscription = BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
    return () => subscription.remove();
  }, [onAndroidBackPress]);

  return { canGoBack, setCanGoBack, handleNativeMessage };
}
