import { test, expect } from "../fixtures/playwright-fixtures";

test.describe("Capsule", () => {
  test("loads capsule page", async ({ guestPage }) => {
    await guestPage.goto("/app/capsule");
    await expect(
      guestPage.getByRole("heading", { name: /타임캡슐|아직 타임캡슐이 없어요/ }),
    ).toBeVisible();
  });
});
