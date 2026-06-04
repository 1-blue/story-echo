import type { Metadata } from "next";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { StoryDetailPageClient } from "./_components/story-detail-page-client";

export const metadata: Metadata = getSharedMetadata({
  title: "이야기",
  description: "저장된 이야기를 읽고 북마크하세요.",
});

type StoryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { id } = await params;
  return <StoryDetailPageClient storyId={id} />;
}
