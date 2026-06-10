import {
  CreateStoryRequestSchema,
  QuestionNotTodayErrorSchema,
  StoryListResponseSchema,
  StoryResponseSchema,
  TodayStoryExistsErrorSchema,
} from "@storyecho/schemas";
import { apiErrorBody, apiErrorResponse } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured, toStoryDto } from "@/lib/story-mapper";
import { validateStoryCreate } from "@/lib/story-write-policy";
import { notifyContentEvent } from "@/lib/slack/notify-content-event";
import { getTodayQuestion, getTodayStoryForUser } from "@/lib/today-question";
import { resolveCurrentUser } from "@/lib/user/resolve-current-user";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return Response.json(apiErrorBody("DB_UNAVAILABLE"), { status: 503 });
  }

  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    const body = StoryListResponseSchema.parse({
      data: stories.map(toStoryDto),
    });

    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return Response.json(apiErrorBody("DB_UNAVAILABLE"), { status: 503 });
  }

  try {
    const json: unknown = await request.json();
    const parsed = CreateStoryRequestSchema.safeParse(json);

    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    const user = await resolveCurrentUser(request);

    const isCapsule = parsed.data.isCapsule;
    const todayQuestion = await getTodayQuestion();
    const questionId = parsed.data.questionId ?? null;

    let existingTodayStoryId: string | null = null;
    if (!isCapsule && todayQuestion.id && questionId === todayQuestion.id) {
      existingTodayStoryId = await getTodayStoryForUser(user.id, todayQuestion.id);
    }

    const validation = validateStoryCreate({
      isCapsule,
      questionId,
      todayQuestionId: todayQuestion.id,
      existingTodayStoryId,
    });

    if (!validation.ok) {
      if (validation.error.code === "TODAY_STORY_EXISTS") {
        const errorBody = TodayStoryExistsErrorSchema.parse({
          message: validation.error.message,
          code: validation.error.code,
          storyId: validation.error.storyId,
        });
        return Response.json(errorBody, { status: 409 });
      }

      const errorBody = QuestionNotTodayErrorSchema.parse({
        message: validation.error.message,
        code: validation.error.code,
      });
      return Response.json(errorBody, { status: 409 });
    }

    if (parsed.data.visibility === "community" && !user.emailVerified) {
      return Response.json(
        {
          message: "커뮤니티 공개는 이메일 인증 후 이용할 수 있습니다",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 400 },
      );
    }

    const unlockAt = parsed.data.unlockAt ? new Date(parsed.data.unlockAt) : null;
    const isCapsuleActive = isCapsule && Boolean(unlockAt) && unlockAt! > new Date();
    const visibility = isCapsule ? "private" : parsed.data.visibility;

    const story = await prisma.story.create({
      data: {
        userId: user.id,
        questionId: parsed.data.questionId ?? null,
        bodyText: parsed.data.bodyText,
        photoUrls: parsed.data.photoUrls,
        visibility,
        isCapsule,
        unlockAt,
        isCapsuleActive,
      },
    });

    if (!isCapsule && todayQuestion.id && parsed.data.questionId === todayQuestion.id) {
      void notifyContentEvent({
        kind: "today_story",
        nickname: user.nickname,
        resourceId: story.id,
        preview: parsed.data.bodyText,
      });
    }

    const body = StoryResponseSchema.parse({ data: toStoryDto(story) });
    return Response.json(body, { status: 201 });
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
