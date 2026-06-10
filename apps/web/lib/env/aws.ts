import { z } from "zod";

/** S3 presign 등 서버 Route Handler용 AWS env (apps/web/.env.local) */
const awsEnvSchema = z.object({
  AWS_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_S3_BUCKET: z.string().min(1),
  AWS_S3_BASE_URL: z.string().url(),
});

export function getAwsEnv() {
  return awsEnvSchema.parse(process.env);
}

export function isAwsConfigured(): boolean {
  return awsEnvSchema.safeParse(process.env).success;
}
