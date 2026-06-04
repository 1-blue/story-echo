import { afterAll, describe, expect, it } from "vitest";
import { apiFetch } from "../../helpers/api";
import { setupGuestClient } from "../../helpers/auth";
import {
  cleanupTestUserByDeviceId,
  disconnectTestPrisma,
  getFirstQuestionId,
  setUserEmailVerified,
} from "../../helpers/db";
import { createPrivateStory, createCommunityStory } from "../../helpers/factories";
import {
  parseDrawerList,
  parseEmailNotVerifiedError,
  parseErrorResponse,
  parseStory,
  parseTodayQuestion,
  parseTodayStoryExistsError,
  parseUserMe,
} from "../../helpers/parse-api";
import { hasIntegrationEnv } from "../../setup/env";

const integration = hasIntegrationEnv() ? describe : describe.skip;

integration("Questions · Stories API", () => {
  afterAll(async () => {
    await disconnectTestPrisma();
  });

  it("GET /questions/today returns question text", async () => {
    const res = await apiFetch("/api/v1/questions/today");
    expect(res.status).toBe(200);
    expect(parseTodayQuestion(res.json).data.text.length).toBeGreaterThan(0);
  });

  it("POST /stories creates private story for guest", async () => {
    const { deviceId } = await setupGuestClient("story-private");
    const res = await createPrivateStory("integration private story", { deviceId });
    expect(res.status).toBe(201);
    expect(parseStory(res.json).data.id).toBeTruthy();
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("POST /stories returns 409 when today question story already exists", async () => {
    const { deviceId } = await setupGuestClient("story-today-dup");
    const todayRes = await apiFetch("/api/v1/questions/today", {}, { deviceId });
    const questionId = parseTodayQuestion(todayRes.json).data.id;
    if (!questionId) return;

    const first = await createPrivateStory("today answer one", {
      deviceId,
      questionId,
    });
    expect(first.status).toBe(201);
    const firstStoryId = parseStory(first.json).data.id;

    const second = await createPrivateStory("today answer two", {
      deviceId,
      questionId,
    });
    expect(second.status).toBe(409);
    const error = parseTodayStoryExistsError(second.json);
    expect(error.code).toBe("TODAY_STORY_EXISTS");
    expect(error.storyId).toBe(firstStoryId);

    const todayAgain = await apiFetch("/api/v1/questions/today", {}, { deviceId });
    expect(parseTodayQuestion(todayAgain.json).data.todayStoryId).toBe(firstStoryId);

    await cleanupTestUserByDeviceId(deviceId);
  });

  it("POST /stories rejects community when email not verified", async () => {
    const { deviceId } = await setupGuestClient("story-community-gate");
    const res = await createCommunityStory("should fail", { deviceId });
    expect(res.status).toBe(400);
    expect(parseEmailNotVerifiedError(res.json).code).toBe("EMAIL_NOT_VERIFIED");
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("GET /stories/drawer returns user stories", async () => {
    const { deviceId } = await setupGuestClient("story-drawer");
    await createPrivateStory("drawer item", { deviceId });
    const res = await apiFetch("/api/v1/stories/drawer", {}, { deviceId });
    expect(res.status).toBe(200);
    expect(parseDrawerList(res.json).data.length).toBeGreaterThan(0);
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("GET/PATCH/DELETE /stories/[id] owner flow", async () => {
    const { deviceId } = await setupGuestClient("story-crud");
    const created = await createPrivateStory("crud story", { deviceId });
    const id = parseStory(created.json).data.id;

    const getRes = await apiFetch(`/api/v1/stories/${id}`, {}, { deviceId });
    expect(getRes.status).toBe(200);

    const patchRes = await apiFetch(
      `/api/v1/stories/${id}`,
      { method: "PATCH", json: { isBookmarked: true } },
      { deviceId },
    );
    expect(patchRes.status).toBe(200);

    const deleteRes = await apiFetch(`/api/v1/stories/${id}`, { method: "DELETE" }, { deviceId });
    expect(deleteRes.status).toBe(204);
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("GET /stories/[id] returns Korean message on 404", async () => {
    const { deviceId } = await setupGuestClient("story-404-msg");
    const res = await apiFetch(
      `/api/v1/stories/00000000-0000-4000-8000-000000000099`,
      {},
      { deviceId },
    );
    expect(res.status).toBe(404);
    expect(parseErrorResponse(res.json).message).toMatch(/찾을 수 없/);
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("GET /stories/[id] returns 404 for other user", async () => {
    const guestA = await setupGuestClient("story-owner-a");
    const guestB = await setupGuestClient("story-owner-b");
    const created = await createPrivateStory("owner only", { deviceId: guestA.deviceId });
    const id = parseStory(created.json).data.id;

    const res = await apiFetch(`/api/v1/stories/${id}`, {}, { deviceId: guestB.deviceId });
    expect(res.status).toBe(404);

    await cleanupTestUserByDeviceId(guestA.deviceId);
    await cleanupTestUserByDeviceId(guestB.deviceId);
  });

  it("POST /stories community succeeds when email verified", async () => {
    const { deviceId } = await setupGuestClient("story-verified");
    const me = await apiFetch("/api/v1/users/me", {}, { deviceId });
    const userId = parseUserMe(me.json).data.id;
    await setUserEmailVerified(userId, true);
    const questionId = await getFirstQuestionId();

    const res = await createCommunityStory("verified community story", {
      deviceId,
      questionId: questionId ?? undefined,
    });
    expect(res.status).toBe(201);
    await cleanupTestUserByDeviceId(deviceId);
  });
});
