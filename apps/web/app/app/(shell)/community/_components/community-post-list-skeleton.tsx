import { Skeleton } from "@/components/ui/skeleton";

export function CommunityPostListSkeleton() {
  return (
    <div className="mt-4 space-y-4">
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
    </div>
  );
}
