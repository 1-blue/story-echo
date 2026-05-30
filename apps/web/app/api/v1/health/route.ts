import { HealthResponseSchema } from "@storyecho/schemas";

export async function GET() {
  const body = HealthResponseSchema.parse({
    status: "ok",
    version: "0.0.1",
    timestamp: new Date().toISOString(),
  });

  return Response.json(body);
}
