import { CronNotificationsResponseSchema } from "@storyecho/schemas";
import { apiErrorResponse } from "@/lib/api/errors";
import { dispatchDailyNotifications } from "@/lib/notifications/dispatch-daily";
import { isDatabaseConfigured } from "@/lib/story-mapper";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

async function handleCron(request: Request) {
  if (!isAuthorized(request)) {
    return apiErrorResponse(401, "UNAUTHORIZED");
  }

  if (!isDatabaseConfigured()) {
    return apiErrorResponse(503, "DB_UNAVAILABLE");
  }

  try {
    const result = await dispatchDailyNotifications();
    const body = CronNotificationsResponseSchema.parse({ data: result });
    return Response.json(body);
  } catch {
    return apiErrorResponse(503, "CRON_ERROR");
  }
}

export async function POST(request: Request) {
  return handleCron(request);
}

/** Vercel Cron invokes scheduled jobs via GET. */
export async function GET(request: Request) {
  return handleCron(request);
}
