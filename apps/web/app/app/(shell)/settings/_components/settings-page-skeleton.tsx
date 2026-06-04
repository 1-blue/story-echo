import { Skeleton } from "@/components/ui/skeleton";

export function SettingsPageSkeleton() {
  return (
    <div className="flex flex-1 flex-col px-5 pt-6 pb-[calc(var(--shell-tab-height)+var(--ad-strip-height)+2rem+var(--safe-area-bottom))]">
      <Skeleton className="mb-6 h-28 rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
      </div>
      <div className="mt-8 space-y-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
      </div>
    </div>
  );
}
