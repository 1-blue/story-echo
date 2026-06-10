import { LoginRequestSchema, UserMeResponseSchema } from "@storyecho/schemas";
import { apiErrorBody, apiErrorResponse } from "@/lib/api/errors";
import { notifyUnexpectedError } from "@/lib/slack/notify-unexpected-error";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { mergeGuestToMember } from "@/lib/user/merge-guest-to-member";
import {
  ensureMemberUser,
  getDeviceIdFromRequest,
  isSupabaseConfigured,
} from "@/lib/user/resolve-current-user";
import { toUserMeDto } from "@/lib/user/user-mapper";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return Response.json(apiErrorBody("DB_UNAVAILABLE"), { status: 503 });
  }

  if (!isSupabaseConfigured()) {
    return Response.json(
      { message: "Supabase Auth가 설정되지 않았어요", code: "AUTH_UNAVAILABLE" },
      { status: 503 },
    );
  }

  try {
    const json: unknown = await request.json();
    const parsed = LoginRequestSchema.safeParse(json);

    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error || !data.user) {
      return apiErrorResponse(400, "AUTH_FAILED");
    }

    const member = await ensureMemberUser(data.user.id, data.user.email ?? "");
    const deviceId = getDeviceIdFromRequest(request);
    if (deviceId) {
      try {
        await mergeGuestToMember(deviceId, member.id);
      } catch (mergeError) {
        console.error("[auth/login] mergeGuestToMember failed:", mergeError);
        void notifyUnexpectedError({
          context: "auth/login mergeGuestToMember",
          error: mergeError,
          extra: { deviceId, memberId: member.id },
        });
      }
    }

    const refreshed = await supabase.auth.getUser();
    const userId = refreshed.data.user?.id ?? member.id;
    const finalUser = await ensureMemberUser(userId, parsed.data.email);

    const body = UserMeResponseSchema.parse({ data: toUserMeDto(finalUser) });
    return Response.json(body);
  } catch (error) {
    console.error("[auth/login] unexpected error:", error);
    void notifyUnexpectedError({ context: "auth/login", error });
    return apiErrorResponse(503, "AUTH_ERROR");
  }
}
