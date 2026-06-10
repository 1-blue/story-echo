import {
  PushTokenOkResponseSchema,
  UpsertPushTokenRequestSchema,
} from "@storyecho/schemas";
import { apiErrorBody, apiErrorResponse } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { resolveCurrentUser } from "@/lib/user/resolve-current-user";

export async function PUT(request: Request) {
  if (!isDatabaseConfigured()) {
    return Response.json(apiErrorBody("DB_UNAVAILABLE"), { status: 503 });
  }

  try {
    const user = await resolveCurrentUser(request);
    const json: unknown = await request.json();
    const parsed = UpsertPushTokenRequestSchema.safeParse(json);

    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    const { expoPushToken, platform } = parsed.data;

    await prisma.$transaction([
      prisma.pushToken.deleteMany({ where: { userId: user.id } }),
      prisma.pushToken.upsert({
        where: { expoPushToken },
        create: {
          userId: user.id,
          expoPushToken,
          platform,
        },
        update: {
          userId: user.id,
          platform,
        },
      }),
    ]);

    const body = PushTokenOkResponseSchema.parse({ data: { ok: true as const } });
    return Response.json(body);
  } catch (error) {
    if (error instanceof Error && error.message === "DEVICE_ID_REQUIRED") {
      return Response.json(
        { message: "기기 ID가 필요합니다", code: "DEVICE_ID_REQUIRED" },
        { status: 401 },
      );
    }
    return apiErrorResponse(503, "DB_ERROR");
  }
}

export async function DELETE(request: Request) {
  if (!isDatabaseConfigured()) {
    return Response.json(apiErrorBody("DB_UNAVAILABLE"), { status: 503 });
  }

  try {
    const user = await resolveCurrentUser(request);
    await prisma.pushToken.deleteMany({ where: { userId: user.id } });

    const body = PushTokenOkResponseSchema.parse({ data: { ok: true as const } });
    return Response.json(body);
  } catch (error) {
    if (error instanceof Error && error.message === "DEVICE_ID_REQUIRED") {
      return Response.json(
        { message: "기기 ID가 필요합니다", code: "DEVICE_ID_REQUIRED" },
        { status: 401 },
      );
    }
    return apiErrorResponse(503, "DB_ERROR");
  }
}
