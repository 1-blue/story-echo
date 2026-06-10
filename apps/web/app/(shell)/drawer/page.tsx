import type { Metadata } from "next";
import { getTodayStoryStatus } from "@/lib/get-today-story-status";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { DrawerPageClient } from "./_components/drawer-page-client";

export const metadata: Metadata = getSharedMetadata({
  title: "서랍",
  description: "지난 이야기를 월별로 모아 다시 읽어보세요.",
});

export default async function DrawerPage() {
  const { todayStoryId } = await getTodayStoryStatus();
  return <DrawerPageClient todayStoryId={todayStoryId} />;
}
