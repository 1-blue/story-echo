import type { SeedFn } from "./types";

const REPORT_POST_ID = "30000001-0000-4000-8000-000000000002";
const GUEST_DEVICE_IDS = [
  "00000000-0000-4000-8000-00000000a001",
  "00000000-0000-4000-8000-00000000a002",
  "00000000-0000-4000-8000-00000000a003",
];

/** 공개 이야기 신고 3건 → 숨김 threshold 테스트용 */
export const seedStoryReports: SeedFn = async (ctx) => {
  const adminId = ctx.adminUserId;
  if (!adminId) {
    throw new Error("[story_reports] adminUserId 없음");
  }

  const story = await ctx.prisma.story.findFirst({
    where: { userId: adminId, visibility: "community" },
    select: { id: true },
  });

  if (!story) {
    const created = await ctx.prisma.story.create({
      data: {
        id: REPORT_POST_ID,
        userId: adminId,
        bodyText: "신고 테스트용 공개 이야기입니다.",
        photoUrls: [],
        visibility: "community",
        isCapsule: false,
        isCapsuleActive: false,
      },
    });
    await seedReportsForStory(ctx, created.id);
    return;
  }

  await seedReportsForStory(ctx, story.id);
};

async function seedReportsForStory(
  ctx: { prisma: import("@prisma/client").PrismaClient },
  storyId: string,
) {
  await ctx.prisma.storyReport.deleteMany({ where: { storyId } });

  for (const deviceId of GUEST_DEVICE_IDS) {
    const guest = await ctx.prisma.user.upsert({
      where: { deviceId },
      create: {
        deviceId,
        role: "guest",
        nickname: `신고자${deviceId.slice(-4)}`,
      },
      update: {},
    });

    await ctx.prisma.storyReport.upsert({
      where: {
        storyId_reporterUserId: { storyId, reporterUserId: guest.id },
      },
      create: { storyId, reporterUserId: guest.id },
      update: {},
    });
  }

  const count = await ctx.prisma.storyReport.count({ where: { storyId } });
  console.log(`[story_reports] story ${storyId} — ${count} reports`);
}
