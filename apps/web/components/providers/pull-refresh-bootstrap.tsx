"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetApiV1CommunityPostsQueryKey,
  getGetApiV1StoriesCapsuleQueryKey,
  getGetApiV1StoriesDrawerQueryKey,
  getGetApiV1StoriesPublicQueryKey,
  getGetApiV1UsersMeQueryKey,
} from "@storyecho/api-client";

export function PullRefreshBootstrap() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const onPullRefresh = () => {
      void queryClient.invalidateQueries({ queryKey: getGetApiV1UsersMeQueryKey() });
      void queryClient.invalidateQueries({ queryKey: getGetApiV1StoriesDrawerQueryKey() });
      void queryClient.invalidateQueries({ queryKey: getGetApiV1StoriesCapsuleQueryKey() });
      void queryClient.invalidateQueries({ queryKey: getGetApiV1CommunityPostsQueryKey() });
      void queryClient.invalidateQueries({ queryKey: getGetApiV1StoriesPublicQueryKey() });
    };

    document.addEventListener("storyecho:pull-refresh", onPullRefresh);
    return () => document.removeEventListener("storyecho:pull-refresh", onPullRefresh);
  }, [queryClient]);

  return null;
}
