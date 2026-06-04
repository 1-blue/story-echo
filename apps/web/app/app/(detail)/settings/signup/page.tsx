import type { Metadata } from "next";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { SignupForm } from "./_components/signup-form";

export const metadata: Metadata = getSharedMetadata({
  title: "회원가입",
  description: "StoryEcho 계정을 만들고 이야기를 시작하세요.",
});

export default function SignupPage() {
  return <SignupForm />;
}
