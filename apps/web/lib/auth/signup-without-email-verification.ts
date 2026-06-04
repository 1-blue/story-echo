import { createSupabaseAdminClient } from "@/lib/user/resolve-current-user";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export type SignupAuthResult =
  | { ok: true; userId: string }
  | { ok: false; message: string; code: string };

function mapSignupAuthError(message: string): SignupAuthResult {
  const lower = message.toLowerCase();
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return { ok: false, message: "이미 가입된 이메일이에요", code: "EMAIL_TAKEN" };
  }
  if (lower.includes("rate limit")) {
    return {
      ok: false,
      message: "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.",
      code: "RATE_LIMIT",
    };
  }
  return { ok: false, message, code: "AUTH_FAILED" };
}

/**
 * 이메일 인증 메일 없이 회원 생성 후 세션 쿠키를 설정합니다.
 * (추후 이메일 인증 도입 전까지: 입력한 이메일 = 해당 계정)
 */
export async function signupWithoutEmailVerification(
  email: string,
  password: string,
): Promise<SignupAuthResult> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      ok: false,
      message: "SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았어요",
      code: "AUTH_UNAVAILABLE",
    };
  }

  const admin = createSupabaseAdminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return mapSignupAuthError(createError?.message ?? "회원가입에 실패했습니다");
  }

  const supabase = await createServerSupabaseClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    return mapSignupAuthError(signInError.message);
  }

  return { ok: true, userId: created.user.id };
}
