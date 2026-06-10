import { expect, test } from "../fixtures/playwright-fixtures";

test.describe("Community write", () => {
  test("guest is redirected to login from community write", async ({ guestPage }) => {
    await guestPage.goto("/community/write");
    await expect(guestPage).toHaveURL(/\/settings\/login/, { timeout: 15_000 });
  });

  test("verified member can open write form", async ({ memberPage }) => {
    await memberPage.goto("/community/write");
    await expect(memberPage).toHaveURL(/\/community\/write/, { timeout: 20_000 });
    await expect(memberPage.locator("textarea").first()).toBeVisible({ timeout: 20_000 });
  });
});
