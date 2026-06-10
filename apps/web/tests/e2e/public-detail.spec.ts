import { expect, test } from "../fixtures/playwright-fixtures";
import { hasIntegrationEnv } from "../setup/env";

test.describe("Public detail", () => {
  test.skip(!hasIntegrationEnv(), "requires DB");

  test("public story detail loads when story exists", async ({ guestPage }) => {
    await guestPage.goto("/");
    const card = guestPage.locator('a[href^="/public/"]').first();
    if (await card.isVisible()) {
      await card.click();
      await expect(guestPage).toHaveURL(/\/public\//);
    }
  });
});
