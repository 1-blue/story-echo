import { afterAll, describe, expect, it } from "vitest";
import { dispatchDailyNotifications } from "@/lib/notifications/dispatch-daily";
import { getKstDayRangeUtc } from "@/lib/notifications/kst";
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

  it("dispatchDailyNotifications creates daily_question_reminder once per KST day", async () => {
    const { deviceId } = await setupGuestClient("notify-daily");
    const me = await apiFetch("/api/v1/users/me", {}, { deviceId });
    const userId = parseUserMe(me.json).data.id;
    await prisma.user.update({
      where: { id: userId },
      data: { notificationsEnabled: true, role: "member", email: "daily@test.com" },
    });

    const first = await dispatchDailyNotifications();
    expect(first.dailyReminders).toBeGreaterThanOrEqual(1);

    const second = await dispatchDailyNotifications();
    expect(second.dailyReminders).toBe(0);

    const { start, end } = getKstDayRangeUtc();
    const count = await prisma.notification.count({
      where: {
        recipientUserId: userId,
        type: "daily_question_reminder",
        createdAt: { gte: start, lt: end },
      },
    });
    expect(count).toBe(1);

    await cleanupTestUserByDeviceId(deviceId);
  });
});
