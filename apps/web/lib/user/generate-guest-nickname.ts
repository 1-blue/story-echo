import type { User } from "@prisma/client";

export function generateGuestNicknameSuffix(): string {
  return String(Math.floor(10000 + Math.random() * 900000));
}

export async function generateUniqueGuestNickname(
  findByNickname: (nickname: string) => Promise<User | null>,
): Promise<string> {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const nickname = `게스트${generateGuestNicknameSuffix()}`;
    const existing = await findByNickname(nickname);
    if (!existing) return nickname;
  }
  throw new Error("Failed to generate unique guest nickname");
}
