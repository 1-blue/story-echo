import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { generateSitemapFromRoutes } from "@/lib/routes/generate-sitemap";
import { NAV_ROUTES } from "@/lib/routes/nav-routes";
import type { IRoute } from "@/lib/routes/types";

export const dynamic = "force-dynamic";

function hasValidSitemap(route: IRoute): route is IRoute & { sitemap: NonNullable<IRoute["sitemap"]> } {
  return !!route.sitemap;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const staticRoutes = [
    ...generateSitemapFromRoutes(NAV_ROUTES.main.filter(hasValidSitemap)),
    ...generateSitemapFromRoutes(NAV_ROUTES.auth.filter(hasValidSitemap)),
  ];

  try {
    const publicStories = await prisma.story.findMany({
      where: {
        visibility: "community",
        hiddenFromFeed: false,
        isCapsuleActive: false,
        questionId: { not: null },
      },
      select: { id: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const storyRoutes: MetadataRoute.Sitemap = publicStories.map((story) => ({
      url: `${base}/app/public/${story.id}`,
      lastModified: story.createdAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...storyRoutes];
  } catch (error) {
    console.error("sitemap generation failed:", error);
    return staticRoutes;
  }
}
