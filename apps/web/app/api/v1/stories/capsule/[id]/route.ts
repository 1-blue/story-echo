import { CapsuleStoryDetailResponseSchema } from "@storyecho/schemas";
import { apiErrorBody, apiErrorResponse } from "@/lib/api/errors";
import { toCapsuleStoryDetail } from "@/lib/capsule-mapper";
import { syncExpiredCapsules } from "@/lib/capsule-utils";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { resolveCurrentUser } from "@/lib/user/resolve-current-user";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return Response.json(apiErrorBody("DB_UNAVAILABLE"), { status: 503 });
  }

  try {
    const { id } = await context.params;
    const user = await resolveCurrentUser(request);
    await syncExpiredCapsules(user.id);

    const story = await prisma.story.findFirst({
      where: {
        id,
        userId: user.id,
        isCapsule: true,
        unlockAt: { not: null },
      },
      include: {
        question: { select: { text: true } },
      },
    });

    if (!story) {
      return apiErrorResponse(404, "NOT_FOUND");
    }

    const body = CapsuleStoryDetailResponseSchema.parse({
      data: toCapsuleStoryDetail(story),
    });

    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
