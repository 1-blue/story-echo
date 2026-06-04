import { PublicStoryFeedListResponseSchema } from "@storyecho/schemas";
import { prisma } from "@/lib/prisma";
import { aggregateReactions, toPublicStoryFeedItem } from "@/lib/story-comment-mapper";
import {
  buildCursorResponse,
  cursorWhereClause,
  parsePagination,
  resolveCursorRow,
} from "@/lib/api/pagination";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { resolveCurrentUser } from "@/lib/user/resolve-current-user";
import { apiErrorResponse, apiErrorBody } from "@/lib/api/errors";

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return Response.json(
      apiErrorBody("DB_UNAVAILABLE"),
      { status: 503 },
    );
  }

  try {
    const user = await resolveCurrentUser(request);
    const { searchParams } = new URL(request.url);
    const { cursor, limit } = parsePagination(searchParams);

    const baseWhere = {
      visibility: "community" as const,
      questionId: { not: null },
      isCapsuleActive: false,
      hiddenFromFeed: false,
    };

    const cursorRow = await resolveCursorRow(
      (id) =>
        prisma.story.findFirst({
          where: { id, ...baseWhere },
          select: { id: true, createdAt: true },
        }),
      cursor,
    );

    const stories = await prisma.story.findMany({
      where: {
        ...baseWhere,
        ...cursorWhereClause(cursorRow),
      },
      include: {
        user: { select: { id: true, nickname: true } },
        question: { select: { text: true } },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
    });

    const { items: pageStories, pagination } = buildCursorResponse(stories, limit);
    const storyIds = pageStories.map((s) => s.id);

    const [reactions, commentCounts] = await Promise.all([
      prisma.communityReaction.findMany({
        where: { targetType: "story", targetId: { in: storyIds } },
      }),
      prisma.storyComment.groupBy({
        by: ["storyId"],
        where: { storyId: { in: storyIds } },
        _count: { _all: true },
      }),
    ]);

    const commentCountMap = new Map(
      commentCounts.map((row) => [row.storyId, row._count._all]),
    );

    const reactionsByStory = new Map<string, typeof reactions>();
    for (const id of storyIds) reactionsByStory.set(id, []);
    for (const reaction of reactions) {
      reactionsByStory.get(reaction.targetId)?.push(reaction);
    }

    const body = PublicStoryFeedListResponseSchema.parse({
      data: pageStories.map((story) =>
        toPublicStoryFeedItem(
          story,
          aggregateReactions(reactionsByStory.get(story.id) ?? [], user.id),
          commentCountMap.get(story.id) ?? 0,
        ),
      ),
      meta: { pagination },
    });

    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
