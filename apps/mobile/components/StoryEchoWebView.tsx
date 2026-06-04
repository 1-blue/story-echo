import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView, type WebViewMessageEvent, type WebViewNavigation } from "react-native-webview";
import * as SplashScreen from "expo-splash-screen";
import { useAndroidWebViewBack } from "@/hooks/useAndroidWebViewBack";
import { getWebAppUrl, getWebBaseUrl } from "@/lib/get-web-url";
import { buildSafeAreaInjectScript } from "@/lib/inject-safe-area";
import Colors from "@/constants/Colors";

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
  const appUrl = getWebAppUrl();
  const baseUrl = getWebBaseUrl();

  const [refreshing, setRefreshing] = useState(false);
  const [refreshEnabled, setRefreshEnabled] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { setCanGoBack } = useAndroidWebViewBack(webViewRef);

  const injectSafeArea = useCallback(() => {
    webViewRef.current?.injectJavaScript(
      buildSafeAreaInjectScript(
        {
          top: insets.top,
          right: insets.right,
          bottom: insets.bottom,
          left: insets.left,
        },
        // Android WebView 뷰포트가 이미 시스템 네비 아래까지 채우지 않음 → 하단 이중 여백 방지
        { zeroBottom: Platform.OS === "android" },
      ),
    );
  }, [insets.bottom, insets.left, insets.right, insets.top]);

  useEffect(() => {
    injectSafeArea();
  }, [injectSafeArea]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    webViewRef.current?.injectJavaScript(`
      document.dispatchEvent(new CustomEvent('storyecho:pull-refresh'));
      true;
    `);
    webViewRef.current?.reload();
  }, []);

  const handleLoadEnd = useCallback(() => {
    setRefreshing(false);
    setLoadError(null);
    void SplashScreen.hideAsync();
    injectSafeArea();
  }, [injectSafeArea]);

  const handleNavigationStateChange = useCallback(
    (state: WebViewNavigation) => {
      setCanGoBack(state.canGoBack);
      injectSafeArea();
    },
    [setCanGoBack, injectSafeArea],
  );

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const payload: unknown = JSON.parse(event.nativeEvent.data);
      if (isScrollMessage(payload)) {
        setRefreshEnabled(payload.atTop);
      }
    } catch {
      // ignore non-JSON messages
    }
  }, []);

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
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>웹 URL이 설정되지 않았어요</Text>
        <Text style={styles.errorBody}>
          apps/mobile/.env에 EXPO_PUBLIC_WEB_URL을 설정해 주세요.{"\n"}
          예: http://192.168.0.10:3000
        </Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>페이지를 불러오지 못했어요</Text>
        <Text style={styles.errorBody}>{loadError}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => {
            setLoadError(null);
            webViewRef.current?.reload();
          }}
        >
          <Text style={styles.retryLabel}>다시 시도</Text>
        </Pressable>
      </View>
    );
  }

  const webView = (
    <WebView
      ref={webViewRef}
      source={{ uri: appUrl }}
      style={styles.webview}
      domStorageEnabled
      sharedCookiesEnabled
      thirdPartyCookiesEnabled
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      allowsBackForwardNavigationGestures
      pullToRefreshEnabled={Platform.OS === "ios"}
      startInLoadingState
      renderLoading={() => (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={Colors.light.tint} size="large" />
        </View>
      )}
      onLoadEnd={handleLoadEnd}
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
  );

  if (Platform.OS === "android") {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            enabled={refreshEnabled}
            onRefresh={handleRefresh}
            colors={[Colors.light.tint]}
          />
        }
      >
        {webView}
      </ScrollView>
    );
  }

  return <View style={styles.container}>{webView}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: Colors.light.background,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: "center",
  },
  errorBody: {
    fontSize: 14,
    color: "#6b6258",
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: Colors.light.tint,
  },
  retryLabel: {
    color: "#fff",
    fontWeight: "600",
  },
});
