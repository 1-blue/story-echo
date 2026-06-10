"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getGetApiV1UsersMeQueryKey, getApiV1UsersMe, usePostApiV1AuthLogin } from "@storyecho/api-client";
import { LoginRequestSchema, type LoginRequest } from "@storyecho/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/get-error-message";
import { ROUTES } from "@/lib/routes/routes";
import { SettingsAuthHeader } from "../../_components/settings-auth-header";

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

  const completeLogin = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetApiV1UsersMeQueryKey() });
    toast.success("로그인했어요.");
    router.push(nextPath && nextPath.startsWith("/") ? nextPath : "/settings");
    router.refresh();
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync({ data: values });
      await completeLogin();
    } catch (error) {
      try {
        const me = await queryClient.fetchQuery({
          queryKey: getGetApiV1UsersMeQueryKey(),
          queryFn: () => getApiV1UsersMe(),
        });
        if (me.data.role !== "guest") {
          await completeLogin();
          return;
        }
      } catch {
        // session fallback failed — show original error
      }
      toast.error(getErrorMessage(error));
    }
  });

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <SettingsAuthHeader title="로그인" onCancel={() => router.back()} />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-5 py-8">
        <p className="text-center text-sm leading-relaxed text-stone">
          다른 기기에서도 이야기를 이어가려면 로그인하세요.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-sm font-medium text-charcoal">
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
              <label htmlFor="login-password" className="text-sm font-medium text-charcoal">
                비밀번호
              </label>
              <button
                type="button"
                className="text-xs font-medium text-primary"
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

          <Button
            type="submit"
            className="mt-2 w-full rounded-full"
            disabled={loginMutation.isPending}
          >
            로그인
          </Button>
        </form>

        <p className="text-center text-sm text-stone">
          아직 계정이 없나요?{" "}
          <Link
            href={
              nextPath
                ? `/settings/signup?next=${encodeURIComponent(nextPath)}`
                : "/settings/signup"
            }
            className="font-semibold text-primary"
          >
            회원가입
          </Link>
        </p>

        <p className="text-center text-xs text-stone">
          <Link href={ROUTES.about.url} className="transition-colors hover:text-charcoal">
            {ROUTES.about.label}
          </Link>
        </p>
      </main>
    </div>
  );
}
