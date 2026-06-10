import type { Metadata } from "next";
import { ABOUT_METADATA_DESCRIPTION } from "@/lib/content/service-policies";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { AboutPageClient } from "./_components/about-page-client";

export const metadata: Metadata = getSharedMetadata({
  title: "서비스 소개",
  description: ABOUT_METADATA_DESCRIPTION,
  robots: { index: true, follow: true },
});

export default function AboutPage() {
  return <AboutPageClient />;
}
