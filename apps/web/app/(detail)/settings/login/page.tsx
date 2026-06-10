import { Suspense } from "react";
import type { Metadata } from "next";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = getSharedMetadata({
  title: "로그인",
  description: "이야기해줘에 로그인하세요.",
});

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
