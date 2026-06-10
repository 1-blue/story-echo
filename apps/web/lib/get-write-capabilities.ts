import "server-only";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { resolveCurrentUserFromHeaders } from "@/lib/user/resolve-current-user";
import type { WriteCapabilities } from "@/lib/write-capabilities";

export async function getWriteCapabilities(): Promise<WriteCapabilities> {
  if (!isDatabaseConfigured()) {
    return { canUseCommunity: false, isGuest: true };
  }

  try {
    const user = await resolveCurrentUserFromHeaders();
    return {
      canUseCommunity: user.emailVerified,
      isGuest: user.role === "guest",
    };
  } catch {
    return { canUseCommunity: false, isGuest: true };
  }
}
