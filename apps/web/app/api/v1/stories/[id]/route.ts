import { StoryDetailResponseSchema, UpdateStoryRequestSchema } from "@storyecho/schemas";
import { prisma } from "@/lib/prisma";
import {
  fetchEchoCountsForUser,
  isDatabaseConfigured,
  isEchoStoryFromCounts,
  toStoryDetailDto,
} from "@/lib/story-mapper";
import { resolveCurrentUser } from "@/lib/user/resolve-current-user";
import { apiErrorResponse, apiErrorBody } from "@/lib/api/errors";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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
        userId: user.id,
        isCapsuleActive: false,
        visibility: { in: ["private", "community"] },
      },
      include: {
        question: { select: { text: true } },
      },
    });

    if (!story) {
      return apiErrorResponse(404, "NOT_FOUND");
    }

    const echoCounts = await fetchEchoCountsForUser(user.id);

    const body = StoryDetailResponseSchema.parse({
      data: toStoryDetailDto(story, isEchoStoryFromCounts(story.questionId, echoCounts)),
    });

    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return Response.json(
      apiErrorBody("DB_UNAVAILABLE"),
      { status: 503 },
    );
  }

  try {
    const { id } = await context.params;
    const user = await resolveCurrentUser(request);
    const json: unknown = await request.json();
    const parsed = UpdateStoryRequestSchema.safeParse(json);

    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    const story = await prisma.story.findFirst({
      where: { id, userId: user.id },
      include: {
        question: { select: { text: true } },
      },
    });

    if (!story) {
      return apiErrorResponse(404, "NOT_FOUND");
    }

    if (story.isCapsuleActive) {
      return Response.json(
        { message: "봉인 중인 타임캡슐은 수정할 수 없습니다", code: "CAPSULE_SEALED" },
        { status: 409 },
      );
    }

    if (parsed.data.visibility === "community" && !user.emailVerified) {
      return Response.json(
        {
          message: "오늘 공개하기는 이메일 인증 후 이용할 수 있습니다",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 400 },
      );
    }

    const updated = await prisma.story.update({
      where: { id },
      data: {
        ...(parsed.data.bodyText !== undefined && { bodyText: parsed.data.bodyText }),
        ...(parsed.data.photoUrls !== undefined && { photoUrls: parsed.data.photoUrls }),
        ...(parsed.data.visibility !== undefined && { visibility: parsed.data.visibility }),
        ...(parsed.data.isBookmarked !== undefined && { isBookmarked: parsed.data.isBookmarked }),
      },
      include: {
        question: { select: { text: true } },
      },
    });

    const echoCounts = await fetchEchoCountsForUser(user.id);

    const body = StoryDetailResponseSchema.parse({
      data: toStoryDetailDto(updated, isEchoStoryFromCounts(updated.questionId, echoCounts)),
    });

    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}

export async function DELETE(request: Request, context: RouteContext) {
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
      where: { id, userId: user.id },
    });

    if (!story) {
      return apiErrorResponse(404, "NOT_FOUND");
    }

    await prisma.story.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
