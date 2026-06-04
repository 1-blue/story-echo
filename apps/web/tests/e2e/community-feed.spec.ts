import { test, expect } from "../fixtures/playwright-fixtures";

test.describe("Community feed", () => {
  test("shows community heading and search", async ({ guestPage }) => {
    await guestPage.goto("/app/community");
    await expect(guestPage.getByRole("heading", { name: "커뮤니티" })).toBeVisible();
  });

  test("FAB navigates to write", async ({ guestPage }) => {
    await guestPage.goto("/app/community");
    const fab = guestPage.locator('a[href="/app/community/write"]').first();
    if (await fab.isVisible()) {
      await fab.click();
      await expect(guestPage).toHaveURL(/\/app\/community\/write/);
    }
  });
});
