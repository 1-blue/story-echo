"use client";

import { Suspense } from "react";
import { useGetApiV1StoriesIdSuspense } from "@storyecho/api-client";
import { ClientOnly } from "@/components/client-only";
import type { WriteStoryFormValues } from "@/features/stories/types";
import type { WriteCapabilities } from "@/lib/write-capabilities";
import { WriteStoryForm } from "../../_components/write-story-form";

type EditStoryFormLoaderProps = {
  storyId: string;
  photoUploadEnabled: boolean;
  capabilities: WriteCapabilities;
};

function EditStoryFormLoader({
  storyId,
  photoUploadEnabled,
  capabilities,
}: EditStoryFormLoaderProps) {
  const { data } = useGetApiV1StoriesIdSuspense(storyId);
  const story = data.data;

  const initialValues: WriteStoryFormValues = {
    bodyText: story.bodyText,
    photoUrls: story.photoUrls ?? [],
    visibility: story.visibility,
    isCapsule: story.isCapsule,
    unlockAt: null,
    questionId: story.questionId,
  };

  return (
    <WriteStoryForm
      mode="edit"
      storyId={storyId}
      initialValues={initialValues}
      questionText={story.questionText ?? "오늘의 질문"}
      photoUploadEnabled={photoUploadEnabled}
      capabilities={capabilities}
    />
  );
}

function EditStoryFallback() {
  return (
    <div className="mx-auto flex h-dvh w-full max-w-lg flex-col bg-canvas px-5 py-6">
      <div className="bg-surface-cream/60 mb-4 h-10 animate-pulse rounded" />
      <div className="bg-surface-cream/60 h-full animate-pulse rounded-2xl" />
    </div>
  );
}

type EditStoryPageClientProps = {
  storyId: string;
  photoUploadEnabled: boolean;
  capabilities: WriteCapabilities;
};

export function EditStoryPageClient({
  storyId,
  photoUploadEnabled,
  capabilities,
}: EditStoryPageClientProps) {
  return (
    <ClientOnly fallback={<EditStoryFallback />}>
      <Suspense fallback={<EditStoryFallback />}>
        <EditStoryFormLoader
          storyId={storyId}
          photoUploadEnabled={photoUploadEnabled}
          capabilities={capabilities}
        />
      </Suspense>
    </ClientOnly>
  );
}
