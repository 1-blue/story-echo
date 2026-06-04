import { getTodayQuestion, getTodayStoryForUser } from "@/lib/today-question";
import { resolveCurrentUserFromHeaders } from "@/lib/user/resolve-current-user";

export async function getTodayWriteHref(): Promise<string> {
  const question = await getTodayQuestion();
  if (!question.id) return "/write";

  try {
    const user = await resolveCurrentUserFromHeaders();
    const storyId = await getTodayStoryForUser(user.id, question.id);
    return storyId ? `/write/${storyId}` : "/write";
  } catch {
    return "/write";
  }
}
