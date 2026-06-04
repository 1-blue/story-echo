import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAwsConfigured } from "@/lib/env/aws";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { getWriteCapabilities } from "@/lib/get-write-capabilities";
import { requireMemberUser } from "@/lib/user/require-member-user";
import { EditCommunityPostPageClient } from "./_components/edit-community-post-page-client";

export const metadata: Metadata = getSharedMetadata({
  title: "토론 수정",
  description: "작성한 토론 글을 수정하세요.",
});

type EditCommunityPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCommunityPostPage({ params }: EditCommunityPostPageProps) {
  const { id } = await params;
  const user = await requireMemberUser(`/community/write/${id}`);

  if (isDatabaseConfigured()) {
    const post = await prisma.communityPost.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!post || post.userId !== user.id) {
      notFound();
    }
  }

  const capabilities = await getWriteCapabilities();

  return (
    <EditCommunityPostPageClient
      postId={id}
      photoUploadEnabled={isAwsConfigured()}
      capabilities={capabilities}
    />
  );
}
