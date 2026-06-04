import { test, expect } from "../fixtures/playwright-fixtures";
import { createCapsuleStory } from "../helpers/factories";
import { hasIntegrationEnv } from "../setup/env";

test.describe("Capsule flow", () => {
  test.skip(!hasIntegrationEnv(), "requires DB");

  test("shows sealed overlay on future capsule", async ({ guestPage, deviceId }) => {
    const bodyText = `capsule flow ${Date.now()}`;
    const unlockAt = new Date(Date.now() + 86_400_000).toISOString();
    const { json } = await createCapsuleStory(bodyText, unlockAt, { deviceId });
    const capsuleId = (json as { data: { id: string } }).data.id;

    await guestPage.goto(`/capsule/${capsuleId}`);
    await expect(guestPage.getByText("봉인된 편지예요")).toBeVisible({ timeout: 20_000 });
  });
});
