import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { APP_SHELL_MAX_WIDTH_CLASS } from "@/lib/app-layout";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function DetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`bg-canvas text-foreground min-h-dvh pb-[var(--safe-area-bottom)] ${APP_SHELL_MAX_WIDTH_CLASS}`}
    >
      {children}
      <Toaster />
    </div>
  );
}
