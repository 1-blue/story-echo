import { apiFetch, type ApiClientOptions } from "./api";

export async function createPrivateStory(
  bodyText: string,
  options: ApiClientOptions & { questionId?: string | null } = {},
) {
  return apiFetch(
    "/api/v1/stories",
    {
      method: "POST",
      json: {
        bodyText,
        visibility: "private",
        photoUrls: [],
        questionId: options.questionId ?? null,
      },
    },
    options,
  );
}

export async function createCommunityStory(
  bodyText: string,
  options: ApiClientOptions & { questionId?: string | null } = {},
) {
  return apiFetch(
    "/api/v1/stories",
    {
      method: "POST",
      json: {
        bodyText,
        visibility: "community",
        photoUrls: [],
        questionId: options.questionId ?? null,
      },
    },
    options,
  );
}

export async function createCapsuleStory(
  bodyText: string,
  unlockAt: string,
  options: ApiClientOptions = {},
) {
  return apiFetch(
    "/api/v1/stories",
    {
      method: "POST",
      json: {
        bodyText,
        visibility: "private",
        photoUrls: [],
        isCapsule: true,
        unlockAt,
      },
    },
    options,
  );
}

export async function createCommunityPost(bodyText: string, options: ApiClientOptions = {}) {
  return apiFetch(
    "/api/v1/community/posts",
    {
      method: "POST",
      json: { bodyText, photoUrls: [] },
    },
    options,
  );
}

export async function postStoryComment(
  storyId: string,
  bodyText: string,
  options: ApiClientOptions & { parentId?: string | null } = {},
) {
  return apiFetch(
    `/api/v1/stories/public/${storyId}/comments`,
    {
      method: "POST",
      json: { bodyText, parentId: options.parentId ?? null },
    },
    options,
  );
}

export async function postCommunityComment(
  postId: string,
  bodyText: string,
  options: ApiClientOptions & { parentId?: string | null } = {},
) {
  return apiFetch(
    `/api/v1/community/posts/${postId}/comments`,
    {
      method: "POST",
      json: { bodyText, parentId: options.parentId ?? null },
    },
    options,
  );
}

export async function reportStory(storyId: string, options: ApiClientOptions) {
  return apiFetch(`/api/v1/stories/public/${storyId}/report`, { method: "POST", json: {} }, options);
}

export async function reportCommunityPost(postId: string, options: ApiClientOptions) {
  return apiFetch(`/api/v1/community/posts/${postId}/report`, { method: "POST", json: {} }, options);
}

export async function toggleStoryReaction(
  storyId: string,
  emoji: "heart" | "sad" | "angry" | "fire" | "clap",
  options: ApiClientOptions,
) {
  return apiFetch(
    `/api/v1/stories/public/${storyId}/reactions`,
    { method: "POST", json: { emoji } },
    options,
  );
}
