type SafeAreaInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export function buildNativeFlagScript(): string {
  return `document.documentElement.dataset.native='1'; true;`;
}

export function buildSafeAreaInjectScript(
  insets: SafeAreaInsets,
  options?: { zeroBottom?: boolean },
): string {
  const { top, right, left } = insets;
  const bottom = options?.zeroBottom ? 0 : insets.bottom;
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
    })();
    true;
  `;
}
