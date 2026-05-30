import type { Metadata } from "next";
import { Lora } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: {
    default: "StoryEcho — 이야기해줘",
    template: "%s | StoryEcho",
  },
  description: "매일 하나의 질문. 오늘의 이야기, 나중에 다시 읽기.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${lora.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
