import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { BrandedLoading } from "@/components/BrandedLoading";
import { MobileProviders } from "@/components/MobileProviders";
import { RootErrorBoundary } from "@/components/RootErrorBoundary";
import "react-native-reanimated";

export { RootErrorBoundary as ErrorBoundary };

SplashScreen.preventAutoHideAsync();

const SPLASH_FALLBACK_MS = 15_000;

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const fallback = setTimeout(() => {
      void SplashScreen.hideAsync();
    }, SPLASH_FALLBACK_MS);
    return () => clearTimeout(fallback);
  }, []);

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <BrandedLoading message="앱을 준비하는 중…" />;
  }

  return (
    <SafeAreaProvider>
      <MobileProviders>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </MobileProviders>
    </SafeAreaProvider>
  );
}
