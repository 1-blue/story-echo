import { QuestionArchiveListQuerySchema, QuestionArchiveListResponseSchema } from "@storyecho/schemas";
import { parseQuestionTagsQuery } from "@storyecho/database/question-tags";
import { apiErrorBody, apiErrorResponse } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";
import {
  buildPublicStoryCountMap,
  PUBLIC_STORY_WHERE,
  toQuestionArchiveItem,
} from "@/lib/question-archive-mapper";
import { isDatabaseConfigured } from "@/lib/story-mapper";

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return Response.json(apiErrorBody("DB_UNAVAILABLE"), { status: 503 });
  }

  const url = new URL(request.url);
  const queryParse = QuestionArchiveListQuerySchema.safeParse({
    tags: url.searchParams.get("tags") ?? undefined,
  });

  if (!queryParse.success) {
    return apiErrorResponse(400, "VALIDATION_ERROR", undefined, {
      path: url.pathname,
      method: "GET",
    });
  }

  const tagFilter = parseQuestionTagsQuery(queryParse.data.tags);
  if (queryParse.data.tags?.trim() && tagFilter === null) {
    return apiErrorResponse(400, "VALIDATION_ERROR", undefined, {
      path: url.pathname,
      method: "GET",
    });
  }

  try {
    const [questions, publicStoryCounts] = await Promise.all([
      prisma.question.findMany({
        where: tagFilter ? { tags: { hasSome: tagFilter } } : undefined,
        orderBy: [{ month: "asc" }, { day: "asc" }],
        select: { id: true, text: true, month: true, day: true, tags: true },
      }),
      prisma.story.groupBy({
        by: ["questionId"],
        where: {
          ...PUBLIC_STORY_WHERE,
          questionId: { not: null },
        },
        _count: { _all: true },
      }),
    ]);

    const countMap = buildPublicStoryCountMap(publicStoryCounts);

    const body = QuestionArchiveListResponseSchema.parse({
      data: questions.map((question) =>
        toQuestionArchiveItem(question, countMap.get(question.id) ?? 0),
      ),
    });

    return Response.json(body);
  } catch {
    return Response.json(apiErrorBody("DB_ERROR"), { status: 503 });
  }
}
