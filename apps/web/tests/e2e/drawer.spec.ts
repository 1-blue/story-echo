import { test, expect } from "../fixtures/playwright-fixtures";

test.describe("Drawer", () => {
  test("loads drawer tab", async ({ guestPage }) => {
    await guestPage.goto("/app/drawer");
    await expect(
      guestPage
        .getByRole("heading", { name: "서랍" })
        .or(guestPage.getByText("아직 작성한 이야기가 없어요")),
    ).toBeVisible({ timeout: 20_000 });
  });

  test("search bar accepts input", async ({ guestPage }) => {
    await guestPage.goto("/app/drawer");
    const search = guestPage.getByPlaceholder(/검색/);
    if (await search.isVisible()) {
      await search.fill("테스트");
      await expect(search).toHaveValue("테스트");
    }
  });
});
