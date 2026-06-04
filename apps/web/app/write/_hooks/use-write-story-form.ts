"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { WriteStoryFormSchema, type WriteStoryFormValues } from "@/features/stories/types";

type UseWriteStoryFormOptions = {
  questionId?: string | null;
  defaultValues?: Partial<WriteStoryFormValues>;
};

export function useWriteStoryForm({ questionId, defaultValues }: UseWriteStoryFormOptions = {}) {
  return useForm<WriteStoryFormValues>({
    resolver: zodResolver(WriteStoryFormSchema),
    defaultValues: {
      bodyText: defaultValues?.bodyText ?? "",
      photoUrls: defaultValues?.photoUrls ?? [],
      visibility: defaultValues?.visibility ?? "private",
      isCapsule: defaultValues?.isCapsule ?? false,
      unlockAt: defaultValues?.unlockAt ?? null,
      questionId: defaultValues?.questionId ?? questionId ?? undefined,
    },
    mode: "onChange",
  });
}
