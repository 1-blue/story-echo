import {
  UpdateUserRequestSchema,
  UserMeResponseSchema,
} from "@storyecho/schemas";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import {
  deleteAuthUser,
  resolveCurrentUser,
} from "@/lib/user/resolve-current-user";
import { toUserMeDto } from "@/lib/user/user-mapper";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
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
    const body = UserMeResponseSchema.parse({ data: toUserMeDto(user) });
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
    const parsed = UpdateUserRequestSchema.safeParse(json);

    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    if (parsed.data.nickname) {
      const taken = await prisma.user.findFirst({
        where: {
          nickname: parsed.data.nickname,
          NOT: { id: user.id },
        },
      });
      if (taken) {
        return Response.json(
          { message: "이미 사용 중인 닉네임이에요", code: "NICKNAME_TAKEN" },
          { status: 400 },
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        nickname: parsed.data.nickname,
        fontSize: parsed.data.fontSize,
        notificationsEnabled: parsed.data.notificationsEnabled,
      },
    });

    const body = UserMeResponseSchema.parse({ data: toUserMeDto(updated) });
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
    return Response.json(
      apiErrorBody("DB_UNAVAILABLE"),
      { status: 503 },
    );
  }

  try {
    const user = await resolveCurrentUser(request);

    if (user.role !== "member") {
      return Response.json(
        { message: "회원만 탈퇴할 수 있어요", code: "NOT_MEMBER" },
        { status: 400 },
      );
    }

    await deleteAuthUser(user.id);
    await prisma.user.delete({ where: { id: user.id } });

    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();

    return Response.json({ data: { ok: true as const } });
  } catch (error) {
    if (error instanceof Error && error.message === "SUPABASE_ADMIN_UNAVAILABLE") {
      return Response.json(
        { message: "Supabase 관리자 키가 설정되지 않았어요", code: "AUTH_UNAVAILABLE" },
        { status: 503 },
      );
    }
    return apiErrorResponse(503, "DB_ERROR");
  }
}
