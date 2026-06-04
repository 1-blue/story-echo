import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function mergeGuestToMember(
  deviceId: string,
  memberId: string,
  db: PrismaClient = prisma,
) {
  const guest = await db.user.findUnique({ where: { deviceId } });
  if (!guest || guest.id === memberId || guest.role !== "guest") return;

  const member = await db.user.findUnique({ where: { id: memberId } });
  if (!member) return;

  await db.$transaction(async (tx) => {
    const guestId = guest.id;

    await tx.story.updateMany({ where: { userId: guestId }, data: { userId: memberId } });
    await tx.userQuestionLog.updateMany({
      where: { userId: guestId },
      data: { userId: memberId },
    });
    await tx.storyReport.updateMany({
      where: { reporterUserId: guestId },
      data: { reporterUserId: memberId },
    });
    await tx.communityPost.updateMany({
      where: { userId: guestId },
      data: { userId: memberId },
    });
    await tx.communityComment.updateMany({
      where: { userId: guestId },
      data: { userId: memberId },
    });
    await tx.communityReaction.updateMany({
      where: { userId: guestId },
      data: { userId: memberId },
    });
    await tx.notification.updateMany({
      where: { recipientUserId: guestId },
      data: { recipientUserId: memberId },
    });
    await tx.notification.updateMany({
      where: { actorUserId: guestId },
      data: { actorUserId: memberId },
    });
    await tx.communityPostReport.updateMany({
      where: { reporterUserId: guestId },
      data: { reporterUserId: memberId },
    });

    await tx.user.update({
      where: { id: memberId },
      data: {
        fontSize: member.fontSize === "md" && guest.fontSize !== "md" ? guest.fontSize : member.fontSize,
        notificationsEnabled: member.notificationsEnabled || guest.notificationsEnabled,
        upgradedAt: member.upgradedAt ?? new Date(),
      },
    });

    await tx.user.delete({ where: { id: guestId } });
  });
}
