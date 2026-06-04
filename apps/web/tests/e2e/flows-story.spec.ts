import { test, expect } from "../fixtures/playwright-fixtures";

test.describe("Story flow", () => {
  test("home → write → drawer", async ({ guestPage }) => {
    const body = `flow story ${Date.now()}`;

    await guestPage.goto("/app");
    await guestPage.getByRole("link", { name: /이야기하기/ }).click();
    await guestPage.locator("textarea").fill(body);
    await guestPage.getByRole("button", { name: "저장" }).click();
    await guestPage.waitForURL(/\/app\/drawer/, { timeout: 20_000 }).catch(() => {});

    await guestPage.goto("/app/drawer");
    await expect(guestPage.getByText(body).first()).toBeVisible({ timeout: 20_000 });
  });
});
