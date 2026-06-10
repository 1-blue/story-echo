import { useCallback, useEffect, useRef, useState } from "react";
import { Linking, Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView, type WebViewMessageEvent, type WebViewNavigation } from "react-native-webview";
import * as SplashScreen from "expo-splash-screen";
import { AppScreen, AppScreenButton } from "@/components/AppScreen";
import { BrandedLoading } from "@/components/BrandedLoading";
import Colors from "@/constants/Colors";
import { useAndroidWebViewBack } from "@/hooks/useAndroidWebViewBack";
import { useNotificationBridge } from "@/hooks/use-notification-bridge";
import { getWebAppUrl, getWebBaseUrl } from "@/lib/get-web-url";
import { buildNavigationBridgeScript } from "@/lib/inject-navigation-bridge";
import { buildSafeAreaInjectScript } from "@/lib/inject-safe-area";

type ScrollMessage = {
  type: "scroll";
  atTop: boolean;
};

function isScrollMessage(value: unknown): value is ScrollMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "scroll" &&
    "atTop" in value &&
    typeof value.atTop === "boolean"
  );
}

function shouldOpenInWebView(requestUrl: string, baseUrl: string): boolean {
  try {
    const request = new URL(requestUrl);
    const base = new URL(baseUrl);

    if (request.protocol === "about:") return true;
    if (request.protocol === "blob:") return true;

    return request.origin === base.origin;
  } catch {
    return false;
  }
}

function isExternalScheme(url: string): boolean {
  return /^(mailto:|tel:|sms:|geo:|maps:)/i.test(url);
}

export function StoryEchoWebView() {
  const webViewRef = useRef<WebView>(null);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const appUrl = getWebAppUrl();
  const baseUrl = getWebBaseUrl();

  const [loadError, setLoadError] = useState<string | null>(null);
  const { setCanGoBack, handleNativeMessage } = useAndroidWebViewBack(webViewRef);
  const { handleBridgeMessage } = useNotificationBridge(webViewRef);

  const injectSafeArea = useCallback(() => {
    webViewRef.current?.injectJavaScript(
      buildSafeAreaInjectScript({
        top: insets.top,
        right: insets.right,
        bottom: insets.bottom,
        left: insets.left,
      }),
    );
  }, [insets.bottom, insets.left, insets.right, insets.top]);

  useEffect(() => {
    injectSafeArea();
  }, [injectSafeArea]);

  const handleLoadEnd = useCallback(() => {
    setLoadError(null);
    void SplashScreen.hideAsync();
    injectSafeArea();
  }, [injectSafeArea]);

  const handleLoadProgress = useCallback(
    (event: { nativeEvent: { canGoBack: boolean } }) => {
      setCanGoBack(event.nativeEvent.canGoBack);
    },
    [setCanGoBack],
  );

  const handleNavigationStateChange = useCallback(
    (state: WebViewNavigation) => {
      setCanGoBack(state.canGoBack);
      injectSafeArea();
    },
    [setCanGoBack, injectSafeArea],
  );

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const payload: unknown = JSON.parse(event.nativeEvent.data);
        if (isScrollMessage(payload)) {
          return;
        }
        void handleBridgeMessage(payload);
        handleNativeMessage(payload);
      } catch {
        // ignore non-JSON messages
      }
    },
    [handleBridgeMessage, handleNativeMessage],
  );

  const handleShouldStartLoadWithRequest = useCallback(
    (request: { url: string }) => {
      if (!baseUrl) return false;

      const { url } = request;
      if (isExternalScheme(url)) {
        void Linking.openURL(url);
        return false;
      }

      if (shouldOpenInWebView(url, baseUrl)) {
        return true;
      }

      void Linking.openURL(url);
      return false;
    },
    [baseUrl],
  );

  if (!appUrl || !baseUrl) {
    return (
      <AppScreen
        title="웹 URL이 설정되지 않았어요"
        body={`apps/mobile/.env에 EXPO_PUBLIC_WEB_URL을 설정해 주세요.\n예: http://192.168.0.10:3000`}
      />
    );
  }

  if (loadError) {
    return (
      <AppScreen
        title="페이지를 불러오지 못했어요"
        body={loadError}
        action={
          <AppScreenButton
            label="다시 시도"
            onPress={() => {
              setLoadError(null);
              webViewRef.current?.reload();
            }}
          />
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: appUrl }}
        style={[styles.webview, { height: windowHeight }]}
        injectedJavaScriptBeforeContentLoaded={buildNavigationBridgeScript()}
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        allowsBackForwardNavigationGestures
        pullToRefreshEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <BrandedLoading message="이야기를 불러오는 중…" />
          </View>
        )}
        onLoadEnd={handleLoadEnd}
        onLoadProgress={handleLoadProgress}
        onNavigationStateChange={handleNavigationStateChange}
        onMessage={handleMessage}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onError={() => setLoadError("네트워크 연결을 확인해 주세요.")}
        onHttpError={(event) => {
          if (event.nativeEvent.statusCode >= 400) {
            setLoadError(`HTTP ${event.nativeEvent.statusCode}`);
          }
        }}
        nestedScrollEnabled={Platform.OS === "android"}
        setSupportMultipleWindows={false}
        originWhitelist={["*"]}
        allowFileAccess={Platform.OS === "android"}
        allowFileAccessFromFileURLs={Platform.OS === "android"}
        mediaCapturePermissionGrantType="grant"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  webview: {
    flex: 0,
    backgroundColor: Colors.light.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.light.background,
  },
});
