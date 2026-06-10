"use client";

import { AboutFaqSection } from "./about-faq-section";
import { AboutFeatureGrid } from "./about-feature-grid";
import { AboutHeader } from "./about-header";
import { AboutHero } from "./about-hero";
import { AboutLegalFooter } from "./about-legal-footer";
import { AboutUsageSection } from "./about-usage-section";

export function AboutPageClient() {
  return (
    <div className="flex min-h-dvh flex-col">
      <AboutHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-5 py-8">
        <AboutHero />
        <AboutFeatureGrid />
        <AboutUsageSection />
        <AboutFaqSection />
        <AboutLegalFooter />
      </main>
    </div>
  );
}
