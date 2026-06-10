import { QuestionArchiveListResponseSchema } from "@storyecho/schemas";
import { apiErrorBody } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";
import {
  buildPublicStoryCountMap,
  PUBLIC_STORY_WHERE,
  toQuestionArchiveItem,
} from "@/lib/question-archive-mapper";
import { isDatabaseConfigured } from "@/lib/story-mapper";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return Response.json(apiErrorBody("DB_UNAVAILABLE"), { status: 503 });
  }

  try {
    const [questions, publicStoryCounts] = await Promise.all([
      prisma.question.findMany({
        orderBy: [{ month: "asc" }, { day: "asc" }],
        select: { id: true, text: true, month: true, day: true },
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
