import type { User } from "@prisma/client";
import type { UserMe } from "@storyecho/schemas";

export function toUserMeDto(user: User): UserMe {
  return {
    id: user.id,
    role: user.role,
    email: user.email,
    nickname: user.nickname,
    fontSize: user.fontSize,
    notificationsEnabled: user.notificationsEnabled,
    adFree: user.adFree,
  };
}
