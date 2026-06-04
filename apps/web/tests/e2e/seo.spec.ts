import { test, expect } from "../fixtures/playwright-fixtures";

test.describe("SEO", () => {
  test("landing page has title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/StoryEcho/i);
  });

  test("drawer is not indexed in robots meta", async ({ guestPage }) => {
    await guestPage.goto("/drawer");
    const robots = await guestPage.locator('meta[name="robots"]').getAttribute("content");
    if (robots) {
      expect(robots.toLowerCase()).toMatch(/noindex|nofollow/);
    }
  });
});
