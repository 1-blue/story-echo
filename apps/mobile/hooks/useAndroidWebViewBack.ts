import { useCallback, useEffect, useState, type RefObject } from "react";
import { BackHandler, Platform } from "react-native";
import type { WebView } from "react-native-webview";

export function useAndroidWebViewBack(webViewRef: RefObject<WebView | null>) {
  const [canGoBack, setCanGoBack] = useState(false);

  const onAndroidBackPress = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  }, [canGoBack, webViewRef]);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const subscription = BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
    return () => subscription.remove();
  }, [onAndroidBackPress]);

  return { canGoBack, setCanGoBack };
}
