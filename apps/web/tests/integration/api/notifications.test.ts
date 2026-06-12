import { afterAll, describe, expect, it, vi } from "vitest";
import { dispatchDailyNotifications } from "@/lib/notifications/dispatch-daily";
import { prisma } from "@/lib/prisma";
import { apiFetch } from "../../helpers/api";
import { setupGuestClient } from "../../helpers/auth";
import { cleanupTestUserByDeviceId, setUserEmailVerified } from "../../helpers/db";
import { createCommunityPost } from "../../helpers/factories";
import { parseCommunityPost, parseNotificationList, parseUserMe } from "../../helpers/parse-api";
import { hasIntegrationEnv } from "../../setup/env";

const integration = hasIntegrationEnv() ? describe : describe.skip;

integration("notifications API", () => {
  afterAll(async () => {
    const { disconnectTestPrisma } = await import("../../helpers/db");
    await disconnectTestPrisma();
  });

  it("GET /api/v1/notifications returns list", async () => {
    const { deviceId } = await setupGuestClient("notify-list");
    const res = await apiFetch("/api/v1/notifications", {}, { deviceId });
    expect(res.status).toBe(200);
    const body = parseNotificationList(res.json);
    expect(Array.isArray(body.data)).toBe(true);
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("creates comment_on_post notification", async () => {
    const author = await setupGuestClient("notify-post-author");
    const meA = await apiFetch("/api/v1/users/me", {}, { deviceId: author.deviceId });
    await setUserEmailVerified(parseUserMe(meA.json).data.id, true);
    const post = await createCommunityPost("notify target", { deviceId: author.deviceId });
    const postId = parseCommunityPost(post.json).data.id;

    const commenter = await setupGuestClient("notify-post-commenter");
    const meB = await apiFetch("/api/v1/users/me", {}, { deviceId: commenter.deviceId });
    await setUserEmailVerified(parseUserMe(meB.json).data.id, true);

    const commentRes = await apiFetch(
      `/api/v1/community/posts/${postId}/comments`,
      {
        method: "POST",
        json: { bodyText: "hello" },
      },
      { deviceId: commenter.deviceId },
    );
    expect(commentRes.status).toBe(201);

    const authorId = parseUserMe(meA.json).data.id;
    const row = await prisma.notification.findFirst({
      where: { recipientUserId: authorId, type: "comment_on_post", postId },
    });
    expect(row).not.toBeNull();

    await cleanupTestUserByDeviceId(author.deviceId);
    await cleanupTestUserByDeviceId(commenter.deviceId);
  });

  it("DELETE /api/v1/notifications deletes by id and read notifications", async () => {
    const author = await setupGuestClient("notify-delete-author");
    const meA = await apiFetch("/api/v1/users/me", {}, { deviceId: author.deviceId });
    await setUserEmailVerified(parseUserMe(meA.json).data.id, true);
    const post = await createCommunityPost("notify delete target", { deviceId: author.deviceId });
    const postId = parseCommunityPost(post.json).data.id;

    const commenter = await setupGuestClient("notify-delete-commenter");
    const meB = await apiFetch("/api/v1/users/me", {}, { deviceId: commenter.deviceId });
    await setUserEmailVerified(parseUserMe(meB.json).data.id, true);

    await apiFetch(
      `/api/v1/community/posts/${postId}/comments`,
      { method: "POST", json: { bodyText: "hello" } },
      { deviceId: commenter.deviceId },
    );

    const authorId = parseUserMe(meA.json).data.id;
    const row = await prisma.notification.findFirst({
      where: { recipientUserId: authorId, type: "comment_on_post", postId },
    });
    expect(row).not.toBeNull();

    await apiFetch(
      "/api/v1/notifications",
      { method: "PATCH", json: { ids: [row!.id] } },
      { deviceId: author.deviceId },
    );

    const deleteReadRes = await apiFetch(
      "/api/v1/notifications",
      { method: "DELETE", json: { deleteRead: true } },
      { deviceId: author.deviceId },
    );
    expect(deleteReadRes.status).toBe(200);

    const afterDelete = await prisma.notification.findFirst({ where: { id: row!.id } });
    expect(afterDelete).toBeNull();

    await cleanupTestUserByDeviceId(author.deviceId);
    await cleanupTestUserByDeviceId(commenter.deviceId);
  });

  it("PUT/DELETE /users/me/push-token registers and removes token", async () => {
    const { deviceId } = await setupGuestClient("notify-push-token");
    const putRes = await apiFetch(
      "/api/v1/users/me/push-token",
      {
        method: "PUT",
        json: { expoPushToken: "ExponentPushToken[api-test]", platform: "android" },
      },
      { deviceId },
    );
    expect(putRes.status).toBe(200);

    const me = await apiFetch("/api/v1/users/me", {}, { deviceId });
    const userId = parseUserMe(me.json).data.id;
    const row = await prisma.pushToken.findFirst({ where: { userId } });
    expect(row?.expoPushToken).toBe("ExponentPushToken[api-test]");

    const deleteRes = await apiFetch(
      "/api/v1/users/me/push-token",
      { method: "DELETE" },
      { deviceId },
    );
    expect(deleteRes.status).toBe(200);

    const afterDelete = await prisma.pushToken.findFirst({ where: { userId } });
    expect(afterDelete).toBeNull();

    await cleanupTestUserByDeviceId(deviceId);
  });

  it("dispatchDailyNotifications sends on every invocation", async () => {
    const { deviceId } = await setupGuestClient("notify-daily");
    const me = await apiFetch("/api/v1/users/me", {}, { deviceId });
    const userId = parseUserMe(me.json).data.id;
    await prisma.user.update({
      where: { id: userId },
      data: { notificationsEnabled: true },
    });
    await prisma.pushToken.create({
      data: {
        userId,
        expoPushToken: "ExponentPushToken[integration-test]",
        platform: "android",
      },
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ status: "ok" }] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const first = await dispatchDailyNotifications();
    expect(first.dailyReminders).toBeGreaterThanOrEqual(1);
    expect(first.pushSent).toBeGreaterThanOrEqual(1);

    const second = await dispatchDailyNotifications();
    expect(second.dailyReminders).toBeGreaterThanOrEqual(1);
    expect(second.pushSent).toBeGreaterThanOrEqual(1);

    vi.unstubAllGlobals();
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("dispatchDailyNotifications skips phone push when push token is missing", async () => {
    const { deviceId } = await setupGuestClient("notify-no-push");
    const me = await apiFetch("/api/v1/users/me", {}, { deviceId });
    const userId = parseUserMe(me.json).data.id;
    await prisma.user.update({
      where: { id: userId },
      data: { notificationsEnabled: true },
    });

    const result = await dispatchDailyNotifications();
    expect(result.dailyReminders).toBeGreaterThanOrEqual(1);
    expect(result.pushSent).toBe(0);
    expect(result.pushSkippedNoToken).toBeGreaterThanOrEqual(1);

    await cleanupTestUserByDeviceId(deviceId);
  });
});
