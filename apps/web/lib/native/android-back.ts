const overlayHandlers = new Set<() => boolean>();

export function registerAndroidBackHandler(handler: () => boolean): () => void {
  overlayHandlers.add(handler);
  return () => overlayHandlers.delete(handler);
}

export function tryCloseAndroidBackOverlays(): boolean {
  for (const handler of overlayHandlers) {
    if (handler()) return true;
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
