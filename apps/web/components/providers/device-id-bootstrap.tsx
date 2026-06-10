"use client";

import { useEffect } from "react";
import { usePostApiV1UsersGuest } from "@storyecho/api-client";
import { getOrCreateDeviceId } from "@/lib/device-id";
import { postNativeDeviceId } from "@/lib/native-bridge";

export function DeviceIdBootstrap() {
  const guestMutation = usePostApiV1UsersGuest();

  useEffect(() => {
    const deviceId = getOrCreateDeviceId();
    postNativeDeviceId();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("storyecho-device-id-ready"));
      (
        window as Window & { __storyechoPostDeviceId?: () => void }
      ).__storyechoPostDeviceId?.();
    }
    void guestMutation.mutate({ data: { deviceId } });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  return null;
}
