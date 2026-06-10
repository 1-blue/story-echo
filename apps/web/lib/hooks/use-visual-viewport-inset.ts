"use client";

import { useEffect } from "react";

function updateKeyboardInset(): void {
  if (typeof window === "undefined" || !window.visualViewport) {
    return;
  }

  const viewport = window.visualViewport;
  const keyboardInset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
  document.documentElement.style.setProperty("--keyboard-inset-bottom", `${keyboardInset}px`);
}

export function useVisualViewportInset(): void {
  useEffect(() => {
    updateKeyboardInset();

    const viewport = window.visualViewport;
    if (!viewport) {
      return;
    }

    viewport.addEventListener("resize", updateKeyboardInset);
    viewport.addEventListener("scroll", updateKeyboardInset);
    window.addEventListener("orientationchange", updateKeyboardInset);

    return () => {
      viewport.removeEventListener("resize", updateKeyboardInset);
      viewport.removeEventListener("scroll", updateKeyboardInset);
      window.removeEventListener("orientationchange", updateKeyboardInset);
      document.documentElement.style.removeProperty("--keyboard-inset-bottom");
    };
  }, []);
}
