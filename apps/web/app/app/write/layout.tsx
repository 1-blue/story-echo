import { Toaster } from "@/components/ui/sonner";

export default function WriteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
