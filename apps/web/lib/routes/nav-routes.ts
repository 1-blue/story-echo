import { DEFAULT_SITEMAP, ROUTES } from "./routes";
import type { IRoute } from "./types";

export const NAV_ROUTES: Record<"main" | "auth" | "marketing", IRoute[]> = {
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
  marketing: [
    {
      ...ROUTES.about,
      sitemap: { ...DEFAULT_SITEMAP, priority: 0.9, changefreq: "monthly" },
    },
    {
      ...ROUTES.questions,
      sitemap: { ...DEFAULT_SITEMAP, priority: 0.85, changefreq: "monthly" },
    },
  ],
};
