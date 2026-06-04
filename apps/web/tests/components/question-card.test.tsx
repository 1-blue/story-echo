import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuestionCard } from "@/components/question-card";

describe("QuestionCard", () => {
  it("renders question text and write link", () => {
    render(<QuestionCard question="오늘의 질문입니다" />);
    expect(screen.getByRole("heading", { name: "오늘의 질문입니다" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /이야기하기/ })).toHaveAttribute("href", "/write");
    expect(screen.getByRole("link", { name: "나중에" })).toHaveAttribute("href", "/drawer");
  });

  it("links to edit when todayStoryId is set", () => {
    render(
      <QuestionCard question="오늘의 질문입니다" todayStoryId="550e8400-e29b-41d4-a716-446655440000" />,
    );
    expect(screen.getByRole("link", { name: /이야기 수정/ })).toHaveAttribute(
      "href",
      "/write/550e8400-e29b-41d4-a716-446655440000",
    );
  });
});
