import type { IRoute } from "./types";
import { DEFAULT_SITEMAP, ROUTES } from "./routes";

export const NAV_ROUTES: Record<"main" | "auth", IRoute[]> = {
  main: [
    {
      ...ROUTES.home,
      sitemap: { ...DEFAULT_SITEMAP, priority: 1, changefreq: "weekly" },
    },
  ],
  auth: [
    {
      ...ROUTES.login,
      sitemap: { ...DEFAULT_SITEMAP, priority: 0.7 },
    },
    {
      ...ROUTES.signup,
      sitemap: { ...DEFAULT_SITEMAP, priority: 0.7 },
    },
  ],
};
