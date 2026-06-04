import {
  ToggleCommunityReactionRequestSchema,
  ToggleCommunityReactionResponseSchema,
} from "@storyecho/schemas";
import { prisma } from "@/lib/prisma";
import { aggregateReactions } from "@/lib/story-comment-mapper";
import { isDatabaseConfigured } from "@/lib/story-mapper";
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
    const { id } = await context.params;
    const user = await resolveCurrentUser(request);
    const json: unknown = await request.json();
    const parsed = ToggleCommunityReactionRequestSchema.safeParse(json);

    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    const story = await prisma.story.findFirst({
      where: {
        id,
        visibility: "community",
        hiddenFromFeed: false,
        isCapsuleActive: false,
      },
    });
    if (!story) {
      return apiErrorResponse(404, "NOT_FOUND");
    }

    const existing = await prisma.communityReaction.findUnique({
      where: {
        targetType_targetId_userId: {
          targetType: "story",
          targetId: id,
          userId: user.id,
        },
      },
    });

    if (existing?.emoji === parsed.data.emoji) {
      await prisma.communityReaction.delete({ where: { id: existing.id } });
    } else if (existing) {
      await prisma.communityReaction.update({
        where: { id: existing.id },
        data: { emoji: parsed.data.emoji },
      });
    } else {
      await prisma.communityReaction.create({
        data: {
          targetType: "story",
          targetId: id,
          userId: user.id,
          emoji: parsed.data.emoji,
        },
      });
    }

    const reactions = await prisma.communityReaction.findMany({
      where: { targetType: "story", targetId: id },
    });

    const body = ToggleCommunityReactionResponseSchema.parse({
      data: aggregateReactions(reactions, user.id),
    });

    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
