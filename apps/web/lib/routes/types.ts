import type { MetadataRoute } from "next";

export type SitemapConfig = {
  priority?: number;
  lastmod?: string | Date;
  changefreq?: MetadataRoute.Sitemap[number]["changeFrequency"];
};

export interface IRoute {
  url: string;
  label?: string;
  sitemap?: SitemapConfig;
  subRoutes?: IRoute[];
}
