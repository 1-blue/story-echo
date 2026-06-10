import { ReportCommunityPostRequestSchema } from "@storyecho/schemas";
import { apiErrorBody, apiErrorResponse } from "@/lib/api/errors";
import { hidePostIfReportThreshold } from "@/lib/community-notifications";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { resolveCurrentUser } from "@/lib/user/resolve-current-user";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return Response.json(apiErrorBody("DB_UNAVAILABLE"), { status: 503 });
  }

  try {
    const { id: postId } = await context.params;
    const user = await resolveCurrentUser(request);
    const json: unknown = await request.json().catch(() => ({}));
    const parsed = ReportCommunityPostRequestSchema.safeParse(json);

    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    const post = await prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post) {
      return apiErrorResponse(404, "NOT_FOUND");
    }

    await prisma.communityPostReport.upsert({
      where: {
        postId_reporterUserId: { postId, reporterUserId: user.id },
      },
      update: { reason: parsed.data.reason ?? null },
      create: {
        postId,
        reporterUserId: user.id,
        reason: parsed.data.reason ?? null,
      },
    });

    await hidePostIfReportThreshold(postId);

    return Response.json({ data: { ok: true } });
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
