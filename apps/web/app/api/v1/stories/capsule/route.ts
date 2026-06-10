import { CapsuleStoryListResponseSchema } from "@storyecho/schemas";
import { apiErrorBody, apiErrorResponse } from "@/lib/api/errors";
import {
  buildCursorResponse,
  cursorWhereClause,
  parsePagination,
  resolveCursorRow,
} from "@/lib/api/pagination";
import { toCapsuleStorySummary } from "@/lib/capsule-mapper";
import { syncExpiredCapsules } from "@/lib/capsule-utils";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { resolveCurrentUser } from "@/lib/user/resolve-current-user";

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return Response.json(apiErrorBody("DB_UNAVAILABLE"), { status: 503 });
  }

  try {
    const user = await resolveCurrentUser(request);
    await syncExpiredCapsules(user.id);

    const { searchParams } = new URL(request.url);
    const { cursor, limit } = parsePagination(searchParams);

    const baseWhere = {
      userId: user.id,
      isCapsule: true,
      unlockAt: { not: null },
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
        question: { select: { text: true } },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
    });

    const { items: pageStories, pagination } = buildCursorResponse(stories, limit);

    const sealed = pageStories.filter((story) => story.isCapsuleActive).map(toCapsuleStorySummary);
    const opened = pageStories.filter((story) => !story.isCapsuleActive).map(toCapsuleStorySummary);

    const activeCapsuleCount = await prisma.story.count({
      where: {
        userId: user.id,
        isCapsule: true,
        isCapsuleActive: true,
      },
    });

    const body = CapsuleStoryListResponseSchema.parse({
      data: { sealed, opened },
      meta: { activeCapsuleCount, pagination },
    });

    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
