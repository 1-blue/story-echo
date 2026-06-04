import type { Metadata } from "next";
import { getTodayWriteHref } from "@/lib/get-today-write-href";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { DrawerPageClient } from "./_components/drawer-page-client";

export const metadata: Metadata = getSharedMetadata({
  title: "서랍",
  description: "지난 이야기를 월별로 모아 다시 읽어보세요.",
});

export default async function DrawerPage() {
  const writeHref = await getTodayWriteHref();
  return <DrawerPageClient writeHref={writeHref} />;
}
