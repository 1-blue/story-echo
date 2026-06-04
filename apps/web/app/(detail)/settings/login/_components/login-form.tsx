"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoginRequestSchema, type LoginRequest } from "@storyecho/schemas";
import {
  getGetApiV1UsersMeQueryKey,
  usePostApiV1AuthLogin,
} from "@storyecho/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingsAuthHeader } from "../../_components/settings-auth-header";
import { getErrorMessage } from "@/lib/get-error-message";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const queryClient = useQueryClient();
  const loginMutation = usePostApiV1AuthLogin();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync({ data: values });
      await queryClient.invalidateQueries({ queryKey: getGetApiV1UsersMeQueryKey() });
      toast.success("로그인했어요.");
      router.push(nextPath && nextPath.startsWith("/") ? nextPath : "/settings");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  return (
    <div className="bg-canvas flex min-h-dvh flex-col">
      <SettingsAuthHeader title="로그인" onCancel={() => router.back()} />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-5 py-8">
        <p className="text-stone text-center text-sm leading-relaxed">
          다른 기기에서도 이야기를 이어가려면 로그인하세요.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-charcoal text-sm font-medium">
              이메일
            </label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              {...form.register("email")}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="text-charcoal text-sm font-medium">
                비밀번호
              </label>
              <button
                type="button"
                className="text-primary text-xs font-medium"
                onClick={() => toast.message("준비 중이에요.")}
              >
                비밀번호 재설정
              </button>
            </div>
            <Input
              id="login-password"
              type="password"
              placeholder="8자 이상"
              {...form.register("password")}
            />
          </div>

          <Button type="submit" className="mt-2 w-full rounded-full" disabled={loginMutation.isPending}>
            로그인
          </Button>
        </form>

        <p className="text-stone text-center text-sm">
          아직 계정이 없나요?{" "}
          <Link
            href={
              nextPath
                ? `/settings/signup?next=${encodeURIComponent(nextPath)}`
                : "/settings/signup"
            }
            className="text-primary font-semibold"
          >
            회원가입
          </Link>
        </p>
      </main>
    </div>
  );
}
