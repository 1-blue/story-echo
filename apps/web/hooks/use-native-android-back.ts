"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { tryCloseAndroidBackOverlays } from "@/lib/native/android-back";
import {
  computeCanGoBack,
  getFallbackRoute,
  isShellRoot,
  normalizePath,
} from "@/lib/native/navigation-fallback";
import { postNativeMessage } from "@/lib/native/webview";

const ROOT_BACK_EXIT_MS = 2000;

function postBackResult(result: { handled: boolean; allowExit?: boolean }) {
  postNativeMessage({ type: "back-result", ...result });
}

export function useNativeAndroidBack() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined" || !window.ReactNativeWebView) return;

    window.__storyechoNavigateBack = () => {
      if (tryCloseAndroidBackOverlays()) {
        postBackResult({ handled: true });
        return true;
      }

      const currentPath = normalizePath(pathname);
      if (!isShellRoot(currentPath)) {
        const fallback = getFallbackRoute(currentPath);
        router.back();

        window.requestAnimationFrame(() => {
          const nextPath = normalizePath(window.location.pathname);
          if (nextPath === currentPath && fallback) {
            router.push(fallback);
          }
        });

        postBackResult({ handled: true });
        return true;
      }

      const now = Date.now();
      const lastRootBack = window.__storyechoLastRootBack ?? 0;
      if (now - lastRootBack < ROOT_BACK_EXIT_MS) {
        window.__storyechoLastRootBack = undefined;
        postBackResult({ handled: true, allowExit: true });
        return true;
      }

      window.__storyechoLastRootBack = now;
      postNativeMessage({ type: "root-back-hint" });
      postBackResult({ handled: true });
      return true;
    };

    postNativeMessage({
      type: "navigation",
      pathname: normalizePath(pathname),
      canGoBack: computeCanGoBack(pathname),
    });

    return () => {
      delete window.__storyechoNavigateBack;
    };
  }, [pathname, router]);
}
