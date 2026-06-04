import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ReactionPills } from "@/components/community/reaction-pills";

describe("ReactionPills", () => {
  it("calls onToggle when emoji clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(<ReactionPills reactions={[]} onToggle={onToggle} />);

    const heartButton = screen.getByRole("button", { name: /❤️/ });
    await user.click(heartButton);
    expect(onToggle).toHaveBeenCalledWith("heart");
  });

  it("shows reaction counts in read-only mode", () => {
    render(
      <ReactionPills
        reactions={[{ emoji: "heart", count: 3, reactedByMe: false }]}
      />,
    );
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
