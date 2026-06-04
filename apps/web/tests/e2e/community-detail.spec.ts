import { test, expect } from "../fixtures/playwright-fixtures";

test.describe("Community detail", () => {
  test("member can create post and view detail", async ({ memberPage }) => {
    const bodyText = `community detail ${Date.now()}`;

    await memberPage.goto("/community/write");
    await expect(memberPage).toHaveURL(/\/community\/write/);
    await memberPage.locator("textarea").first().fill(bodyText);
    await memberPage.getByRole("button", { name: "게시" }).click();
    await memberPage.waitForURL(/\/community\/[^/]+$/, { timeout: 20_000 });
    await expect(memberPage.getByText(bodyText)).toBeVisible({ timeout: 20_000 });
  });
});
