"use client";

import { Suspense } from "react";
import { useGetApiV1CommunityPostsIdSuspense } from "@storyecho/api-client";
import { ClientOnly } from "@/components/client-only";
import type { WriteCapabilities } from "@/lib/write-capabilities";
import { CommunityWriteForm } from "../../_components/community-write-form";

type EditCommunityPostFormLoaderProps = {
  postId: string;
  photoUploadEnabled: boolean;
  capabilities: WriteCapabilities;
};

function EditCommunityPostFormLoader({
  postId,
  photoUploadEnabled,
  capabilities,
}: EditCommunityPostFormLoaderProps) {
  const { data } = useGetApiV1CommunityPostsIdSuspense(postId);
  const post = data.data;

  return (
    <CommunityWriteForm
      mode="edit"
      postId={postId}
      initialBodyText={post.bodyText}
      initialPhotoUrls={post.photoUrls ?? []}
      initialQuestionText={post.questionText}
      photoUploadEnabled={photoUploadEnabled}
      capabilities={capabilities}
    />
  );
}

function EditCommunityPostFallback() {
  return (
    <div className="bg-canvas flex min-h-dvh flex-col px-5 py-6">
      <div className="bg-surface-cream/60 mb-4 h-10 animate-pulse rounded" />
      <div className="bg-surface-cream/60 h-full animate-pulse rounded-2xl" />
    </div>
  );
}

type EditCommunityPostPageClientProps = {
  postId: string;
  photoUploadEnabled: boolean;
  capabilities: WriteCapabilities;
};

export function EditCommunityPostPageClient({
  postId,
  photoUploadEnabled,
  capabilities,
}: EditCommunityPostPageClientProps) {
  return (
    <ClientOnly fallback={<EditCommunityPostFallback />}>
      <Suspense fallback={<EditCommunityPostFallback />}>
        <EditCommunityPostFormLoader
          postId={postId}
          photoUploadEnabled={photoUploadEnabled}
          capabilities={capabilities}
        />
      </Suspense>
    </ClientOnly>
  );
}
