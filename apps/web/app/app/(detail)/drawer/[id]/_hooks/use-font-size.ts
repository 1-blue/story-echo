"use client";

import { useCallback, useEffect, useState } from "react";

export type FontSizePreference = "sm" | "md" | "lg";

const STORAGE_KEY = "storyecho-font-size";

export const FONT_SIZE_OPTIONS: Array<{ value: FontSizePreference; label: string }> = [
  { value: "sm", label: "소" },
  { value: "md", label: "중" },
  { value: "lg", label: "대" },
];

export const QUESTION_SIZE_CLASSES: Record<FontSizePreference, string> = {
  sm: "text-2xl leading-snug",
  md: "text-[28px] leading-snug",
  lg: "text-[32px] leading-snug",
};

export const BODY_SIZE_CLASSES: Record<FontSizePreference, string> = {
  sm: "text-sm leading-relaxed",
  md: "text-base leading-relaxed",
  lg: "text-lg leading-relaxed",
};

function readStoredFontSize(): FontSizePreference {
  if (typeof window === "undefined") return "md";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "sm" || stored === "md" || stored === "lg") return stored;
  return "md";
}

export function useFontSize() {
  const [fontSize, setFontSizeState] = useState<FontSizePreference>("md");

  useEffect(() => {
    setFontSizeState(readStoredFontSize());
  }, []);

  const setFontSize = useCallback((next: FontSizePreference) => {
    setFontSizeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return { fontSize, setFontSize };
}
