import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/user/resolve-current-user";
import { apiErrorResponse } from "@/lib/api/errors";

export async function POST() {
  if (!isSupabaseConfigured()) {
    return Response.json(
      { message: "Supabase Auth가 설정되지 않았어요", code: "AUTH_UNAVAILABLE" },
      { status: 503 },
    );
  }

  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    return Response.json({ data: { ok: true as const } });
  } catch {
    return apiErrorResponse(503, "AUTH_ERROR");
  }
}
