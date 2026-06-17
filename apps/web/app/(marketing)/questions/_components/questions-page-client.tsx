"use client";

import { Suspense } from "react";
import { QuestionsHeader } from "./questions-header";
import { QuestionsList } from "./questions-list";

export function QuestionsPageClient() {
  return (
    <div className="flex min-h-dvh flex-col">
      <QuestionsHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-5 py-6">
        <QuestionsList />
      </main>
    </div>
  );
}
