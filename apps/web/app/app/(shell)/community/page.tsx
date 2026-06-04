import type { Metadata } from "next";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { CommunityPageClient } from "./_components/community-page-client";

export const metadata: Metadata = getSharedMetadata({
  title: "커뮤니티",
  description: "토론을 시작하고 다른 사람의 이야기에 공감해보세요.",
});

export default function CommunityPage() {
  return <CommunityPageClient />;
}
