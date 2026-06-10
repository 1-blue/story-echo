import { apiErrorResponse } from "@/lib/api/errors";
import { dispatchDailyNotifications } from "@/lib/notifications/dispatch-daily";
import { isDatabaseConfigured } from "@/lib/story-mapper";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return apiErrorResponse(401, "UNAUTHORIZED");
  }

  if (!isDatabaseConfigured()) {
    return apiErrorResponse(503, "DB_UNAVAILABLE");
  }

  try {
    const result = await dispatchDailyNotifications();
    return Response.json({ data: result });
  } catch {
    return apiErrorResponse(503, "CRON_ERROR");
  }
}
