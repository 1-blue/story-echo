const SHELL_ROOTS = new Set(["/", "/drawer", "/community", "/capsule", "/settings"]);

export function normalizePath(pathname: string): string {
  if (pathname.startsWith("/app")) {
    const stripped = pathname.slice(4);
    return stripped.length === 0 ? "/" : stripped;
  }
  return pathname;
}

export function isShellRoot(pathname: string): boolean {
  return SHELL_ROOTS.has(normalizePath(pathname));
}

export function getFallbackRoute(pathname: string): string | null {
  const path = normalizePath(pathname);

  if (isShellRoot(path)) return null;
  if (path.startsWith("/drawer/")) return "/drawer";
  if (path.startsWith("/community/") && path !== "/community/write") return "/community";
  if (path === "/community/write") return "/community";
  if (path.startsWith("/capsule/") && path !== "/capsule/write") return "/capsule";
  if (path === "/capsule/write") return "/capsule";
  if (path === "/write") return "/";
  if (path.startsWith("/settings/")) return "/settings";
  if (path === "/notifications") return "/";
  if (path.startsWith("/public/")) return "/";

  return "/";
}
