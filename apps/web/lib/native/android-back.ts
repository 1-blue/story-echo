"use client";

import { useEffect } from "react";

const overlayHandlers: Array<() => boolean> = [];

export function registerAndroidBackHandler(handler: () => boolean): () => void {
  overlayHandlers.push(handler);
  return () => {
    const index = overlayHandlers.lastIndexOf(handler);
    if (index >= 0) overlayHandlers.splice(index, 1);
  };
}

export function tryCloseAndroidBackOverlays(): boolean {
  for (let index = overlayHandlers.length - 1; index >= 0; index -= 1) {
    if (overlayHandlers[index]()) return true;
  }

  const openDialog = document.querySelector('[data-state="open"][role="dialog"]');
  if (openDialog) {
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        bubbles: true,
      }),
    );
    return true;
  }

  return false;
}

export function useAndroidBackOverlay(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;

    return registerAndroidBackHandler(() => {
      onClose();
      return true;
    });
  }, [open, onClose]);
}
