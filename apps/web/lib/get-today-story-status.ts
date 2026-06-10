import { getTodayQuestion, getTodayStoryForUser } from "@/lib/today-question";
import { resolveCurrentUserFromHeaders } from "@/lib/user/resolve-current-user";

export type TodayStoryStatus = {
  todayStoryId: string | null;
};

export async function getTodayStoryStatus(): Promise<TodayStoryStatus> {
  const question = await getTodayQuestion();
  if (!question.id) {
    return { todayStoryId: null };
  }

  try {
    const user = await resolveCurrentUserFromHeaders();
    const todayStoryId = await getTodayStoryForUser(user.id, question.id);
    return { todayStoryId };
  } catch {
    return { todayStoryId: null };
  }
}
