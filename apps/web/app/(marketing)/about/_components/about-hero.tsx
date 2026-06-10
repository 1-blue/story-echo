"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { ABOUT_HERO_SUBTITLE } from "@/lib/content/service-policies";

export function AboutHero() {
  return (
    <BlurFade delay={0} inView className="space-y-3 text-center">
      <Badge variant="echo">이야기해줘</Badge>
      <h2 className="font-display text-3xl leading-tight font-medium">
        매일 하나의 질문,
        <br />
        나만의 이야기를 남겨요
      </h2>
      <p className="mx-auto max-w-sm text-base leading-relaxed text-muted-foreground">
        {ABOUT_HERO_SUBTITLE}
      </p>
    </BlurFade>
  );
}
