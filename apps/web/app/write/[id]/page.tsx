import type { Metadata } from "next";
import { isAwsConfigured } from "@/lib/env/aws";
import { getWriteCapabilities } from "@/lib/get-write-capabilities";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { EditStoryPageClient } from "./_components/edit-story-page-client";

export const metadata: Metadata = getSharedMetadata({
  title: "이야기 수정",
  description: "저장된 이야기를 수정하세요.",
});

type EditStoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditStoryPage({ params }: EditStoryPageProps) {
  const { id } = await params;
  const capabilities = await getWriteCapabilities();

  return (
    <EditStoryPageClient
      storyId={id}
      photoUploadEnabled={isAwsConfigured()}
      capabilities={capabilities}
    />
  );
}
