"use client";

import { useEffect } from "react";
import { isNativeWebView, postNativeMessage } from "@/lib/native/webview";

export function NativeWebViewBootstrap() {
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

  return null;
}
