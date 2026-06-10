"use client";

import { useVisualViewportInset } from "@/lib/hooks/use-visual-viewport-inset";

export function VisualViewportBootstrap() {
  useVisualViewportInset();
  return null;
}
