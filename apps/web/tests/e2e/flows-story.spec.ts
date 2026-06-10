import { expect, test } from "../fixtures/playwright-fixtures";

test.describe("Story flow", () => {
  test("home → write → drawer", async ({ guestPage }) => {
    const body = `flow story ${Date.now()}`;

    await guestPage.goto("/");
    await guestPage.getByRole("link", { name: /이야기하기/ }).click();
    await guestPage.locator("textarea").fill(body);
    await guestPage.getByRole("button", { name: "저장" }).click();
    await guestPage.waitForURL(/\/drawer/, { timeout: 20_000 }).catch(() => {});

    await guestPage.goto("/drawer");
    await expect(guestPage.getByText(body).first()).toBeVisible({ timeout: 20_000 });
  });
});
