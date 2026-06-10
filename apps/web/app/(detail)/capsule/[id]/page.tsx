import type { Metadata } from "next";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { CapsuleDetailPageClient } from "./_components/capsule-detail-page-client";

export const metadata: Metadata = getSharedMetadata({
  title: "타임캡슐",
  description: "봉인된 편지의 해제일과 내용을 확인하세요.",
});

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CapsuleDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <CapsuleDetailPageClient capsuleId={id} />
    </div>
  );
}
