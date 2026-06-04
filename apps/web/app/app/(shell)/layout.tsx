import { AppShell } from "@/components/app-shell/app-shell";
import { Toaster } from "@/components/ui/sonner";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppShell>{children}</AppShell>
      <Toaster />
    </>
  );
}
