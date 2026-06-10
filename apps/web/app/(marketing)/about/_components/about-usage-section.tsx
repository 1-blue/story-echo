"use client";

import { BookOpen, Shield } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SAFETY_POLICY_ITEMS,
  STORY_RULE_ITEMS,
  USAGE_GUIDE_ITEMS,
} from "@/lib/content/service-policies";

function PolicyList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2.5 text-sm leading-relaxed text-charcoal">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-0.5 shrink-0 text-echo">·</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function AboutUsageSection() {
  return (
    <div className="flex flex-col gap-4">
      <BlurFade delay={0.16} inView className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">이용 안내</h3>
        <Card className="border-hairline shadow-sm">
          <CardContent className="space-y-3 p-5 pt-5">
            <PolicyList items={USAGE_GUIDE_ITEMS} />
          </CardContent>
        </Card>
      </BlurFade>

      <BlurFade delay={0.18} inView className="space-y-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <BookOpen className="size-5 text-echo" strokeWidth={1.75} />
          이야기 규칙
        </h3>
        <Card className="border-hairline shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">
              질문과 Echo, 하루 한 편
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-5 pt-0">
            <PolicyList items={STORY_RULE_ITEMS} />
          </CardContent>
        </Card>
      </BlurFade>

      <BlurFade delay={0.2} inView className="space-y-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <Shield className="size-5 text-echo" strokeWidth={1.75} />
          안전·정책
        </h3>
        <Card className="border-hairline shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">
              안전하게 이야기를 나눠요
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-5 pt-0">
            <PolicyList items={SAFETY_POLICY_ITEMS} />
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  );
}
