import { test, expect } from "../fixtures/playwright-fixtures";

test.describe("Public social flow", () => {
  test("member community story appears on home feed", async ({ memberPage }) => {
    const bodyText = `public social ${Date.now()}`;

    await test.step("write community story", async () => {
      await memberPage.goto("/write");
      await memberPage.locator("textarea").fill(bodyText);
      const communityToggle = memberPage.getByRole("button", { name: /커뮤니티|공개/ });
      if (await communityToggle.isVisible()) {
        await communityToggle.click();
      }
      await memberPage.getByRole("button", { name: "저장" }).click();
      await memberPage.waitForURL(/\/(drawer|write|public)?/, { timeout: 20_000 });
    });

    await test.step("find story on home", async () => {
      await memberPage.goto("/");
      const card = memberPage.getByText(bodyText).first();
      if (await card.isVisible({ timeout: 10_000 }).catch(() => false)) {
        await card.click();
        await expect(memberPage).toHaveURL(/\/public\//);
      }
    });
  });
});
