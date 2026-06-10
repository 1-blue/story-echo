import { afterAll, describe, expect, it } from "vitest";
import { apiFetch } from "../../helpers/api";
import { setupGuestClient } from "../../helpers/auth";
import {
  cleanupTestUserByDeviceId,
  disconnectTestPrisma,
  getFirstQuestionId,
  setUserEmailVerified,
} from "../../helpers/db";
import { createCommunityStory } from "../../helpers/factories";
import {
  parseErrorResponse,
  parsePublicStoryFeed,
  parseQuestion,
  parseQuestionArchiveList,
  parseStory,
  parseTodayQuestion,
  parseUserMe,
} from "../../helpers/parse-api";
import { hasIntegrationEnv } from "../../setup/env";

const integration = hasIntegrationEnv() ? describe : describe.skip;

integration("Questions archive API", () => {
  afterAll(async () => {
    await disconnectTestPrisma();
  });

  it("GET /questions returns archive list", async () => {
    const res = await apiFetch("/api/v1/questions");
    expect(res.status).toBe(200);
    const body = parseQuestionArchiveList(res.json);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toMatchObject({
      id: expect.any(String),
      text: expect.any(String),
      month: expect.any(Number),
      day: expect.any(Number),
      publicStoryCount: expect.any(Number),
    });
  });

  it("GET /questions/[id] returns question detail", async () => {
    const questionId = await getFirstQuestionId();
    expect(questionId).toBeTruthy();

    const res = await apiFetch(`/api/v1/questions/${questionId}`);
    expect(res.status).toBe(200);
    const body = parseQuestion(res.json);
    expect(body.data.id).toBe(questionId);
    expect(body.data.text.length).toBeGreaterThan(0);
  });

  it("GET /questions/[id] returns 404 for unknown id", async () => {
    const res = await apiFetch("/api/v1/questions/00000000-0000-4000-8000-000000000000");
    expect(res.status).toBe(404);
    expect(parseErrorResponse(res.json).message).toMatch(/찾을 수 없/);
  });
});

integration("Public stories questionId filter", () => {
  afterAll(async () => {
    await disconnectTestPrisma();
  });

  it("GET /stories/public?questionId= filters by question", async () => {
    const { deviceId } = await setupGuestClient("public-question-filter");
    const me = await apiFetch("/api/v1/users/me", {}, { deviceId });
    await setUserEmailVerified(parseUserMe(me.json).data.id, true);

    const todayRes = await apiFetch("/api/v1/questions/today", {}, { deviceId });
    const questionId = parseTodayQuestion(todayRes.json).data.id;
    expect(questionId).toBeTruthy();

    const created = await createCommunityStory(`filtered ${Date.now()}`, {
      deviceId,
      questionId: questionId ?? undefined,
    });
    expect(created.status).toBe(201);
    const storyId = parseStory(created.json).data.id;

    const res = await apiFetch(
      `/api/v1/stories/public?questionId=${questionId}&limit=50`,
      {},
      { deviceId },
    );
    expect(res.status).toBe(200);
    const feed = parsePublicStoryFeed(res.json);
    expect(feed.data.some((item) => item.id === storyId)).toBe(true);
    expect(feed.data.every((item) => item.questionText)).toBe(true);

    await cleanupTestUserByDeviceId(deviceId);
  });
});
