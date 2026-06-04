import { PublicStoryDetailResponseSchema } from "@storyecho/schemas";
import { prisma } from "@/lib/prisma";
import {
  aggregateReactions,
  toPublicStoryFeedItem,
  toStoryCommentTree,
} from "@/lib/story-comment-mapper";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { resolveCurrentUser } from "@/lib/user/resolve-current-user";
import { apiErrorResponse, apiErrorBody } from "@/lib/api/errors";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return Response.json(
      apiErrorBody("DB_UNAVAILABLE"),
      { status: 503 },
    );
  }

  try {
    const { id } = await context.params;
    const user = await resolveCurrentUser(request);

    const story = await prisma.story.findFirst({
      where: {
        id,
        visibility: "community",
        hiddenFromFeed: false,
        isCapsuleActive: false,
      },
      include: {
        user: { select: { id: true, nickname: true } },
        question: { select: { text: true } },
      },
    });

    if (!story) {
      return apiErrorResponse(404, "NOT_FOUND");
    }

    const [reactions, commentCount, topLevelComments] = await Promise.all([
      prisma.communityReaction.findMany({
        where: { targetType: "story", targetId: id },
      }),
      prisma.storyComment.count({ where: { storyId: id } }),
      prisma.storyComment.findMany({
        where: { storyId: id, parentId: null },
        include: {
          user: { select: { id: true, nickname: true } },
          replies: {
            include: { user: { select: { id: true, nickname: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const summary = toPublicStoryFeedItem(
      story,
      aggregateReactions(reactions, user.id),
      commentCount,
    );

    const body = PublicStoryDetailResponseSchema.parse({
      data: {
        ...summary,
        comments: toStoryCommentTree(topLevelComments),
      },
    });

    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
