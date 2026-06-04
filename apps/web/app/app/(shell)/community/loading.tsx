import { CommunityPostListSkeleton } from "./_components/community-post-list-skeleton";

export default function CommunityLoading() {
  return (
    <div className="flex flex-1 flex-col px-5 pt-4 pb-[calc(var(--shell-tab-height)+var(--ad-strip-height)+2rem+var(--safe-area-bottom))]">
      <CommunityPostListSkeleton />
    </div>
  );
}
