import type { Metadata } from "next";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { PostDetailPageClient } from "./_components/post-detail-page-client";

export const metadata: Metadata = getSharedMetadata({
  title: "토론",
  description: "커뮤니티 토론에 참여하고 댓글을 남기세요.",
});

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CommunityPostDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <PostDetailPageClient postId={id} />
    </div>
  );
}
