import { test, expect } from "../fixtures/playwright-fixtures";

test.describe("Landing", () => {
  test("shows hero and navigates to app", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "이야기해줘" })).toBeVisible();
    await page.getByRole("link", { name: /앱 미리보기/ }).click();
    await expect(page).toHaveURL(/\/app/);
  });
});
