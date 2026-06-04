import {
  CommunityPostListResponseSchema,
  CreateCommunityPostRequestSchema,
  CommunityPostResponseSchema,
} from "@storyecho/schemas";
import { prisma } from "@/lib/prisma";
import {
  aggregateReactions,
  toCommunityPostSummary,
} from "@/lib/community-mapper";
import {
  buildCursorResponse,
  cursorWhereClause,
  parsePagination,
  resolveCursorRow,
} from "@/lib/api/pagination";
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
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const { cursor, limit } = parsePagination(searchParams);

    const cursorRow = await resolveCursorRow(
      (id) =>
        prisma.communityPost.findUnique({
          where: { id },
          select: { id: true, createdAt: true },
        }),
      cursor,
    );

    const posts = await prisma.communityPost.findMany({
      where: {
        hiddenFromFeed: false,
        ...cursorWhereClause(cursorRow),
        ...(q
          ? {
              OR: [
                { bodyText: { contains: q, mode: "insensitive" } },
                { question: { text: { contains: q, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: {
        user: { select: { id: true, nickname: true } },
        question: { select: { text: true } },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
    });

    const { items: pagePosts, pagination } = buildCursorResponse(posts, limit);
    const postIds = pagePosts.map((p) => p.id);

    const [reactions, commentCounts] = await Promise.all([
      prisma.communityReaction.findMany({
        where: { targetType: "post", targetId: { in: postIds } },
      }),
      prisma.communityComment.groupBy({
        by: ["postId"],
        where: { postId: { in: postIds } },
        _count: { _all: true },
      }),
    ]);

    const commentCountMap = new Map(
      commentCounts.map((row) => [row.postId, row._count._all]),
    );

    const reactionsByPost = new Map<string, typeof reactions>();
    for (const id of postIds) reactionsByPost.set(id, []);
    for (const reaction of reactions) {
      reactionsByPost.get(reaction.targetId)?.push(reaction);
    }

    const body = CommunityPostListResponseSchema.parse({
      data: pagePosts.map((post) =>
        toCommunityPostSummary(
          post,
          aggregateReactions(reactionsByPost.get(post.id) ?? [], user.id),
          commentCountMap.get(post.id) ?? 0,
        ),
      ),
      meta: { pagination },
    });

    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return Response.json(
      apiErrorBody("DB_UNAVAILABLE"),
      { status: 503 },
    );
  }

  try {
    const json: unknown = await request.json();
    const parsed = CreateCommunityPostRequestSchema.safeParse(json);

    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    const user = await resolveCurrentUser(request);

    if (!user.emailVerified) {
      return Response.json(
        {
          message: "커뮤니티에 글을 남기려면 이메일 인증을 완료해주세요",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 400 },
      );
    }

    const post = await prisma.communityPost.create({
      data: {
        userId: user.id,
        questionId: parsed.data.questionId ?? null,
        bodyText: parsed.data.bodyText,
        photoUrls: parsed.data.photoUrls,
      },
      include: {
        user: { select: { id: true, nickname: true } },
        question: { select: { text: true } },
      },
    });

    const body = CommunityPostResponseSchema.parse({
      data: toCommunityPostSummary(post, aggregateReactions([], user.id), 0),
    });

    return Response.json(body, { status: 201 });
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
