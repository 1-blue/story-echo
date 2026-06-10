import { expect, test } from "../fixtures/playwright-fixtures";
import { hasIntegrationEnv } from "../setup/env";

test.describe("Auth", () => {
  test.skip(!hasIntegrationEnv(), "requires Supabase env");

  test("login page shows form", async ({ guestPage }) => {
    await guestPage.goto("/settings/login");
    await expect(guestPage.getByLabel("이메일")).toBeVisible();
    await expect(guestPage.getByLabel("비밀번호")).toBeVisible();
  });

  test("signup page shows form", async ({ guestPage }) => {
    await guestPage.goto("/settings/signup");
    await expect(guestPage.getByLabel("이메일")).toBeVisible();
  });

  test("password reset shows toast", async ({ guestPage }) => {
    await guestPage.goto("/settings/login");
    await guestPage.getByRole("button", { name: "비밀번호 재설정" }).click();
  });
});
