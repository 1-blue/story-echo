import { describe, expect, it } from "vitest";
import { apiFetch } from "../../helpers/api";
import { setupGuestClient } from "../../helpers/auth";
import { cleanupTestUserByDeviceId } from "../../helpers/db";
import { hasAwsEnv, hasIntegrationEnv } from "../../setup/env";

const integration = hasIntegrationEnv() ? describe : describe.skip;

integration("Uploads API", () => {
  it("POST /uploads/presign returns 503 without AWS", async () => {
    if (hasAwsEnv()) return;
    const { deviceId } = await setupGuestClient("presign-no-aws");
    const res = await apiFetch(
      "/api/v1/uploads/presign",
      {
        method: "POST",
        json: { contentType: "image/jpeg", fileName: "test.jpg" },
      },
      { deviceId },
    );
    expect([503, 400]).toContain(res.status);
    await cleanupTestUserByDeviceId(deviceId);
  });
});
