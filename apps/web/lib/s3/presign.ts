import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getAwsEnv } from "@/lib/env/aws";

const EXT_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function createPresignedUpload(params: {
  userId: string;
  contentType: string;
  fileName: string;
}) {
  const env = getAwsEnv();
  const ext =
    EXT_BY_CONTENT_TYPE[params.contentType] ??
    params.fileName.split(".").pop()?.toLowerCase() ??
    "jpg";
  const key = `stories/${params.userId}/${randomUUID()}.${ext}`;

  const client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
    ContentType: params.contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
  const publicUrl = `${env.AWS_S3_BASE_URL.replace(/\/$/, "")}/${key}`;

  return { uploadUrl, publicUrl, key };
}
