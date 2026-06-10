/* eslint-disable react-hooks/rules-of-hooks -- Playwright fixture `use` callback, not React */
import { test as base, type Page } from "@playwright/test";
import { randomDeviceId, registerGuest } from "../helpers/auth";
import { getE2EAdminCredentials } from "../setup/env";

type Fixtures = {
  guestPage: Page;
  memberPage: Page;
  deviceId: string;
};

export const test = base.extend<Fixtures>({
  deviceId: async ({}, use) => {
    const deviceId = randomDeviceId("pw");
    await registerGuest(deviceId);
    await use(deviceId);
  },

  guestPage: async ({ page, deviceId }, use) => {
    await page.context().setExtraHTTPHeaders({ "X-Device-Id": deviceId });
    await page.addInitScript((id) => {
      window.localStorage.setItem("storyecho_device_id", id);
    }, deviceId);
    await use(page);
  },

  memberPage: async ({ browser }, use, testInfo) => {
    const { email, password } = getE2EAdminCredentials();
    if (!email || !password) {
      testInfo.skip(true, "E2E admin credentials not configured");
      return;
    }

    const deviceId = randomDeviceId("member");
    await registerGuest(deviceId);

    const context = await browser.newContext({
      extraHTTPHeaders: { "X-Device-Id": deviceId },
    });
    const page = await context.newPage();
    await page.addInitScript((id) => {
      window.localStorage.setItem("storyecho_device_id", id);
    }, deviceId);

    await page.goto("/settings/login");
    await page.getByLabel("이메일").fill(email);
    await page.getByLabel("비밀번호").fill(password);
    await page.getByRole("button", { name: "로그인" }).click();
    await page.waitForURL(/\/settings/, { timeout: 20_000 });
    await page.waitForLoadState("networkidle");

    await use(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";
