import { ReportCommunityPostRequestSchema } from "@storyecho/schemas";
import { apiErrorBody, apiErrorResponse } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { hideStoryIfReportThreshold } from "@/lib/story-report";
import { resolveCurrentUser } from "@/lib/user/resolve-current-user";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return Response.json(apiErrorBody("DB_UNAVAILABLE"), { status: 503 });
  }

  try {
    const { id: storyId } = await context.params;
    const user = await resolveCurrentUser(request);
    const json: unknown = await request.json().catch(() => ({}));
    const parsed = ReportCommunityPostRequestSchema.safeParse(json);

    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    const story = await prisma.story.findFirst({
      where: {
        id: storyId,
        visibility: "community",
        hiddenFromFeed: false,
      },
    });
    if (!story) {
      return apiErrorResponse(404, "NOT_FOUND");
    }

    await prisma.storyReport.upsert({
      where: {
        storyId_reporterUserId: { storyId, reporterUserId: user.id },
      },
      update: {},
      create: {
        storyId,
        reporterUserId: user.id,
      },
    });

    await hideStoryIfReportThreshold(storyId);

    return Response.json({ data: { ok: true } });
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
