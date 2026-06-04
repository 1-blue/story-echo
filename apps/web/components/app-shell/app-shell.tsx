import { AdBanner } from "@/components/app-shell/ad-banner";
import { AppHeader } from "@/components/app-shell/app-header";
import { BottomTabBar } from "@/components/app-shell/bottom-tab-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-canvas text-foreground mx-auto flex min-h-dvh min-h-[-webkit-fill-available] w-full max-w-lg flex-col">
      <AppHeader />
      <div className="flex min-h-0 flex-1 flex-col pb-[calc(var(--shell-tab-height)+var(--ad-strip-height)+var(--safe-area-bottom))]">
        {children}
      </div>
      <AdBanner />
      <BottomTabBar />
    </div>
  );
}
