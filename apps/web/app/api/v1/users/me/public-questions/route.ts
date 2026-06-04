import { PublicQuestionAnswerListResponseSchema } from "@storyecho/schemas";
import { prisma } from "@/lib/prisma";
import { dedupePublicQuestionAnswers } from "@/lib/public-question-mapper";
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

    const stories = await prisma.story.findMany({
      where: {
        userId: user.id,
        visibility: "community",
        questionId: { not: null },
        isCapsuleActive: false,
        hiddenFromFeed: false,
      },
      include: {
        question: { select: { text: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const typedStories = stories.filter(
      (story): story is typeof story & { questionId: string; question: { text: string } } =>
        story.questionId !== null && story.question !== null,
    );

    const body = PublicQuestionAnswerListResponseSchema.parse({
      data: dedupePublicQuestionAnswers(typedStories),
    });

    return Response.json(body);
  } catch (error) {
    if (error instanceof Error && error.message === "DEVICE_ID_REQUIRED") {
      return Response.json(
        { message: "기기 ID가 필요합니다", code: "DEVICE_ID_REQUIRED" },
        { status: 401 },
      );
    }

    return apiErrorResponse(503, "DB_ERROR");
  }
}
