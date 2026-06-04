import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";
import { VisibilityToggle } from "@/app/app/write/_components/visibility-toggle";

vi.mock("sonner", () => ({
  toast: vi.fn(),
}));

describe("VisibilityToggle", () => {
  it("blocks community when not allowed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <VisibilityToggle
        value="private"
        onChange={onChange}
        capabilities={{ canUseCommunity: false, isGuest: true }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "오늘 공개하기" }));
    expect(onChange).not.toHaveBeenCalled();
    expect(toast).toHaveBeenCalled();
  });

  it("allows private selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <VisibilityToggle
        value="community"
        onChange={onChange}
        capabilities={{ canUseCommunity: false, isGuest: true }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "나만 보기" }));
    expect(onChange).toHaveBeenCalledWith("private");
  });
});
