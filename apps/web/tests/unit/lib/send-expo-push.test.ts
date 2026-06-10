import { describe, expect, it, vi } from "vitest";
import { sendExpoPushNotifications } from "@/lib/notifications/send-expo-push";

describe("sendExpoPushNotifications", () => {
  it("returns zero counts for empty messages", async () => {
    const fetchImpl = vi.fn();
    const result = await sendExpoPushNotifications([], fetchImpl);
    expect(result).toEqual({ sent: 0, failed: 0 });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("counts ok and error tickets", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ status: "ok" }, { status: "error", message: "bad token" }],
      }),
    });

    const result = await sendExpoPushNotifications(
      [
        {
          to: "ExponentPushToken[a]",
          title: "오늘의 질문",
          body: "test",
        },
        {
          to: "ExponentPushToken[b]",
          title: "오늘의 질문",
          body: "test",
        },
      ],
      fetchImpl,
    );

    expect(result).toEqual({ sent: 1, failed: 1 });
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://exp.host/--/api/v2/push/send",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("counts all failed when HTTP response is not ok", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false });

    const result = await sendExpoPushNotifications(
      [
        {
          to: "ExponentPushToken[a]",
          title: "오늘의 질문",
          body: "test",
        },
      ],
      fetchImpl,
    );

    expect(result).toEqual({ sent: 0, failed: 1 });
  });
});
