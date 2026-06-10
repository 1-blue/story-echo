"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetApiV1StoriesDrawerQueryKey,
  getGetApiV1StoriesPublicQueryKey,
  usePostApiV1Stories,
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

export function useCreateStory(capabilities?: WriteCapabilities) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = usePostApiV1Stories();

  const createStory = async (values: WriteStoryFormValues) => {
    const payload = {
      bodyText: values.bodyText,
      photoUrls: values.photoUrls,
      visibility: values.visibility,
      isCapsule: values.isCapsule,
      unlockAt: values.isCapsule ? values.unlockAt : null,
      questionId: values.questionId ?? null,
    };

    try {
      await mutation.mutateAsync({ data: payload });
      await queryClient.invalidateQueries({ queryKey: getGetApiV1StoriesDrawerQueryKey() });
      if (payload.visibility === "community") {
        await queryClient.invalidateQueries({ queryKey: getGetApiV1StoriesPublicQueryKey() });
      }
      router.push("/drawer");
    } catch (error) {
      throw new Error(mapStoryErrorMessage(error, capabilities));
    }
  };

  return {
    createStory,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
