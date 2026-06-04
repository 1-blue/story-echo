import { test } from "../fixtures/playwright-fixtures";

test.describe("Write story", () => {
  test("creates private story from write page", async ({ guestPage }) => {
    await guestPage.goto("/write");
    await guestPage.locator("textarea").fill(`E2E story ${Date.now()}`);
    await guestPage.getByRole("button", { name: "저장" }).click();
    await guestPage.waitForURL(/\/(drawer|write)?/, { timeout: 20_000 });
  });
});
