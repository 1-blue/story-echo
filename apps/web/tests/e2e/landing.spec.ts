import { test, expect } from "../fixtures/playwright-fixtures";

test.describe("Home", () => {
  test("shows today question at root", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "이야기해줘" })).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
  });
});
