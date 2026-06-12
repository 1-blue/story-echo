import type { Metadata } from "next";
import { isAwsConfigured } from "@/lib/env/aws";
import { getWriteCapabilities } from "@/lib/get-write-capabilities";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { getTodayQuestion } from "@/lib/today-question";
import { requireMemberUser } from "@/lib/user/require-member-user";
import { CommunityWriteForm } from "./_components/community-write-form";

export const metadata: Metadata = getSharedMetadata({
  title: "토론 시작",
  description: "오늘의 질문으로 토론을 시작하세요.",
});

export default async function CommunityWritePage() {
  await requireMemberUser("/community/write");

  const [todayQuestion, capabilities] = await Promise.all([
    getTodayQuestion(),
    getWriteCapabilities(),
  ]);

  return (
    <CommunityWriteForm
      mode="create"
      todayQuestion={todayQuestion}
      photoUploadEnabled={isAwsConfigured()}
      capabilities={capabilities}
    />
  );
}
