import { Skeleton } from "@/components/ui/skeleton";

export function ShellTabPageSkeleton() {
  return (
    <div className="flex flex-1 flex-col px-5 pt-4 pb-[calc(var(--shell-tab-height)+var(--ad-strip-height)+2rem+var(--safe-area-bottom))]">
      <div className="mb-6 text-center">
        <Skeleton className="mx-auto mb-2 h-8 w-16" />
        <Skeleton className="mx-auto h-4 w-40" />
      </div>
      <Skeleton className="mb-6 h-11 rounded-full" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
    </div>
  );
}
