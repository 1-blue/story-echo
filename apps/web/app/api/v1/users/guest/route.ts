import { CreateGuestRequestSchema, UserMeResponseSchema } from "@storyecho/schemas";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { getOrCreateGuestUser } from "@/lib/user/guest-user";
import { toUserMeDto } from "@/lib/user/user-mapper";
import { apiErrorResponse, apiErrorBody } from "@/lib/api/errors";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return Response.json(
      apiErrorBody("DB_UNAVAILABLE"),
      { status: 503 },
    );
  }

  try {
    const json: unknown = await request.json();
    const parsed = CreateGuestRequestSchema.safeParse(json);

    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    const user = await getOrCreateGuestUser(parsed.data.deviceId);
    const body = UserMeResponseSchema.parse({ data: toUserMeDto(user) });
    return Response.json(body, { status: 200 });
  } catch {
    return apiErrorResponse(503, "DB_ERROR");
  }
}
