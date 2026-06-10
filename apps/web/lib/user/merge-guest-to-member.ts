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

    // Remove guest rows that would violate unique constraints after userId reassignment.
    const guestReactions = await tx.communityReaction.findMany({ where: { userId: guestId } });
    for (const reaction of guestReactions) {
      const memberHas = await tx.communityReaction.findFirst({
        where: {
          targetType: reaction.targetType,
          targetId: reaction.targetId,
          userId: memberId,
        },
      });
      if (memberHas) {
        await tx.communityReaction.delete({ where: { id: reaction.id } });
      }
    }

    const guestQuestionLogs = await tx.userQuestionLog.findMany({ where: { userId: guestId } });
    for (const log of guestQuestionLogs) {
      const memberHas = await tx.userQuestionLog.findFirst({
        where: {
          userId: memberId,
          questionId: log.questionId,
          shownAt: log.shownAt,
        },
      });
      if (memberHas) {
        await tx.userQuestionLog.delete({ where: { id: log.id } });
      }
    }

    const guestReports = await tx.storyReport.findMany({ where: { reporterUserId: guestId } });
    for (const report of guestReports) {
      const memberHas = await tx.storyReport.findFirst({
        where: {
          storyId: report.storyId,
          reporterUserId: memberId,
        },
      });
      if (memberHas) {
        await tx.storyReport.delete({ where: { id: report.id } });
      }
    }

    const guestPostReports = await tx.communityPostReport.findMany({
      where: { reporterUserId: guestId },
    });
    for (const report of guestPostReports) {
      const memberHas = await tx.communityPostReport.findFirst({
        where: {
          postId: report.postId,
          reporterUserId: memberId,
        },
      });
      if (memberHas) {
        await tx.communityPostReport.delete({ where: { id: report.id } });
      }
    }

    await tx.story.updateMany({ where: { userId: guestId }, data: { userId: memberId } });
    await tx.storyComment.updateMany({ where: { userId: guestId }, data: { userId: memberId } });
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
    await tx.pushToken.updateMany({
      where: { userId: guestId },
      data: { userId: memberId },
    });

    await tx.user.update({
      where: { id: memberId },
      data: {
        fontSize:
          member.fontSize === "md" && guest.fontSize !== "md" ? guest.fontSize : member.fontSize,
        notificationsEnabled: member.notificationsEnabled || guest.notificationsEnabled,
        upgradedAt: member.upgradedAt ?? new Date(),
      },
    });

    await tx.user.delete({ where: { id: guestId } });
  });
}
