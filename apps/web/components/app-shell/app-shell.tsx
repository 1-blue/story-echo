"use client";

import { AdBanner } from "@/components/app-shell/ad-banner";
import { AdEligibilityProvider, useAdEligibility } from "@/components/app-shell/ad-eligibility-context";
import { AppHeader } from "@/components/app-shell/app-header";
import { BottomTabBar } from "@/components/app-shell/bottom-tab-bar";
import { APP_SHELL_MAX_WIDTH_CLASS } from "@/lib/app-layout";
import { cn } from "@/lib/utils";

function AppShellFrame({ children }: { children: React.ReactNode }) {
  const { showAdBanner } = useAdEligibility();

  return (
    <div
      className={`bg-canvas text-foreground flex min-h-dvh min-h-[-webkit-fill-available] flex-col ${APP_SHELL_MAX_WIDTH_CLASS}`}
    >
      <AppHeader />
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          showAdBanner
            ? "pb-[calc(var(--shell-tab-height)+var(--ad-strip-height)+var(--safe-area-bottom))]"
            : "pb-[calc(var(--shell-tab-height)+var(--safe-area-bottom))]",
        )}
      >
        {children}
      </div>
      <AdBanner />
      <BottomTabBar />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AdEligibilityProvider>
      <AppShellFrame>{children}</AppShellFrame>
    </AdEligibilityProvider>
  );
}
