import type { Metadata } from "next";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";

export const metadata: Metadata = getSharedMetadata({
  title: "API 테스트",
  robots: { index: false, follow: false },
});

export default function ApiTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
