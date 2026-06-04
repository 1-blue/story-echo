import type { MetadataRoute } from "next";
import type { IRoute } from "./types";

/** 재귀적으로 돌아서 sitemap 항목 생성 */
export function generateSitemapFromRoutes(routes: IRoute[]): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return routes.flatMap(({ url, sitemap, subRoutes }) => [
    {
      url: `${base}${url}`,
      priority: sitemap?.priority,
      lastModified: sitemap?.lastmod,
      changeFrequency: sitemap?.changefreq,
    },
    ...(subRoutes ? generateSitemapFromRoutes(subRoutes) : []),
  ]);
}
