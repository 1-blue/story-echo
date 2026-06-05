"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { tryCloseAndroidBackOverlays } from "@/lib/native/android-back";
import { isNativeWebView, postNativeMessage } from "@/lib/native/webview";

const SHELL_ROOTS = new Set(["/", "/drawer", "/community", "/capsule", "/settings"]);

const ROOT_BACK_EXIT_MS = 2000;

function normalizePath(pathname: string): string {
  if (pathname.startsWith("/app")) {
    const stripped = pathname.slice(4);
    return stripped.length === 0 ? "/" : stripped;
  }
  return pathname;
}

function isShellRoot(pathname: string): boolean {
  return SHELL_ROOTS.has(normalizePath(pathname));
}

export function useNativeAndroidBack() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isNativeWebView()) return;

    window.__storyechoNavigateBack = () => {
      if (tryCloseAndroidBackOverlays()) return true;

      if (!isShellRoot(pathname)) {
        router.back();
        return true;
      }

      const now = Date.now();
      const lastRootBack = window.__storyechoLastRootBack ?? 0;
      if (now - lastRootBack < ROOT_BACK_EXIT_MS) {
        window.__storyechoLastRootBack = undefined;
        postNativeMessage({ type: "navigation-back", allowExit: true });
        return true;
      }

      window.__storyechoLastRootBack = now;
      toast("한 번 더 누르면 종료");
      return true;
    };

    postNativeMessage({
      type: "navigation",
      canGoBack: !isShellRoot(pathname),
    });

    return () => {
      delete window.__storyechoNavigateBack;
    };
  }, [pathname, router]);
}
