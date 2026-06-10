import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { APP_SHELL_MAX_WIDTH_CLASS } from "@/lib/app-layout";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`min-h-dvh bg-canvas pb-[var(--safe-area-bottom)] text-foreground ${APP_SHELL_MAX_WIDTH_CLASS}`}
    >
      {children}
      <Toaster />
    </div>
  );
}
