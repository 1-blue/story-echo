import { prisma } from "@/lib/prisma";

const REPORT_THRESHOLD = 3;

export async function hideStoryIfReportThreshold(storyId: string) {
  const count = await prisma.storyReport.count({ where: { storyId } });
  if (count >= REPORT_THRESHOLD) {
    await prisma.story.update({
      where: { id: storyId },
      data: { hiddenFromFeed: true },
    });
  }
}
