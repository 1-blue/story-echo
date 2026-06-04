import {
  CommunityCommentItemResponseSchema,
  UpdateCommunityCommentRequestSchema,
} from "@storyecho/schemas";
import { prisma } from "@/lib/prisma";
import { resolveMentionedUserIds } from "@/lib/community-mapper";
import { toStoryCommentItem } from "@/lib/story-comment-mapper";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { resolveCurrentUser } from "@/lib/user/resolve-current-user";
import { apiErrorResponse, apiErrorBody } from "@/lib/api/errors";

type RouteContext = { params: Promise<{ id: string }> };

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
    const parsed = UpdateCommunityCommentRequestSchema.safeParse(json);
    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    const existing = await prisma.storyComment.findUnique({
      where: { id },
      include: { user: { select: { id: true, nickname: true } } },
    });

    if (!existing) {
      return apiErrorResponse(404, "NOT_FOUND");
    }
    if (existing.userId !== user.id) {
      return Response.json({ message: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    const mentionedUserIds = await resolveMentionedUserIds(parsed.data.bodyText, prisma);

    const updated = await prisma.storyComment.update({
      where: { id },
      data: {
        bodyText: parsed.data.bodyText,
        mentionedUserIds,
      },
      include: { user: { select: { id: true, nickname: true } } },
    });

    const body = CommunityCommentItemResponseSchema.parse({
      data: toStoryCommentItem(updated),
    });

    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return Response.json(
      apiErrorBody("DB_UNAVAILABLE"),
      { status: 503 },
    );
  }

  try {
    const { id } = await context.params;
    const user = await resolveCurrentUser(_request);

    const comment = await prisma.storyComment.findUnique({ where: { id } });
    if (!comment) {
      return apiErrorResponse(404, "NOT_FOUND");
    }
    if (comment.userId !== user.id) {
      return Response.json({ message: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    await prisma.storyComment.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
