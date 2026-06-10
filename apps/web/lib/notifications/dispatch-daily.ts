import { syncExpiredCapsules } from "@/lib/capsule-utils";
import { createNotification } from "@/lib/notifications/create";
import { getKstDayRangeUtc, isUnlockDateKstToday } from "@/lib/notifications/kst";
import {
  type ExpoPushMessage,
  sendExpoPushNotifications,
} from "@/lib/notifications/send-expo-push";
import { prisma } from "@/lib/prisma";
import { getTodayQuestion } from "@/lib/today-question";

export type DispatchDailyOptions = {
  now?: Date;
  force?: boolean;
};

export type DispatchDailyResult = {
  dailyReminders: number;
  capsuleUnlocked: number;
  pushSent: number;
  pushFailed: number;
};

export async function dispatchDailyNotifications(
  options: DispatchDailyOptions = {},
): Promise<DispatchDailyResult> {
  const now = options.now ?? new Date();
  const force = options.force ?? false;
  const { start, end } = getKstDayRangeUtc(now);
  let dailyReminders = 0;
  let capsuleUnlocked = 0;
  let pushSent = 0;
  let pushFailed = 0;

  const todayQuestion = await getTodayQuestion();
  const pushBody =
    todayQuestion.text.trim().length > 0
      ? todayQuestion.text
      : "오늘의 질문이 도착했어요. 이야기를 남겨 보세요";

  const recipients = await prisma.user.findMany({
    where: { notificationsEnabled: true },
    select: {
      id: true,
      pushTokens: {
        select: { expoPushToken: true },
        take: 1,
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  const pushMessages: ExpoPushMessage[] = [];

  for (const recipient of recipients) {
    if (!force) {
      const alreadySent = await prisma.notification.findFirst({
        where: {
          recipientUserId: recipient.id,
          type: "daily_question_reminder",
          createdAt: { gte: start, lt: end },
        },
      });
      if (alreadySent) continue;
    }

    await createNotification({
      recipientUserId: recipient.id,
      type: "daily_question_reminder",
    });
    dailyReminders += 1;

    const token = recipient.pushTokens[0]?.expoPushToken;
    if (token) {
      pushMessages.push({
        to: token,
        title: "오늘의 질문",
        body: pushBody,
        sound: "default",
        data: { url: "/" },
      });
    }
  }

  if (pushMessages.length > 0) {
    const pushResult = await sendExpoPushNotifications(pushMessages);
    pushSent = pushResult.sent;
    pushFailed = pushResult.failed;
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

  return { dailyReminders, capsuleUnlocked, pushSent, pushFailed };
}
