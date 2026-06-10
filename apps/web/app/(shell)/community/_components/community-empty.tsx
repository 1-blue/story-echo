"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { useGetApiV1UsersMe } from "@storyecho/api-client";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";

export function CommunityEmpty() {
  const { data } = useGetApiV1UsersMe();
  const isMember = data?.data.role !== "guest";

  return (
    <BlurFade className="flex flex-col items-center py-16 text-center">
      <div className="mb-8 flex size-24 items-center justify-center rounded-full border border-hairline bg-community-soft shadow-sm">
        <Users className="size-10 text-community-green" strokeWidth={1.5} />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-ink">아직 토론이 없어요</h2>
      <p className="mb-8 max-w-xs text-sm leading-relaxed text-slate">
        오늘의 질문에 대한 생각을 나누며 첫 번째 토론을 시작해보세요.
      </p>
      {isMember ? (
        <Button asChild className="rounded-full px-8">
          <Link href="/community/write">토론 시작하기</Link>
        </Button>
      ) : (
        <Button asChild variant="outline" className="rounded-full px-8">
          <Link href="/settings/login?next=%2Fapp%2Fcommunity%2Fwrite">
            로그인하고 토론 시작하기
          </Link>
        </Button>
      )}
    </BlurFade>
  );
}
