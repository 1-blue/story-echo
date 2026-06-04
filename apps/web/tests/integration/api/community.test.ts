import { afterAll, describe, expect, it } from "vitest";
import { apiFetch } from "../../helpers/api";
import { setupGuestClient } from "../../helpers/auth";
import {
  cleanupTestUserByDeviceId,
  disconnectTestPrisma,
  setUserEmailVerified,
} from "../../helpers/db";
import {
  createCommunityPost,
  postCommunityComment,
  reportCommunityPost,
} from "../../helpers/factories";
import { parseCommunityPost, parseCommunityPostList, parseUserMe } from "../../helpers/parse-api";
import { hasIntegrationEnv } from "../../setup/env";

const integration = hasIntegrationEnv() ? describe : describe.skip;

integration("Community posts API", () => {
  afterAll(async () => {
    await disconnectTestPrisma();
  });

  it("GET /community/posts returns list", async () => {
    const { deviceId } = await setupGuestClient("community-list");
    const res = await apiFetch("/api/v1/community/posts", {}, { deviceId });
    expect(res.status).toBe(200);
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("GET /community/posts supports cursor pagination", async () => {
    const { deviceId } = await setupGuestClient("community-pagination");
    const me = await apiFetch("/api/v1/users/me", {}, { deviceId });
    await setUserEmailVerified(parseUserMe(me.json).data.id, true);

    await createCommunityPost(`page-a ${Date.now()}`, { deviceId });
    await createCommunityPost(`page-b ${Date.now() + 1}`, { deviceId });

    const first = await apiFetch("/api/v1/community/posts?limit=1", {}, { deviceId });
    expect(first.status).toBe(200);
    const firstJson = parseCommunityPostList(first.json);
    expect(firstJson.data).toHaveLength(1);
    expect(firstJson.meta.pagination.hasMore).toBe(true);
    expect(firstJson.meta.pagination.nextCursor).toBeTruthy();

    const second = await apiFetch(
      `/api/v1/community/posts?limit=1&cursor=${firstJson.meta.pagination.nextCursor}`,
      {},
      { deviceId },
    );
    const secondJson = parseCommunityPostList(second.json);
    expect(secondJson.data[0]?.id).not.toBe(firstJson.data[0]?.id);

    await cleanupTestUserByDeviceId(deviceId);
  });

  it("POST /community/posts requires email verified", async () => {
    const { deviceId } = await setupGuestClient("community-post-gate");
    const res = await createCommunityPost("blocked post", { deviceId });
    expect(res.status).toBe(400);
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("POST /community/posts creates post when verified", async () => {
    const { deviceId } = await setupGuestClient("community-post-create");
    const me = await apiFetch("/api/v1/users/me", {}, { deviceId });
    await setUserEmailVerified(parseUserMe(me.json).data.id, true);

    const res = await createCommunityPost(`community ${Date.now()}`, { deviceId });
    expect(res.status).toBe(201);
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("GET/PATCH/DELETE post owner flow", async () => {
    const { deviceId } = await setupGuestClient("community-crud");
    const me = await apiFetch("/api/v1/users/me", {}, { deviceId });
    await setUserEmailVerified(parseUserMe(me.json).data.id, true);

    const created = await createCommunityPost("crud post", { deviceId });
    const postId = parseCommunityPost(created.json).data.id;

    const getRes = await apiFetch(`/api/v1/community/posts/${postId}`, {}, { deviceId });
    expect(getRes.status).toBe(200);

    const patchRes = await apiFetch(
      `/api/v1/community/posts/${postId}`,
      { method: "PATCH", json: { bodyText: "updated post" } },
      { deviceId },
    );
    expect(patchRes.status).toBe(200);

    const deleteRes = await apiFetch(
      `/api/v1/community/posts/${postId}`,
      { method: "DELETE" },
      { deviceId },
    );
    expect(deleteRes.status).toBe(204);
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("POST comment on post", async () => {
    const author = await setupGuestClient("community-comment-author");
    const meA = await apiFetch("/api/v1/users/me", {}, { deviceId: author.deviceId });
    await setUserEmailVerified(parseUserMe(meA.json).data.id, true);
    const post = await createCommunityPost("comment target", { deviceId: author.deviceId });
    const postId = parseCommunityPost(post.json).data.id;

    const commenter = await setupGuestClient("community-commenter");
    const meB = await apiFetch("/api/v1/users/me", {}, { deviceId: commenter.deviceId });
    await setUserEmailVerified(parseUserMe(meB.json).data.id, true);

    const res = await postCommunityComment(postId, "hello community", {
      deviceId: commenter.deviceId,
    });
    expect(res.status).toBe(201);

    await cleanupTestUserByDeviceId(author.deviceId);
    await cleanupTestUserByDeviceId(commenter.deviceId);
  });

  it("GET /api/v1/notifications returns list", async () => {
    const { deviceId } = await setupGuestClient("community-notify");
    const res = await apiFetch("/api/v1/notifications", {}, { deviceId });
    expect(res.status).toBe(200);
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("POST report on community post", async () => {
    const author = await setupGuestClient("community-report-author");
    const me = await apiFetch("/api/v1/users/me", {}, { deviceId: author.deviceId });
    await setUserEmailVerified(parseUserMe(me.json).data.id, true);
    const post = await createCommunityPost("report me", { deviceId: author.deviceId });
    const postId = parseCommunityPost(post.json).data.id;

    const reporter = await setupGuestClient("community-reporter");
    const res = await reportCommunityPost(postId, { deviceId: reporter.deviceId });
    expect(res.status).toBe(200);

    await cleanupTestUserByDeviceId(author.deviceId);
    await cleanupTestUserByDeviceId(reporter.deviceId);
  });
});
