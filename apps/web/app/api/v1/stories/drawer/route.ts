import { DrawerStoryListResponseSchema } from "@storyecho/schemas";
import { apiErrorBody, apiErrorResponse } from "@/lib/api/errors";
import {
  buildCursorResponse,
  cursorWhereClause,
  parsePagination,
  resolveCursorRow,
} from "@/lib/api/pagination";
import { prisma } from "@/lib/prisma";
import {
  fetchEchoCountsForUser,
  isDatabaseConfigured,
  isEchoStoryFromCounts,
  toDrawerStoryDto,
} from "@/lib/story-mapper";
import { resolveCurrentUser } from "@/lib/user/resolve-current-user";

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return Response.json(apiErrorBody("DB_UNAVAILABLE"), { status: 503 });
  }

  try {
    const user = await resolveCurrentUser(request);
    const { searchParams } = new URL(request.url);
    const { cursor, limit } = parsePagination(searchParams);

    const baseWhere = {
      userId: user.id,
      visibility: "private" as const,
      isCapsuleActive: false,
    };

    const cursorRow = await resolveCursorRow(
      (id) =>
        prisma.story.findFirst({
          where: { id, ...baseWhere },
          select: { id: true, createdAt: true },
        }),
      cursor,
    );

    const [stories, totalCount, activeCapsuleCount, echoCounts] = await Promise.all([
      prisma.story.findMany({
        where: {
          ...baseWhere,
          ...cursorWhereClause(cursorRow),
        },
        include: {
          question: { select: { text: true } },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: limit + 1,
      }),
      prisma.story.count({ where: baseWhere }),
      prisma.story.count({
        where: {
          userId: user.id,
          isCapsuleActive: true,
        },
      }),
      fetchEchoCountsForUser(user.id),
    ]);

    const { items: pageStories, pagination } = buildCursorResponse(stories, limit);

    const oldestStory = await prisma.story.findFirst({
      where: baseWhere,
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });

    const body = DrawerStoryListResponseSchema.parse({
      data: pageStories.map((story) =>
        toDrawerStoryDto(story, isEchoStoryFromCounts(story.questionId, echoCounts)),
      ),
      meta: {
        totalCount,
        activeCapsuleCount,
        oldestStoryAt: oldestStory?.createdAt.toISOString() ?? null,
        pagination,
      },
    });

    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
