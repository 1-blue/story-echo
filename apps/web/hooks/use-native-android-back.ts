"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { tryCloseAndroidBackOverlays } from "@/lib/native/android-back";
import {
  getFallbackRoute,
  isShellRoot,
  normalizePath,
} from "@/lib/native/navigation-fallback";
import { postNativeMessage } from "@/lib/native/webview";

const ROOT_BACK_EXIT_MS = 2000;
const NAVIGATION_BACK_FALLBACK_MS = 100;

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
        router.back();

        window.setTimeout(() => {
          const nextPath = normalizePath(window.location.pathname);
          if (nextPath === currentPath) {
            const fallback = getFallbackRoute(currentPath);
            if (fallback) router.push(fallback);
          }
        }, NAVIGATION_BACK_FALLBACK_MS);

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
      toast("한 번 더 누르면 종료");
      postBackResult({ handled: true });
      return true;
    };

    postNativeMessage({
      type: "navigation",
      pathname: normalizePath(pathname),
      canGoBack: !isShellRoot(normalizePath(pathname)),
    });

    return () => {
      delete window.__storyechoNavigateBack;
    };
  }, [pathname, router]);
}
