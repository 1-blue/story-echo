"use client";

import { useMemo, useState } from "react";
import { useGetApiV1Questions } from "@storyecho/api-client";
import { Input } from "@/components/ui/input";
import { formatQuestionDate } from "@/lib/format-question-date";
import { cn } from "@/lib/utils";

type PreviousQuestionPickerProps = {
  todayQuestionId: string;
  selectedId: string | null;
  onSelect: (id: string, text: string) => void;
};

export function PreviousQuestionPicker({
  todayQuestionId,
  selectedId,
  onSelect,
}: PreviousQuestionPickerProps) {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useGetApiV1Questions({
    query: { staleTime: 5 * 60_000 },
  });

  const questions = useMemo(() => {
    const items = (data?.data ?? [])
      .filter((question) => question.id !== todayQuestionId)
      .sort((a, b) => (a.month === b.month ? a.day - b.day : a.month - b.month));

    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.filter((question) => {
      const dateLabel = formatQuestionDate(question.month, question.day).toLowerCase();
      return question.text.toLowerCase().includes(query) || dateLabel.includes(query);
    });
  }, [data?.data, search, todayQuestionId]);

  if (isLoading) {
    return <p className="text-sm text-stone">질문 목록을 불러오는 중…</p>;
  }

  if (isError) {
    return <p className="text-sm text-destructive">질문 목록을 불러오지 못했어요.</p>;
  }

  if (questions.length === 0) {
    return (
      <p className="text-sm text-stone">
        {search.trim() ? "검색 결과가 없어요." : "선택할 수 있는 이전 질문이 없어요."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="질문 또는 날짜로 검색"
        className="h-10 rounded-xl border-hairline bg-white"
      />
      <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-hairline bg-white p-2">
        {questions.map((question) => {
          const isSelected = selectedId === question.id;
          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onSelect(question.id, question.text)}
              className={cn(
                "flex w-full flex-col gap-1 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                isSelected
                  ? "border-primary bg-terracotta-soft/40"
                  : "border-transparent hover:bg-surface-cream/60",
              )}
            >
              <span className="text-xs font-medium text-stone">
                {formatQuestionDate(question.month, question.day)}
              </span>
              <span className="leading-relaxed text-charcoal">{question.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
