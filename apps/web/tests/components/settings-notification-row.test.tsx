import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { UserMe } from "@storyecho/schemas";
import { SettingsNotificationRow } from "@/app/(shell)/settings/_components/settings-notification-row";

const mutateAsync = vi.fn().mockResolvedValue({ data: {} });

vi.mock("@storyecho/api-client", () => ({
  usePatchApiV1UsersMe: () => ({ mutateAsync, isPending: false }),
  getGetApiV1UsersMeQueryKey: () => ["/api/v1/users/me"],
}));

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

const user: UserMe = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  role: "guest",
  email: null,
  nickname: "게스트123",
  fontSize: "md",
  notificationsEnabled: false,
  adFree: false,
};

function renderWithQuery(ui: ReactNode) {
  const client = new QueryClient();
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("SettingsNotificationRow", () => {
  it("renders notification switch", () => {
    renderWithQuery(<SettingsNotificationRow user={user} />);
    expect(screen.getByText("알림 받기")).toBeInTheDocument();
  });

  it("calls patch when toggled", async () => {
    const uiUser = userEvent.setup();
    renderWithQuery(<SettingsNotificationRow user={user} />);
    const toggle = screen.getByRole("switch");
    await uiUser.click(toggle);
    expect(mutateAsync).toHaveBeenCalledWith({ data: { notificationsEnabled: true } });
  });
});
