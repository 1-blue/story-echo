"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { openRoute, ROUTES, SETTINGS_INFO_ROUTES } from "@/lib/routes/routes";

const EXTERNAL_ROUTES = SETTINGS_INFO_ROUTES.filter(
  (route): route is typeof route & { external: true } => "external" in route && !!route.external,
);

export function AboutLegalFooter() {
  return (
    <BlurFade delay={0.32} inView className="flex flex-col gap-6 pb-8">
      <Button asChild variant="outline" className="w-full rounded-full">
        <Link href={ROUTES.questions.url}>365일 {ROUTES.questions.label}</Link>
      </Button>
      <Button asChild className="w-full rounded-full">
        <Link href={ROUTES.home.url}>{ROUTES.home.label} 시작하기</Link>
      </Button>

      <div className="overflow-hidden rounded-xl border border-hairline bg-white shadow-sm">
        {EXTERNAL_ROUTES.map((route) => (
          <button
            key={route.url}
            type="button"
            onClick={() => openRoute(route.url)}
            className="flex min-h-14 w-full items-center justify-between gap-3 border-b border-hairline px-4 py-3 text-left last:border-b-0"
          >
            <span className="text-sm text-charcoal">{route.label}</span>
            <ChevronRight className="size-4 text-stone" strokeWidth={1.75} />
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-stone">이야기해줘 · storyecho.app</p>
    </BlurFade>
  );
}
