import { syncExpiredCapsules } from "@/lib/capsule-utils";
import { createNotification } from "@/lib/notifications/create";
import { getKstDayRangeUtc, isUnlockDateKstToday } from "@/lib/notifications/kst";
import { prisma } from "@/lib/prisma";

export type DispatchDailyResult = {
  dailyReminders: number;
  capsuleUnlocked: number;
};

export async function dispatchDailyNotifications(now = new Date()): Promise<DispatchDailyResult> {
  const { start, end } = getKstDayRangeUtc(now);
  let dailyReminders = 0;
  let capsuleUnlocked = 0;

  const members = await prisma.user.findMany({
    where: { notificationsEnabled: true, role: { in: ["member", "admin"] } },
    select: { id: true },
  });

  for (const member of members) {
    const alreadySent = await prisma.notification.findFirst({
      where: {
        recipientUserId: member.id,
        type: "daily_question_reminder",
        createdAt: { gte: start, lt: end },
      },
    });
    if (alreadySent) continue;

    await createNotification({
      recipientUserId: member.id,
      type: "daily_question_reminder",
    });
    dailyReminders += 1;
  }

  const capsuleStories = await prisma.story.findMany({
    where: {
      isCapsule: true,
      unlockAt: { not: null },
    },
    select: {
      id: true,
      userId: true,
      unlockAt: true,
      isCapsuleActive: true,
    },
  });

  for (const story of capsuleStories) {
    if (!story.unlockAt || !isUnlockDateKstToday(story.unlockAt, now)) {
      continue;
    }

    if (story.isCapsuleActive) {
      await syncExpiredCapsules(story.userId);
    }

    const existing = await prisma.notification.findFirst({
      where: {
        recipientUserId: story.userId,
        type: "capsule_unlocked",
        storyId: story.id,
      },
    });
    if (existing) continue;

    await createNotification({
      recipientUserId: story.userId,
      type: "capsule_unlocked",
      storyId: story.id,
    });
    capsuleUnlocked += 1;
  }

  return { dailyReminders, capsuleUnlocked };
}
