import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuestionCard, QuestionExploreLinks } from "@/components/question-card";

function renderHomeQuestionSection(todayStoryId?: string | null) {
  render(
    <>
      <QuestionCard question="오늘의 질문입니다" todayStoryId={todayStoryId} />
      <QuestionExploreLinks />
    </>,
  );
}

describe("QuestionCard", () => {
  it("renders question text and write link", () => {
    renderHomeQuestionSection();
    expect(screen.getByRole("heading", { name: "오늘의 질문입니다" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /이야기하기/ })).toHaveAttribute("href", "/write");
    expect(screen.getByRole("link", { name: "나중에" })).toHaveAttribute("href", "/drawer");
    expect(screen.getByRole("link", { name: "질문 모아보기" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "서비스 소개" })).toBeInTheDocument();
  });

  it("shows drawer link when todayStoryId is set", () => {
    renderHomeQuestionSection("550e8400-e29b-41d4-a716-446655440000");
    expect(screen.getByText("오늘의 이야기를 남겼어요")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "서랍에서 보기" })).toHaveAttribute(
      "href",
      "/drawer/550e8400-e29b-41d4-a716-446655440000",
    );
    expect(screen.queryByRole("link", { name: /이야기하기/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "나중에" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "질문 모아보기" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "서비스 소개" })).toBeInTheDocument();
  });
});
