import type { Metadata, Viewport } from "next";
import { Gowun_Batang } from "next/font/google";
import { Providers } from "@/components/providers";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import "./globals.css";

const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gowun-batang",
});

export const metadata: Metadata = getSharedMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${gowunBatang.variable} h-full`} suppressHydrationWarning>
      <body className="bg-canvas flex min-h-full flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
