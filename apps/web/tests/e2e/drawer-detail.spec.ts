import { expect, test } from "../fixtures/playwright-fixtures";

test.describe("Drawer detail", () => {
  test("shows story body after navigating from drawer list", async ({ guestPage }) => {
    const bodyText = `drawer detail ${Date.now()}`;

    await guestPage.goto("/write");
    await guestPage.locator("textarea").fill(bodyText);
    await guestPage.getByRole("button", { name: "저장" }).click();
    await guestPage.waitForURL(/\/drawer/, { timeout: 20_000 });

    await guestPage.getByText(bodyText).first().click();
    await expect(guestPage).toHaveURL(/\/drawer\//);
    await expect(guestPage.getByText(bodyText).first()).toBeVisible({ timeout: 20_000 });
  });
});
