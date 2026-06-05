"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isShellRoot, normalizePath } from "@/lib/native/navigation-fallback";
import { isNativeWebView, postNativeMessage } from "@/lib/native/webview";

export function NativeWebViewBootstrap() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isNativeWebView()) return;

    document.documentElement.dataset.native = "1";

    const reportScroll = () => {
      postNativeMessage({ type: "scroll", atTop: window.scrollY <= 0 });
    };

    reportScroll();
    window.addEventListener("scroll", reportScroll, { passive: true });
    return () => window.removeEventListener("scroll", reportScroll);
  }, []);

  useEffect(() => {
    if (!isNativeWebView()) return;

    const normalizedPath = normalizePath(pathname);
    postNativeMessage({
      type: "navigation",
      pathname: normalizedPath,
      canGoBack: !isShellRoot(normalizedPath),
    });
  }, [pathname]);

  return null;
}
