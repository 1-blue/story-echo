import { afterAll, describe, expect, it } from "vitest";
import { apiFetch } from "../../helpers/api";
import { setupGuestClient } from "../../helpers/auth";
import {
  cleanupTestUserByDeviceId,
  countStoryReports,
  disconnectTestPrisma,
  isStoryHidden,
  setUserEmailVerified,
} from "../../helpers/db";
import {
  createCommunityStory,
  postStoryComment,
  reportStory,
  toggleStoryReaction,
} from "../../helpers/factories";
import { hasIntegrationEnv } from "../../setup/env";

const integration = hasIntegrationEnv() ? describe : describe.skip;

integration("Public Story social API", () => {
  afterAll(async () => {
    await disconnectTestPrisma();
  });

  async function createPublicStory(deviceId: string) {
    const me = await apiFetch("/api/v1/users/me", {}, { deviceId });
    await setUserEmailVerified((me.json as { data: { id: string } }).data.id, true);
    const created = await createCommunityStory(`public ${Date.now()}`, { deviceId });
    expect(created.status).toBe(201);
    return created.json.data.id;
  }

  it("GET /stories/public lists community stories", async () => {
    const { deviceId } = await setupGuestClient("public-list");
    await createPublicStory(deviceId);
    const res = await apiFetch("/api/v1/stories/public", {}, { deviceId });
    expect(res.status).toBe(200);
    expect(Array.isArray((res.json as { data: unknown[] }).data)).toBe(true);
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("GET /stories/public/[id] includes comments", async () => {
    const { deviceId } = await setupGuestClient("public-detail");
    const storyId = await createPublicStory(deviceId);
    const res = await apiFetch(`/api/v1/stories/public/${storyId}`, {}, { deviceId });
    expect(res.status).toBe(200);
    expect((res.json as { data: { comments: unknown[] } }).data.comments).toBeDefined();
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("POST comment requires email verified", async () => {
    const author = await setupGuestClient("public-author");
    const storyId = await createPublicStory(author.deviceId);

    const guest = await setupGuestClient("public-comment-gate");
    const res = await postStoryComment(storyId, "blocked comment", { deviceId: guest.deviceId });
    expect(res.status).toBe(400);

    await cleanupTestUserByDeviceId(author.deviceId);
    await cleanupTestUserByDeviceId(guest.deviceId);
  });

  it("POST comment and reaction flow", async () => {
    const author = await setupGuestClient("public-social-author");
    const storyId = await createPublicStory(author.deviceId);

    const commenter = await setupGuestClient("public-social-commenter");
    const me = await apiFetch("/api/v1/users/me", {}, { deviceId: commenter.deviceId });
    await setUserEmailVerified((me.json as { data: { id: string } }).data.id, true);

    const commentRes = await postStoryComment(storyId, "nice story", {
      deviceId: commenter.deviceId,
    });
    expect(commentRes.status).toBe(201);

    const reactionRes = await toggleStoryReaction(storyId, "heart", {
      deviceId: commenter.deviceId,
    });
    expect(reactionRes.status).toBe(200);

    await cleanupTestUserByDeviceId(author.deviceId);
    await cleanupTestUserByDeviceId(commenter.deviceId);
  });

  it("POST report hides story after 3 reports", async () => {
    const author = await setupGuestClient("public-report-author");
    const storyId = await createPublicStory(author.deviceId);
    const reporterDeviceIds: string[] = [];

    for (let i = 0; i < 3; i += 1) {
      const reporter = await setupGuestClient(`public-report-${i}`);
      reporterDeviceIds.push(reporter.deviceId);
      const res = await reportStory(storyId, { deviceId: reporter.deviceId });
      expect(res.status).toBe(200);
    }

    expect(await countStoryReports(storyId)).toBeGreaterThanOrEqual(3);
    expect(await isStoryHidden(storyId)).toBe(true);

    for (const deviceId of reporterDeviceIds) {
      await cleanupTestUserByDeviceId(deviceId);
    }
    await cleanupTestUserByDeviceId(author.deviceId);
  });
});
