"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetApiV1StoriesDrawerQueryKey,
  getGetApiV1StoriesIdQueryKey,
  getGetApiV1StoriesPublicQueryKey,
  usePatchApiV1StoriesId,
} from "@storyecho/api-client";
import type { WriteStoryFormValues } from "@/features/stories/types";
import { getErrorMessage } from "@/lib/get-error-message";
import { getCommunityBlockedMessage, type WriteCapabilities } from "@/lib/write-capabilities";

function mapStoryErrorMessage(error: unknown, capabilities?: WriteCapabilities): string {
  const message = getErrorMessage(error);
  if (message.includes("이메일 인증")) {
    return capabilities
      ? getCommunityBlockedMessage(capabilities)
      : "이메일 인증 후 오늘 공개하기가 가능합니다.";
  }
  return message;
}

export function useUpdateStory(storyId: string, capabilities?: WriteCapabilities) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = usePatchApiV1StoriesId();

  const updateStory = async (values: WriteStoryFormValues) => {
    const payload = {
      bodyText: values.bodyText,
      photoUrls: values.photoUrls,
      visibility: values.visibility,
    };

    try {
      await mutation.mutateAsync({ id: storyId, data: payload });
      await queryClient.invalidateQueries({ queryKey: getGetApiV1StoriesDrawerQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getGetApiV1StoriesIdQueryKey(storyId) });
      await queryClient.invalidateQueries({ queryKey: getGetApiV1StoriesPublicQueryKey() });
      router.push(`/drawer/${storyId}`);
    } catch (error) {
      throw new Error(mapStoryErrorMessage(error, capabilities));
    }
  };

  return {
    updateStory,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
