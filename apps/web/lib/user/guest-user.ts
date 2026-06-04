import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateUniqueGuestNickname } from "./generate-guest-nickname";

export async function getOrCreateGuestUser(
  deviceId: string,
  db: PrismaClient = prisma,
) {
  const existing = await db.user.findUnique({ where: { deviceId } });
  if (existing) return existing;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const nickname = await generateUniqueGuestNickname(async (value) =>
        db.user.findUnique({ where: { nickname: value } }),
      );
      return await db.user.create({
        data: {
          deviceId,
          role: "guest",
          nickname,
        },
      });
    } catch {
      const raced = await db.user.findUnique({ where: { deviceId } });
      if (raced) return raced;
    }
  }

  throw new Error("Failed to create guest user");
}
