import { expect, test } from "../fixtures/playwright-fixtures";

test.describe("Community flow", () => {
  test("feed → write → detail", async ({ memberPage }) => {
    const bodyText = `community flow ${Date.now()}`;

    await test.step("open community feed", async () => {
      await memberPage.goto("/community");
      await expect(memberPage.getByRole("heading", { name: "커뮤니티" })).toBeVisible();
    });

    await test.step("create post from write page", async () => {
      await memberPage.goto("/community/write");
      await expect(memberPage).toHaveURL(/\/community\/write/);
      await memberPage.locator("textarea").first().fill(bodyText);
      await memberPage.getByRole("button", { name: "게시" }).click();
      await memberPage.waitForURL(/\/community\/[^/]+$/, { timeout: 20_000 });
    });

    await test.step("assert detail content", async () => {
      await expect(memberPage.getByText(bodyText)).toBeVisible();
    });
  });
});
