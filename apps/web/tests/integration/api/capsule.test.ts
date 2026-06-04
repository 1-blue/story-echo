import { afterAll, describe, expect, it } from "vitest";
import { apiFetch } from "../../helpers/api";
import { setupGuestClient } from "../../helpers/auth";
import { cleanupTestUserByDeviceId, disconnectTestPrisma } from "../../helpers/db";
import { createCapsuleStory } from "../../helpers/factories";
import { hasIntegrationEnv } from "../../setup/env";

const integration = hasIntegrationEnv() ? describe : describe.skip;

integration("Capsule API", () => {
  afterAll(async () => {
    await disconnectTestPrisma();
  });

  it("GET /stories/capsule lists sealed and opened", async () => {
    const { deviceId } = await setupGuestClient("capsule-list");
    const unlockAt = new Date(Date.now() + 86_400_000 * 30).toISOString();
    await createCapsuleStory("sealed capsule", unlockAt, { deviceId });

    const res = await apiFetch("/api/v1/stories/capsule", {}, { deviceId });
    expect(res.status).toBe(200);
    const data = (res.json as { data: { sealed: unknown[]; opened: unknown[] } }).data;
    expect(data.sealed.length + data.opened.length).toBeGreaterThan(0);
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("GET /stories/capsule/[id] returns sealed story", async () => {
    const { deviceId } = await setupGuestClient("capsule-detail");
    const unlockAt = new Date(Date.now() + 86_400_000 * 30).toISOString();
    const created = await createCapsuleStory("detail capsule", unlockAt, { deviceId });
    const id = created.json.data.id;

    const res = await apiFetch(`/api/v1/stories/capsule/${id}`, {}, { deviceId });
    expect(res.status).toBe(200);
    expect((res.json as { data: { isCapsuleActive: boolean } }).data.isCapsuleActive).toBe(true);
    await cleanupTestUserByDeviceId(deviceId);
  });

  it("DELETE /stories/[id] removes capsule", async () => {
    const { deviceId } = await setupGuestClient("capsule-delete");
    const unlockAt = new Date(Date.now() + 86_400_000 * 30).toISOString();
    const created = await createCapsuleStory("delete capsule", unlockAt, { deviceId });
    const id = created.json.data.id;

    const res = await apiFetch(`/api/v1/stories/${id}`, { method: "DELETE" }, { deviceId });
    expect(res.status).toBe(204);
    await cleanupTestUserByDeviceId(deviceId);
  });
});
