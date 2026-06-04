"use client";

import { useEffect } from "react";
import { usePostApiV1UsersGuest } from "@storyecho/api-client";
import { getOrCreateDeviceId } from "@/lib/device-id";

export function DeviceIdBootstrap() {
  const guestMutation = usePostApiV1UsersGuest();

  useEffect(() => {
    const deviceId = getOrCreateDeviceId();
    void guestMutation.mutate({ data: { deviceId } });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  return null;
}
