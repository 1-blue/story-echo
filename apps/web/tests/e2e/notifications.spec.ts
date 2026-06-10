import { expect, test } from "../fixtures/playwright-fixtures";

test.describe("Notifications drawer", () => {
  test("opens notification drawer from header", async ({ guestPage }) => {
    await guestPage.goto("/");
    await guestPage.getByRole("button", { name: "알림" }).click();
    await expect(guestPage.getByRole("heading", { name: "알림" })).toBeVisible();
    await expect(guestPage.getByText("알림이 없어요")).toBeVisible();
  });

  test("closes notification drawer with X button", async ({ guestPage }) => {
    await guestPage.goto("/");
    await guestPage.getByRole("button", { name: "알림" }).click();
    await expect(guestPage.getByRole("heading", { name: "알림" })).toBeVisible();
    await guestPage.getByRole("button", { name: "알림 닫기" }).click();
    await expect(guestPage.getByRole("heading", { name: "알림" })).not.toBeVisible();
  });

  test("redirects legacy notifications page to app", async ({ guestPage }) => {
    await guestPage.goto("/notifications");
    await expect(guestPage).toHaveURL(/\/$/);
  });
});
