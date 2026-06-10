import { SignupRequestSchema, UserMeResponseSchema } from "@storyecho/schemas";
import { apiErrorBody, apiErrorResponse } from "@/lib/api/errors";
import { signupWithoutEmailVerification } from "@/lib/auth/signup-without-email-verification";
import { prisma } from "@/lib/prisma";
import { notifyUnexpectedError } from "@/lib/slack/notify-unexpected-error";
import { isDatabaseConfigured } from "@/lib/story-mapper";
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
    const parsed = SignupRequestSchema.safeParse(json);

    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    if (parsed.data.nickname) {
      const taken = await prisma.user.findUnique({ where: { nickname: parsed.data.nickname } });
      if (taken) {
        return Response.json(
          { message: "이미 사용 중인 닉네임이에요", code: "NICKNAME_TAKEN" },
          { status: 400 },
        );
      }
    }

    const auth = await signupWithoutEmailVerification(parsed.data.email, parsed.data.password);

    if (!auth.ok) {
      const status = auth.code === "AUTH_UNAVAILABLE" ? 503 : 400;
      return Response.json({ message: auth.message, code: auth.code }, { status });
    }

    const member = await ensureMemberUser(auth.userId, parsed.data.email, parsed.data.nickname);

    const deviceId = getDeviceIdFromRequest(request);
    if (deviceId) {
      try {
        await mergeGuestToMember(deviceId, member.id);
      } catch (mergeError) {
        console.error("[auth/signup] mergeGuestToMember failed:", mergeError);
        void notifyUnexpectedError({
          context: "auth/signup mergeGuestToMember",
          error: mergeError,
          extra: { deviceId, memberId: member.id },
        });
      }
    }

    const body = UserMeResponseSchema.parse({ data: toUserMeDto(member) });
    return Response.json(body, { status: 201 });
  } catch (error) {
    console.error("[auth/signup] unexpected error:", error);
    void notifyUnexpectedError({ context: "auth/signup", error });
    return apiErrorResponse(503, "AUTH_ERROR");
  }
}
