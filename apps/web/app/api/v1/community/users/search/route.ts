import { CommunityUserSearchResponseSchema } from "@storyecho/schemas";
import { prisma } from "@/lib/prisma";
import { toCommunityAuthor } from "@/lib/community-mapper";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { apiErrorResponse, apiErrorBody } from "@/lib/api/errors";

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return Response.json(
      apiErrorBody("DB_UNAVAILABLE"),
      { status: 503 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const postId = searchParams.get("postId")?.trim();

    let participantIds: string[] = [];
    if (postId) {
      const [post, comments] = await Promise.all([
        prisma.communityPost.findUnique({
          where: { id: postId },
          select: { userId: true },
        }),
        prisma.communityComment.findMany({
          where: { postId },
          select: { userId: true },
        }),
      ]);
      if (post) participantIds.push(post.userId);
      participantIds.push(...comments.map((c) => c.userId));
      participantIds = [...new Set(participantIds)];
    }

    if (!q && participantIds.length > 0) {
      const users = await prisma.user.findMany({
        where: { id: { in: participantIds } },
        select: { id: true, nickname: true },
        take: 10,
      });
      const body = CommunityUserSearchResponseSchema.parse({
        data: users.map((user) => toCommunityAuthor(user)),
      });
      return Response.json(body);
    }

    if (!q) {
      return Response.json({ data: [] });
    }

    const users = await prisma.user.findMany({
      where: {
        nickname: { contains: q, mode: "insensitive" },
        ...(participantIds.length > 0 ? { id: { in: participantIds } } : {}),
      },
      select: { id: true, nickname: true },
      take: 10,
    });

    const body = CommunityUserSearchResponseSchema.parse({
      data: users.map((user) => toCommunityAuthor(user)),
    });

    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
