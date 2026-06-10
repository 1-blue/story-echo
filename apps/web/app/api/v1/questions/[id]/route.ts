import { QuestionResponseSchema } from "@storyecho/schemas";
import { apiErrorBody, apiErrorResponse } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";
import { PUBLIC_STORY_WHERE, toQuestionArchiveItem } from "@/lib/question-archive-mapper";
import { isDatabaseConfigured } from "@/lib/story-mapper";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return Response.json(apiErrorBody("DB_UNAVAILABLE"), { status: 503 });
  }

  const { id } = await context.params;

  try {
    const question = await prisma.question.findUnique({
      where: { id },
      select: { id: true, text: true, month: true, day: true },
    });

    if (!question) {
      return apiErrorResponse(404, "NOT_FOUND");
    }

    const publicStoryCount = await prisma.story.count({
      where: {
        ...PUBLIC_STORY_WHERE,
        questionId: id,
      },
    });

    const body = QuestionResponseSchema.parse({
      data: toQuestionArchiveItem(question, publicStoryCount),
    });

    return Response.json(body);
  } catch {
    return Response.json(apiErrorBody("DB_ERROR"), { status: 503 });
  }
}
