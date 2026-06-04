import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAwsConfigured } from "@/lib/env/aws";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { getTodayQuestion, getTodayStoryForUser } from "@/lib/today-question";
import { getWriteCapabilities } from "@/lib/get-write-capabilities";
import { resolveCurrentUserFromHeaders } from "@/lib/user/resolve-current-user";
import { WriteStoryForm } from "./_components/write-story-form";

export const metadata: Metadata = getSharedMetadata({
  title: "이야기하기",
  description: "오늘의 질문에 답하고 사진과 함께 이야기를 남기세요.",
});

export default async function WritePage() {
  const question = await getTodayQuestion();
  if (question.id) {
    try {
      const user = await resolveCurrentUserFromHeaders();
      const todayStoryId = await getTodayStoryForUser(user.id, question.id);
      if (todayStoryId) redirect(`/write/${todayStoryId}`);
    } catch {
      // guest without device id — stay on create flow
    }
  }

  const capabilities = await getWriteCapabilities();

  return (
    <WriteStoryForm
      mode="create"
      question={question}
      questionText={question.text}
      photoUploadEnabled={isAwsConfigured()}
      capabilities={capabilities}
    />
  );
}
