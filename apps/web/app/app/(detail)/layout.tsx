import { Toaster } from "@/components/ui/sonner";

export default function DetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
