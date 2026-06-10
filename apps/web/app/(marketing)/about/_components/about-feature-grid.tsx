"use client";

import {
  Archive,
  Clock,
  MessageCircle,
  Repeat2,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName?: string;
  iconWrapClassName?: string;
};

const FEATURES: Feature[] = [
  {
    icon: Sparkles,
    title: "오늘의 질문",
    description: "하루에 하나의 질문을 받아요. 답을 쓰지 않아도 괜찮아요.",
    iconWrapClassName: "bg-primary/10 text-primary",
  },
  {
    icon: Archive,
    title: "서랍",
    description: "나만 보는 이야기를 월별로 모아두고, 검색하고, 다시 읽어요.",
    iconWrapClassName: "bg-surface-cream text-charcoal",
  },
  {
    icon: Clock,
    title: "타임캡슐",
    description: "정해진 날까지 봉인된 이야기를 미래의 나에게 전달해요.",
    iconWrapClassName: "bg-capsule/15 text-capsule",
  },
  {
    icon: Repeat2,
    title: "Echo",
    description:
      "1년 뒤 같은 날짜에 같은 질문을 다시 받아요. 그때의 나와 지금의 나를 비교할 수 있어요.",
    iconWrapClassName: "bg-echo/15 text-echo",
  },
  {
    icon: MessageCircle,
    title: "공개 이야기",
    description: "질문에 대한 이야기를 공개하고, 다른 사람의 이야기도 읽을 수 있어요.",
    iconWrapClassName: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "커뮤니티",
    description: "질문과 연결된 토론, 멘션, 알림으로 이야기를 이어가요.",
    iconWrapClassName: "bg-surface-cream text-charcoal",
  },
];

export function AboutFeatureGrid() {
  return (
    <BlurFade delay={0.08} inView className="space-y-3">
      <h3 className="text-lg font-semibold text-ink">핵심 기능</h3>
      <div className="flex flex-col gap-3">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <BlurFade key={feature.title} delay={0.04 * index} inView>
              <Card className="border-hairline shadow-sm">
                <CardHeader className="flex-row items-start gap-3 space-y-0 pb-2">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      feature.iconWrapClassName,
                    )}
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="text-base font-semibold">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="hidden" />
              </Card>
            </BlurFade>
          );
        })}
      </div>
    </BlurFade>
  );
}
