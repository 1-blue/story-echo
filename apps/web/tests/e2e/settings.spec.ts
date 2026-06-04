import { test, expect } from "../fixtures/playwright-fixtures";

test.describe("Settings", () => {
  test("shows settings sections", async ({ guestPage }) => {
    await guestPage.goto("/app/settings");
    await guestPage.waitForLoadState("networkidle");
    await expect(guestPage.getByRole("heading", { name: "설정" })).toBeVisible();
    await expect(guestPage.getByText("알림 받기")).toBeVisible();
  });

  test("navigates to login", async ({ guestPage }) => {
    await guestPage.goto("/app/settings");
    const loginLink = guestPage.getByRole("link", { name: "로그인" });
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(guestPage).toHaveURL(/\/app\/settings\/login/);
    }
  });
});
