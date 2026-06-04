import type { Metadata } from "next";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { CapsulePageClient } from "./_components/capsule-page-client";

export const metadata: Metadata = getSharedMetadata({
  title: "타임캡슐",
  description: "봉인된 편지를 모아보고 해제일을 확인하세요.",
});

export default function CapsulePage() {
  return <CapsulePageClient />;
}
