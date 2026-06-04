"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlurFade } from "@/components/magicui/blur-fade";

export function LandingHero() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col gap-8 px-5 py-12">
      <BlurFade delay={0} className="space-y-2 text-center">
        <Badge variant="echo">StoryEcho</Badge>
        <h1 className="font-display text-3xl leading-tight font-medium">이야기해줘</h1>
        <p className="text-muted-foreground">매일 하나의 질문. 오늘의 이야기, 나중에 다시 읽기.</p>
      </BlurFade>

      <BlurFade delay={0.15}>
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl font-medium">
              오늘, 어떤 이야기가 떠오르나요?
            </CardTitle>
            <CardDescription>질문 리스트는 추후 등록됩니다.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/dev/api-test">API 테스트</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/app">앱 미리보기 (준비 중)</Link>
            </Button>
          </CardContent>
        </Card>
      </BlurFade>
    </main>
  );
}
