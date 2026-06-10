import { expect, test } from "../fixtures/playwright-fixtures";

test.describe("Home", () => {
  test("shows today question and navigation", async ({ guestPage }) => {
    await guestPage.goto("/");
    await expect(guestPage.getByRole("link", { name: /이야기하기/ })).toBeVisible();
    await guestPage.getByRole("link", { name: /이야기하기/ }).click();
    await expect(guestPage).toHaveURL(/\/write/);
  });

  test("shows edit CTA after answering today's question", async ({ guestPage }) => {
    await guestPage.goto("/write");
    await guestPage.locator("textarea").fill("오늘의 이야기 e2e");
    await guestPage.getByRole("button", { name: "저장" }).click();
    await guestPage.waitForURL(/\/drawer/, { timeout: 20_000 });

    await guestPage.goto("/");
    await expect(guestPage.getByRole("link", { name: /이야기 수정/ })).toBeVisible({
      timeout: 20_000,
    });
  });
});
