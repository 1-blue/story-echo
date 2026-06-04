import { test, expect } from "../fixtures/playwright-fixtures";

test.describe("Home", () => {
  test("shows today question and navigation", async ({ guestPage }) => {
    await guestPage.goto("/app");
    await expect(guestPage.getByRole("link", { name: /이야기하기/ })).toBeVisible();
    await guestPage.getByRole("link", { name: /이야기하기/ }).click();
    await expect(guestPage).toHaveURL(/\/app\/write/);
  });

  test("shows edit CTA after answering today's question", async ({ guestPage }) => {
    await guestPage.goto("/app/write");
    await guestPage.getByRole("textbox").fill("오늘의 이야기 e2e");
    await guestPage.getByRole("button", { name: "저장" }).click();
    await guestPage.waitForURL(/\/app(\/drawer)?/);

    await guestPage.goto("/app");
    await expect(guestPage.getByRole("link", { name: /이야기 수정/ })).toBeVisible();
  });
});
