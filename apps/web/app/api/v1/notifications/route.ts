import {
  MarkNotificationsReadRequestSchema,
  NotificationListResponseSchema,
} from "@storyecho/schemas";
import { prisma } from "@/lib/prisma";
import { toNotificationDto } from "@/lib/notifications/notification-mapper";
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
    const { cursor, limit } = parsePagination(searchParams);

    const cursorRow = await resolveCursorRow(
      (id) =>
        prisma.notification.findFirst({
          where: { id, recipientUserId: user.id },
          select: { id: true, createdAt: true },
        }),
      cursor,
    );

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          recipientUserId: user.id,
          ...cursorWhereClause(cursorRow),
        },
        include: {
          actor: { select: { id: true, nickname: true } },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: limit + 1,
      }),
      prisma.notification.count({
        where: { recipientUserId: user.id, readAt: null },
      }),
    ]);

    const { items: pageNotifications, pagination } = buildCursorResponse(
      notifications,
      limit,
    );

    const body = NotificationListResponseSchema.parse({
      data: pageNotifications.map(toNotificationDto),
      meta: { unreadCount, pagination },
    });

    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}

export async function PATCH(request: Request) {
  if (!isDatabaseConfigured()) {
    return Response.json(
      apiErrorBody("DB_UNAVAILABLE"),
      { status: 503 },
    );
  }

  try {
    const user = await resolveCurrentUser(request);
    const json: unknown = await request.json();
    const parsed = MarkNotificationsReadRequestSchema.safeParse(json);

    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    const now = new Date();

    if (parsed.data.markAll) {
      await prisma.notification.updateMany({
        where: { recipientUserId: user.id, readAt: null },
        data: { readAt: now },
      });
    } else if (parsed.data.ids?.length) {
      await prisma.notification.updateMany({
        where: {
          recipientUserId: user.id,
          id: { in: parsed.data.ids },
        },
        data: { readAt: now },
      });
    }

    return Response.json({ data: { ok: true } });
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
