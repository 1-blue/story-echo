import type { SeedFn } from "./types";

const COMMUNITY_POST_ID = "30000001-0000-4000-8000-000000000001";

/** 커뮤니티·댓글·reaction 소량 샘플 */
export const seedCommunity: SeedFn = async (ctx) => {
  const userId = ctx.adminUserId;
  if (!userId) {
    throw new Error("[community] adminUserId 없음");
  }

  const postIds = (
    await ctx.prisma.communityPost.findMany({
      where: { userId },
      select: { id: true },
    })
  ).map((p) => p.id);

  if (postIds.length > 0) {
    await ctx.prisma.communityComment.deleteMany({ where: { postId: { in: postIds } } });
    await ctx.prisma.communityReaction.deleteMany({
      where: { targetType: "post", targetId: { in: postIds } },
    });
    await ctx.prisma.communityPostReport.deleteMany({ where: { postId: { in: postIds } } });
  }
  await ctx.prisma.communityPost.deleteMany({ where: { userId } });

  const post = await ctx.prisma.communityPost.upsert({
    where: { id: COMMUNITY_POST_ID },
    create: {
      id: COMMUNITY_POST_ID,
      userId,
      bodyText: "시드 커뮤니티 글 — 따뜻한 하루를 나눠요.",
      photoUrls: [],
    },
    update: {
      bodyText: "시드 커뮤니티 글 — 따뜻한 하루를 나눠요.",
    },
  });

  await ctx.prisma.communityComment.create({
    data: {
      postId: post.id,
      userId,
      bodyText: "첫 댓글 시드입니다.",
    },
  });

  await ctx.prisma.communityReaction.create({
    data: {
      targetType: "post",
      targetId: post.id,
      userId,
      emoji: "heart",
    },
  });

  console.log("[community] 1 post, 1 comment, 1 reaction (관리자)");
};
