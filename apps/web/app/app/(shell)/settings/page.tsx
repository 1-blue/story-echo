import type { Metadata } from "next";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { ClientOnly } from "@/components/client-only";
import { SettingsPageClient } from "./_components/settings-page-client";
import { SettingsPageSkeleton } from "./_components/settings-page-skeleton";

export const metadata: Metadata = getSharedMetadata({
  title: "설정",
  description: "계정, 읽기 설정, 알림을 관리하세요.",
});

export default function SettingsPage() {
  return (
    <ClientOnly fallback={<SettingsPageSkeleton />}>
      <SettingsPageClient />
    </ClientOnly>
  );
}
