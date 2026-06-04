import { test, expect } from "../fixtures/playwright-fixtures";

test.describe("Community write", () => {
  test("guest is redirected to login from community write", async ({ guestPage }) => {
    await guestPage.goto("/app/community/write");
    await expect(guestPage).toHaveURL(/\/app\/settings\/login/, { timeout: 15_000 });
  });

  test("verified member can open write form", async ({ memberPage }) => {
    await memberPage.goto("/app/community/write");
    await expect(memberPage.getByRole("textbox")).toBeVisible({ timeout: 20_000 });
  });
});
