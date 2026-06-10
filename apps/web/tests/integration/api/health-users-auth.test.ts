import { afterAll, describe, expect, it } from "vitest";
import { apiFetch } from "../../helpers/api";
import { loginAsAdmin, setupGuestClient } from "../../helpers/auth";
import { cleanupTestUserByDeviceId, disconnectTestPrisma } from "../../helpers/db";
import { parseUserMe, parseTodayQuestion } from "../../helpers/parse-api";
import { hasIntegrationEnv } from "../../setup/env";

const integration = hasIntegrationEnv() ? describe : describe.skip;

integration("Health · Users · Auth API", () => {
  afterAll(async () => {
    await disconnectTestPrisma();
  });

  it("GET /health returns 200", async () => {
    const res = await apiFetch("/api/v1/health");
    expect(res.status).toBe(200);
  });

  it("POST /users/guest creates guest user", async () => {
    const { deviceId } = await setupGuestClient("guest-health");
    const res = await apiFetch("/api/v1/users/guest", {
      method: "POST",
      json: { deviceId },
    });
    expect(res.status).toBe(200);
    expect(res.json).toHaveProperty("data");
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("GET /users/me requires device or session", async () => {
    const res = await apiFetch("/api/v1/users/me");
    expect(res.status).toBe(401);
  });

  it("GET /users/me returns guest profile", async () => {
    const { deviceId } = await setupGuestClient("guest-me");
    const res = await apiFetch("/api/v1/users/me", {}, { deviceId });
    expect(res.status).toBe(200);
    expect(parseUserMe(res.json).data.role).toBe("guest");
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("PATCH /users/me updates nickname", async () => {
    const { deviceId } = await setupGuestClient("guest-patch");
    const res = await apiFetch(
      "/api/v1/users/me",
      { method: "PATCH", json: { nickname: "테스트닉네임" } },
      { deviceId },
    );
    expect(res.status).toBe(200);
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("POST /auth/login fails with bad password", async () => {
    const email = process.env.E2E_ADMIN_EMAIL ?? process.env.SEED_ADMIN_EMAIL;
    if (!email) return;
    const res = await apiFetch("/api/v1/auth/login", {
      method: "POST",
      json: { email, password: "wrong-password-123" },
    });
    expect(res.status).toBe(400);
  });

  it("POST /auth/login succeeds for admin", async () => {
    const { cookie, status } = await loginAsAdmin();
    expect(status).toBe(200);
    expect(cookie.length).toBeGreaterThanOrEqual(0);
  });

  it("POST /auth/login merges guest data when deviceId is present", async () => {
    const { deviceId } = await setupGuestClient("guest-login-merge");
    const todayRes = await apiFetch("/api/v1/questions/today", {}, { deviceId });
    const questionId = parseTodayQuestion(todayRes.json).data.id;
    if (!questionId) return;

    const storyRes = await apiFetch(
      "/api/v1/stories",
      {
        method: "POST",
        json: {
          questionId,
          bodyText: "게스트 merge 테스트 이야기",
          photoUrls: [],
          visibility: "private",
          isCapsule: false,
        },
      },
      { deviceId },
    );
    expect(storyRes.status).toBe(201);

    const { cookie, status, data } = await loginAsAdmin(deviceId);
    expect(status).toBe(200);
    expect((data as { data?: { role?: string } }).data?.role).not.toBe("guest");

    const meRes = await apiFetch("/api/v1/users/me", {}, { deviceId, cookie });
    expect(meRes.status).toBe(200);
    expect(parseUserMe(meRes.json).data.role).not.toBe("guest");

    await cleanupTestUserByDeviceId(deviceId);
  });

  it("POST /auth/logout returns 200", async () => {
    const { cookie, status: loginStatus } = await loginAsAdmin();
    expect(loginStatus).toBe(200);
    const res = await apiFetch("/api/v1/auth/logout", { method: "POST" }, { cookie });
    expect(res.status).toBe(200);
  });
});
