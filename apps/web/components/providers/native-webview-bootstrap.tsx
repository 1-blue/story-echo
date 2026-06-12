"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { computeCanGoBack, normalizePath } from "@/lib/native/navigation-fallback";
import { isNativeWebView, postNativeMessage } from "@/lib/native/webview";

function isScrollAtTop(): boolean {
  if (window.scrollY > 0) {
    return false;
  }

  const shellScrollers = document.querySelectorAll("[data-shell-scroll]");
  for (const element of shellScrollers) {
    if (element instanceof HTMLElement && element.scrollTop > 0) {
      return false;
    }
  }

  return true;
}

export function NativeWebViewBootstrap() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isNativeWebView()) return;

    document.documentElement.dataset.native = "1";

    const reportScroll = () => {
      postNativeMessage({ type: "scroll", atTop: isScrollAtTop() });
    };

    reportScroll();
    window.addEventListener("scroll", reportScroll, { passive: true });

    const shellScrollers = document.querySelectorAll("[data-shell-scroll]");
    for (const element of shellScrollers) {
      element.addEventListener("scroll", reportScroll, { passive: true });
    }

    const observer = new MutationObserver(() => {
      reportScroll();
      const nextScrollers = document.querySelectorAll("[data-shell-scroll]");
      for (const element of nextScrollers) {
        element.removeEventListener("scroll", reportScroll);
        element.addEventListener("scroll", reportScroll, { passive: true });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", reportScroll);
      for (const element of shellScrollers) {
        element.removeEventListener("scroll", reportScroll);
      }
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    if (!isNativeWebView()) return;

    const normalizedPath = normalizePath(pathname);
    postNativeMessage({
      type: "navigation",
      pathname: normalizedPath,
      canGoBack: computeCanGoBack(pathname),
    });
  }, [pathname]);

  return null;
}
