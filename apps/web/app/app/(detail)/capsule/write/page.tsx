import type { Metadata } from "next";
import { isAwsConfigured } from "@/lib/env/aws";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { CapsuleWriteForm } from "./_components/capsule-write-form";

export const metadata: Metadata = getSharedMetadata({
  title: "타임캡슐 만들기",
  description: "미래의 나에게 편지를 봉인하세요.",
});

export default function CapsuleWritePage() {
  return <CapsuleWriteForm photoUploadEnabled={isAwsConfigured()} />;
}
