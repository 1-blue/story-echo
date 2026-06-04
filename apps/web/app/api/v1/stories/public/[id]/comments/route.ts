import {
  CommunityCommentResponseSchema,
  CreateCommunityCommentRequestSchema,
} from "@storyecho/schemas";
import { prisma } from "@/lib/prisma";
import { resolveMentionedUserIds } from "@/lib/community-mapper";
import { toStoryCommentTree } from "@/lib/story-comment-mapper";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import {
  createNotification,
  createStoryMentionNotifications,
} from "@/lib/notifications/create";
import { resolveCurrentUser } from "@/lib/user/resolve-current-user";
import { apiErrorResponse, apiErrorBody } from "@/lib/api/errors";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return Response.json(
      apiErrorBody("DB_UNAVAILABLE"),
      { status: 503 },
    );
  }

  try {
    const { id: storyId } = await context.params;
    const user = await resolveCurrentUser(request);

    if (!user.emailVerified) {
      return Response.json(
        {
          message: "댓글을 남기려면 이메일 인증을 완료해주세요",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 400 },
      );
    }

    const json: unknown = await request.json();
    const parsed = CreateCommunityCommentRequestSchema.safeParse(json);
    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    const story = await prisma.story.findFirst({
      where: {
        id: storyId,
        visibility: "community",
        hiddenFromFeed: false,
        isCapsuleActive: false,
      },
    });
    if (!story) {
      return apiErrorResponse(404, "NOT_FOUND");
    }

    let parentId: string | null = parsed.data.parentId ?? null;

    if (parentId) {
      const parent = await prisma.storyComment.findFirst({
        where: { id: parentId, storyId },
      });
      if (!parent) {
        return apiErrorResponse(404, "NOT_FOUND");
      }
      if (parent.parentId) {
        return Response.json(
          { message: "Replies are limited to one level", code: "REPLY_DEPTH_EXCEEDED" },
          { status: 400 },
        );
      }
    }

    const mentionedUserIds = await resolveMentionedUserIds(parsed.data.bodyText, prisma);

    const comment = await prisma.storyComment.create({
      data: {
        storyId,
        userId: user.id,
        parentId,
        bodyText: parsed.data.bodyText,
        mentionedUserIds,
      },
      include: {
        user: { select: { id: true, nickname: true } },
        replies: {
          include: { user: { select: { id: true, nickname: true } } },
        },
      },
    });

    if (parentId) {
      const parent = await prisma.storyComment.findUnique({ where: { id: parentId } });
      if (parent) {
        await createNotification({
          recipientUserId: parent.userId,
          actorUserId: user.id,
          type: "reply_to_story_comment",
          storyId,
          commentId: comment.id,
        });
      }
    } else {
      await createNotification({
        recipientUserId: story.userId,
        actorUserId: user.id,
        type: "comment_on_public_story",
        storyId,
        commentId: comment.id,
      });
    }

    await createStoryMentionNotifications(mentionedUserIds, user.id, storyId, comment.id);

    const [tree] = toStoryCommentTree([comment]);
    const body = CommunityCommentResponseSchema.parse({ data: tree });
    return Response.json(body, { status: 201 });
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
