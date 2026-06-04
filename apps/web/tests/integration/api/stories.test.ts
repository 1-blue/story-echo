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
import { hasIntegrationEnv } from "../../setup/env";

const integration = hasIntegrationEnv() ? describe : describe.skip;

integration("Questions · Stories API", () => {
  afterAll(async () => {
    await disconnectTestPrisma();
  });

  it("GET /questions/today returns question text", async () => {
    const res = await apiFetch("/api/v1/questions/today");
    expect(res.status).toBe(200);
    expect((res.json as { data: { text: string } }).data.text.length).toBeGreaterThan(0);
  });

  it("POST /stories creates private story for guest", async () => {
    const { deviceId } = await setupGuestClient("story-private");
    const res = await createPrivateStory("integration private story", { deviceId });
    expect(res.status).toBe(201);
    expect(res.json.data.id).toBeTruthy();
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("POST /stories returns 409 when today question story already exists", async () => {
    const { deviceId } = await setupGuestClient("story-today-dup");
    const todayRes = await apiFetch("/api/v1/questions/today", {}, { deviceId });
    const questionId = (todayRes.json as { data: { id: string | null } }).data.id;
    if (!questionId) return;

    const first = await createPrivateStory("today answer one", {
      deviceId,
      questionId,
    });
    expect(first.status).toBe(201);

    const second = await createPrivateStory("today answer two", {
      deviceId,
      questionId,
    });
    expect(second.status).toBe(409);
    expect((second.json as { code: string; storyId: string }).code).toBe("TODAY_STORY_EXISTS");
    expect((second.json as { storyId: string }).storyId).toBe(first.json.data.id);

    const todayAgain = await apiFetch("/api/v1/questions/today", {}, { deviceId });
    expect((todayAgain.json as { data: { todayStoryId: string } }).data.todayStoryId).toBe(
      first.json.data.id,
    );

    await cleanupTestUserByDeviceId(deviceId);
  });

  it("POST /stories rejects community when email not verified", async () => {
    const { deviceId } = await setupGuestClient("story-community-gate");
    const res = await createCommunityStory("should fail", { deviceId });
    expect(res.status).toBe(400);
    expect((res.json as unknown as { code: string }).code).toBe("EMAIL_NOT_VERIFIED");
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("GET /stories/drawer returns user stories", async () => {
    const { deviceId } = await setupGuestClient("story-drawer");
    await createPrivateStory("drawer item", { deviceId });
    const res = await apiFetch("/api/v1/stories/drawer", {}, { deviceId });
    expect(res.status).toBe(200);
    expect((res.json as { data: unknown[] }).data.length).toBeGreaterThan(0);
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("GET/PATCH/DELETE /stories/[id] owner flow", async () => {
    const { deviceId } = await setupGuestClient("story-crud");
    const created = await createPrivateStory("crud story", { deviceId });
    const id = created.json.data.id;

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
    expect((res.json as { message: string }).message).toMatch(/찾을 수 없/);
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("GET /stories/[id] returns 404 for other user", async () => {
    const guestA = await setupGuestClient("story-owner-a");
    const guestB = await setupGuestClient("story-owner-b");
    const created = await createPrivateStory("owner only", { deviceId: guestA.deviceId });
    const id = created.json.data.id;

    const res = await apiFetch(`/api/v1/stories/${id}`, {}, { deviceId: guestB.deviceId });
    expect(res.status).toBe(404);

    await cleanupTestUserByDeviceId(guestA.deviceId);
    await cleanupTestUserByDeviceId(guestB.deviceId);
  });

  it("POST /stories community succeeds when email verified", async () => {
    const { deviceId } = await setupGuestClient("story-verified");
    const me = await apiFetch("/api/v1/users/me", {}, { deviceId });
    const userId = (me.json as { data: { id: string } }).data.id;
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
