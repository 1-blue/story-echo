"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type WriteHeaderProps = {
  formId: string;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
};

export function WriteHeader({ formId, isSubmitting, mode = "create" }: WriteHeaderProps) {
  const router = useRouter();
  const title = mode === "edit" ? "이야기 수정" : "이야기하기";

  return (
    <header className="flex min-h-11 items-center justify-between px-5 py-2.5">
      <Button
        type="button"
        variant="ghost"
        className="h-11 min-w-11 px-2 text-sm font-medium text-slate hover:text-ink"
        onClick={() => router.back()}
      >
        취소
      </Button>
      <h1 className="flex-1 text-center text-base font-semibold text-ink">{title}</h1>
      <Button
        type="submit"
        form={formId}
        variant="ghost"
        disabled={isSubmitting}
        className="h-11 min-w-11 px-2 text-sm font-bold text-primary hover:text-primary/80"
      >
        {isSubmitting ? "저장 중…" : "저장"}
      </Button>
    </header>
  );
}
