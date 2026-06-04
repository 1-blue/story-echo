import { PrismaClient } from "@storyecho/database";
import { createTestDeviceId } from "../setup/env";

export function getTestPrisma(): PrismaClient {
  if (!globalThis.testPrisma) {
    globalThis.testPrisma = new PrismaClient();
  }
  return globalThis.testPrisma;
}

export async function disconnectTestPrisma() {
  if (globalThis.testPrisma) {
    await globalThis.testPrisma.$disconnect();
    globalThis.testPrisma = undefined;
  }
}

export async function cleanupTestUserByDeviceId(deviceId: string) {
  const prisma = getTestPrisma();
  const user = await prisma.user.findUnique({ where: { deviceId } });
  if (!user) return;

  await prisma.notification.deleteMany({
    where: { OR: [{ recipientUserId: user.id }, { actorUserId: user.id }] },
  });
  await prisma.communityReaction.deleteMany({ where: { userId: user.id } });
  await prisma.communityPostReport.deleteMany({ where: { reporterUserId: user.id } });
  await prisma.communityComment.deleteMany({ where: { userId: user.id } });
  await prisma.communityPost.deleteMany({ where: { userId: user.id } });
  await prisma.storyReport.deleteMany({ where: { reporterUserId: user.id } });
  await prisma.storyComment.deleteMany({ where: { userId: user.id } });
  await prisma.story.deleteMany({ where: { userId: user.id } });
  await prisma.userQuestionLog.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
}

export async function createGuestUser(deviceId: string) {
  const prisma = getTestPrisma();
  const suffix = deviceId.slice(-8);
  return prisma.user.upsert({
    where: { deviceId },
    create: {
      deviceId,
      role: "guest",
      nickname: `테스트${suffix}`,
      emailVerified: false,
    },
    update: {},
  });
}

export async function createVerifiedGuestUser(suffix: string) {
  const deviceId = createTestDeviceId(suffix);
  const user = await createGuestUser(deviceId);
  return { user, deviceId };
}

export async function setUserEmailVerified(userId: string, verified: boolean) {
  const prisma = getTestPrisma();
  return prisma.user.update({
    where: { id: userId },
    data: { emailVerified: verified },
  });
}

export async function getFirstQuestionId() {
  const prisma = getTestPrisma();
  const q = await prisma.question.findFirst({ orderBy: { createdAt: "asc" } });
  return q?.id ?? null;
}

export async function hideStoryFromFeed(storyId: string) {
  const prisma = getTestPrisma();
  return prisma.story.update({
    where: { id: storyId },
    data: { hiddenFromFeed: true },
  });
}

export async function countStoryReports(storyId: string) {
  const prisma = getTestPrisma();
  return prisma.storyReport.count({ where: { storyId } });
}

export async function isStoryHidden(storyId: string) {
  const prisma = getTestPrisma();
  const story = await prisma.story.findUnique({ where: { id: storyId } });
  return story?.hiddenFromFeed ?? false;
}
