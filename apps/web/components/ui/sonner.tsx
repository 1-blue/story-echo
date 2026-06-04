"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      offset={{ top: "calc(var(--safe-area-top) + 1rem)" }}
      toastOptions={{
        classNames: {
          toast: "bg-ink text-white border-none shadow-lg rounded-xl",
          description: "text-white/80",
        },
      }}
    />
  );
}
