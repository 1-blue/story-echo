import { AdBanner } from "@/components/app-shell/ad-banner";
import { AppHeader } from "@/components/app-shell/app-header";
import { BottomTabBar } from "@/components/app-shell/bottom-tab-bar";
import { APP_SHELL_MAX_WIDTH_CLASS } from "@/lib/app-layout";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`bg-canvas text-foreground flex min-h-dvh min-h-[-webkit-fill-available] flex-col ${APP_SHELL_MAX_WIDTH_CLASS}`}
    >
      <AppHeader />
      <div className="flex min-h-0 flex-1 flex-col pb-[calc(var(--shell-tab-height)+var(--ad-strip-height)+var(--safe-area-bottom))]">
        {children}
      </div>
      <AdBanner />
      <BottomTabBar />
    </div>
  );
}
