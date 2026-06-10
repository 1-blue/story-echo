import {
  CommunityPostDetailResponseSchema,
  CommunityPostResponseSchema,
  UpdateCommunityPostRequestSchema,
} from "@storyecho/schemas";
import { apiErrorBody, apiErrorResponse } from "@/lib/api/errors";
import {
  aggregateReactions,
  toCommunityCommentTree,
  toCommunityPostSummary,
} from "@/lib/community-mapper";
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

    const post = await prisma.communityPost.findFirst({
      where: { id, hiddenFromFeed: false },
      include: {
        user: { select: { id: true, nickname: true } },
        question: { select: { text: true } },
      },
    });

    if (!post) {
      return apiErrorResponse(404, "NOT_FOUND");
    }

    const [reactions, commentCount, topLevelComments] = await Promise.all([
      prisma.communityReaction.findMany({
        where: { targetType: "post", targetId: id },
      }),
      prisma.communityComment.count({ where: { postId: id } }),
      prisma.communityComment.findMany({
        where: { postId: id, parentId: null },
        include: {
          user: { select: { id: true, nickname: true } },
          replies: {
            include: { user: { select: { id: true, nickname: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const summary = toCommunityPostSummary(
      post,
      aggregateReactions(reactions, user.id),
      commentCount,
    );

    const body = CommunityPostDetailResponseSchema.parse({
      data: {
        ...summary,
        comments: toCommunityCommentTree(topLevelComments),
      },
    });

    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return Response.json(apiErrorBody("DB_UNAVAILABLE"), { status: 503 });
  }

  try {
    const { id } = await context.params;
    const user = await resolveCurrentUser(request);

    if (!user.emailVerified) {
      return Response.json(
        {
          message: "커뮤니티 글을 수정하려면 이메일 인증을 완료해주세요",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 400 },
      );
    }

    const json: unknown = await request.json();
    const parsed = UpdateCommunityPostRequestSchema.safeParse(json);
    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    const existing = await prisma.communityPost.findUnique({ where: { id } });
    if (!existing) {
      return apiErrorResponse(404, "NOT_FOUND");
    }
    if (existing.userId !== user.id) {
      return Response.json({ message: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    if (parsed.data.questionId) {
      const question = await prisma.question.findUnique({ where: { id: parsed.data.questionId } });
      if (!question) {
        return apiErrorResponse(404, "NOT_FOUND");
      }
    }

    const updated = await prisma.communityPost.update({
      where: { id },
      data: {
        ...(parsed.data.bodyText !== undefined && { bodyText: parsed.data.bodyText }),
        ...(parsed.data.photoUrls !== undefined && { photoUrls: parsed.data.photoUrls }),
        ...(parsed.data.questionId !== undefined && { questionId: parsed.data.questionId }),
      },
      include: {
        user: { select: { id: true, nickname: true } },
        question: { select: { text: true } },
      },
    });

    const commentCount = await prisma.communityComment.count({ where: { postId: id } });
    const reactions = await prisma.communityReaction.findMany({
      where: { targetType: "post", targetId: id },
    });

    const body = CommunityPostResponseSchema.parse({
      data: toCommunityPostSummary(updated, aggregateReactions(reactions, user.id), commentCount),
    });

    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return Response.json(apiErrorBody("DB_UNAVAILABLE"), { status: 503 });
  }

  try {
    const { id } = await context.params;
    const user = await resolveCurrentUser(request);

    const post = await prisma.communityPost.findUnique({ where: { id } });
    if (!post) {
      return apiErrorResponse(404, "NOT_FOUND");
    }
    if (post.userId !== user.id) {
      return Response.json({ message: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    await prisma.communityPost.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
