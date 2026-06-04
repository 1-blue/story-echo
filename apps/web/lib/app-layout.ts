/** Shell 하단 고정 UI(탭·광고)를 앱 최대 너비 안에 맞춤 — `globals.css` `--app-max-width` */
export const APP_SHELL_MAX_WIDTH_CLASS = "mx-auto w-full max-w-[var(--app-max-width)]";

export const SHELL_FIXED_CHROME_CLASS =
  "fixed left-1/2 z-40 w-full max-w-[var(--app-max-width)] -translate-x-1/2";

export const SHELL_FAB_RIGHT_CLASS =
  "fixed right-[calc((100vw-min(100vw,var(--app-max-width)))/2+1.25rem)]";
