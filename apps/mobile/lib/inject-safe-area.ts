import { Platform } from "react-native";

type SafeAreaInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const ANDROID_NAV_FALLBACK_PX = 48;

export function buildNativeFlagScript(): string {
  return `document.documentElement.dataset.native='1'; true;`;
}

function resolveBottomInset(bottom: number): { bottom: number; navFallback: number } {
  if (Platform.OS !== "android" || bottom > 0) {
    return { bottom, navFallback: 0 };
  }

  return { bottom, navFallback: ANDROID_NAV_FALLBACK_PX };
}

export function buildSafeAreaInjectScript(insets: SafeAreaInsets): string {
  const { top, right, left } = insets;
  const { bottom, navFallback } = resolveBottomInset(insets.bottom);
  return `
    (function() {
      var root = document.documentElement;
      root.dataset.native = '1';
      root.style.setProperty('--safe-area-inset-top', '${top}px');
      root.style.setProperty('--safe-area-inset-right', '${right}px');
      root.style.setProperty('--safe-area-inset-bottom', '${bottom}px');
      root.style.setProperty('--safe-area-inset-left', '${left}px');
      root.style.setProperty('--safe-area-top', '${top}px');
      root.style.setProperty('--safe-area-right', '${right}px');
      root.style.setProperty('--safe-area-bottom', '${bottom}px');
      root.style.setProperty('--safe-area-left', '${left}px');
      root.style.setProperty('--native-nav-fallback', '${navFallback}px');
    })();
    true;
  `;
}
