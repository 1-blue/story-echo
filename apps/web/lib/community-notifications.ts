export { createNotification, createMentionNotifications } from "@/lib/notifications/create";

export async function hidePostIfReportThreshold(postId: string) {
  const { prisma } = await import("@/lib/prisma");
  const reportCount = await prisma.communityPostReport.count({ where: { postId } });
  if (reportCount >= 3) {
    await prisma.communityPost.update({
      where: { id: postId },
      data: { hiddenFromFeed: true },
    });
  }
}
