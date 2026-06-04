import { PresignUploadRequestSchema, PresignUploadResponseSchema } from "@storyecho/schemas";
import { isAwsConfigured } from "@/lib/env/aws";
import { createPresignedUpload } from "@/lib/s3/presign";
import { resolveCurrentUser } from "@/lib/user/resolve-current-user";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { apiErrorResponse, apiErrorBody } from "@/lib/api/errors";

export async function POST(request: Request) {
  if (!isAwsConfigured()) {
    return Response.json(
      { message: "AWS S3 not configured. Set AWS_* in .env.local", code: "AWS_UNAVAILABLE" },
      { status: 503 },
    );
  }

  if (!isDatabaseConfigured()) {
    return Response.json(
      apiErrorBody("DB_UNAVAILABLE"),
      { status: 503 },
    );
  }

  try {
    const json: unknown = await request.json();
    const parsed = PresignUploadRequestSchema.safeParse(json);

    if (!parsed.success) {
      return apiErrorResponse(400, "VALIDATION_ERROR");
    }

    const user = await resolveCurrentUser(request);
    const presigned = await createPresignedUpload({
      userId: user.id,
      contentType: parsed.data.contentType,
      fileName: parsed.data.fileName,
    });

    const body = PresignUploadResponseSchema.parse({ data: presigned });
    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "AWS_ERROR");
  }
}
