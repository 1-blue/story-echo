import type { SeedFn } from "./types";
import { WELCOME_COMMUNITY_POST_BODY } from "./welcome-post.content";

export const WELCOME_COMMUNITY_POST_ID = "30000001-0000-4000-8000-000000000001";

/** 관리자 계정 — 커뮤니티 환영·안내 글 1건 */
export const seedWelcomeCommunityPost: SeedFn = async (ctx) => {
  const userId = ctx.adminUserId;
  if (!userId) {
    throw new Error("[community] adminUserId 없음");
  }

  const deleted = await ctx.prisma.communityPost.deleteMany({
    where: { id: { not: WELCOME_COMMUNITY_POST_ID } },
  });
  if (deleted.count > 0) {
    console.log(`[community] 환영 글 외 ${deleted.count}건 삭제`);
  }

  await ctx.prisma.communityPost.upsert({
    where: { id: WELCOME_COMMUNITY_POST_ID },
    create: {
      id: WELCOME_COMMUNITY_POST_ID,
      userId,
      questionId: null,
      bodyText: WELCOME_COMMUNITY_POST_BODY,
      photoUrls: [],
      hiddenFromFeed: false,
    },
    update: {
      userId,
      questionId: null,
      bodyText: WELCOME_COMMUNITY_POST_BODY,
      hiddenFromFeed: false,
    },
  });

  console.log("[community] 환영 안내 글 1건 (관리자)");
};
