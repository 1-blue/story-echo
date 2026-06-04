"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  getGetApiV1StoriesDrawerQueryKey,
  getGetApiV1StoriesIdQueryKey,
  usePatchApiV1StoriesId,
  type DrawerStoryListResponse,
} from "@storyecho/api-client";

export function useToggleStoryBookmark(storyId: string) {
  const queryClient = useQueryClient();
  const mutation = usePatchApiV1StoriesId();

  const toggleBookmark = async (nextBookmarked: boolean) => {
    const drawerKey = getGetApiV1StoriesDrawerQueryKey();
    const detailKey = getGetApiV1StoriesIdQueryKey(storyId);

    await queryClient.cancelQueries({ queryKey: drawerKey });

    const previousDrawer = queryClient.getQueryData<DrawerStoryListResponse>(drawerKey);

    if (previousDrawer) {
      queryClient.setQueryData<DrawerStoryListResponse>(drawerKey, {
        ...previousDrawer,
        data: previousDrawer.data.map((story) =>
          story.id === storyId ? { ...story, isBookmarked: nextBookmarked } : story,
        ),
      });
    }

    try {
      await mutation.mutateAsync({ id: storyId, data: { isBookmarked: nextBookmarked } });
      await queryClient.invalidateQueries({ queryKey: drawerKey });
      await queryClient.invalidateQueries({ queryKey: detailKey });
    } catch (error) {
      if (previousDrawer) {
        queryClient.setQueryData(drawerKey, previousDrawer);
      }
      throw error;
    }
  };

  return {
    toggleBookmark,
    isPending: mutation.isPending,
  };
}
