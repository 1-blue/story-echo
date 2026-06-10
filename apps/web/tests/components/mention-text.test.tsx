import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MentionText } from "@/components/community/mention-text";

describe("MentionText", () => {
  it("renders @mentions with highlight class", () => {
    render(<MentionText text="안녕 @홍길동 님" />);
    const mention = screen.getByText("@홍길동");
    expect(mention.className).toContain("text-community-green");
  });

  it("renders https links that open in a new tab", () => {
    render(<MentionText text="참고 https://example.com/path" />);
    const link = screen.getByRole("link", { name: "https://example.com/path" });
    expect(link).toHaveAttribute("href", "https://example.com/path");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders email as mailto link", () => {
    render(<MentionText text="연락 developer98.ninja@gmail.com 주세요" />);
    const link = screen.getByRole("link", { name: "developer98.ninja@gmail.com" });
    expect(link).toHaveAttribute("href", "mailto:developer98.ninja@gmail.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("preserves plain text paths without linkifying", () => {
    render(<MentionText text="경로 /about 는 링크 아님" />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText(/\/about/)).toBeTruthy();
  });
});
