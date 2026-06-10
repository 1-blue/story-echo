import "server-only";
import { redirect } from "next/navigation";
import { resolveCurrentUserFromHeaders } from "./resolve-current-user";

function redirectToLogin(nextPath: string): never {
  redirect(`/settings/login?next=${encodeURIComponent(nextPath)}`);
}

export async function requireMemberUser(redirectTo?: string) {
  const next = redirectTo ?? "/community/write";

  let user;
  try {
    user = await resolveCurrentUserFromHeaders();
  } catch (error) {
    if (error instanceof Error && error.message === "DEVICE_ID_REQUIRED") {
      redirectToLogin(next);
    }
    throw error;
  }

  if (user.role === "guest") {
    redirectToLogin(next);
  }

  return user;
}
