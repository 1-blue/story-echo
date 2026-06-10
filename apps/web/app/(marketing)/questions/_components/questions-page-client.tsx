"use client";

import { Suspense } from "react";
import { QuestionsHeader } from "./questions-header";
import { QuestionsList } from "./questions-list";

function QuestionsListFallback() {
  return (
    <div className="flex flex-col gap-4 pb-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded-xl border border-hairline bg-white"
        />
      ))}
    </div>
  );
}

export function QuestionsPageClient() {
  return (
    <div className="flex min-h-dvh flex-col">
      <QuestionsHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-5 py-6">
        <Suspense fallback={<QuestionsListFallback />}>
          <QuestionsList />
        </Suspense>
      </main>
    </div>
  );
}
