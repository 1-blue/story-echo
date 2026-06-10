import { afterEach, describe, expect, it } from "vitest";
import { GET, POST } from "@/app/api/v1/cron/notifications/route";

describe("cron notifications route", () => {
  const originalSecret = process.env.CRON_SECRET;

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.CRON_SECRET;
    } else {
      process.env.CRON_SECRET = originalSecret;
    }
  });

  it("GET returns 401 without authorization header", async () => {
    process.env.CRON_SECRET = "test-cron-secret";
    const response = await GET(new Request("http://local/api/v1/cron/notifications"));
    expect(response.status).toBe(401);
  });

  it("POST returns 401 without authorization header", async () => {
    process.env.CRON_SECRET = "test-cron-secret";
    const response = await POST(new Request("http://local/api/v1/cron/notifications"));
    expect(response.status).toBe(401);
  });
});
