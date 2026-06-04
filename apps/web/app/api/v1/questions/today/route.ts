import { TodayQuestionResponseSchema } from "@storyecho/schemas";
import { getTodayQuestion, getTodayStoryForUser } from "@/lib/today-question";
import { isDatabaseConfigured } from "@/lib/story-mapper";
import { resolveCurrentUser } from "@/lib/user/resolve-current-user";

export async function GET(request: Request) {
  const question = await getTodayQuestion();

  let todayStoryId: string | null = null;
  if (isDatabaseConfigured() && question.id) {
    try {
      const user = await resolveCurrentUser(request);
      todayStoryId = await getTodayStoryForUser(user.id, question.id);
    } catch {
      todayStoryId = null;
    }
  }

  const body = TodayQuestionResponseSchema.parse({
    data: { ...question, todayStoryId },
  });
  return Response.json(body);
}
