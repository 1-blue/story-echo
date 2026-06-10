"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getGetApiV1UsersMeQueryKey, usePostApiV1AuthSignup } from "@storyecho/api-client";
import { SignupRequestSchema, type SignupRequest } from "@storyecho/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/get-error-message";
import { ROUTES } from "@/lib/routes/routes";
import { SettingsAuthHeader } from "../../_components/settings-auth-header";

export function SignupForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const signupMutation = usePostApiV1AuthSignup();

  const form = useForm<SignupRequest>({
    resolver: zodResolver(SignupRequestSchema),
    defaultValues: { email: "", password: "", nickname: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await signupMutation.mutateAsync({
        data: {
          email: values.email,
          password: values.password,
          nickname: values.nickname?.trim() || undefined,
        },
      });
      await queryClient.invalidateQueries({ queryKey: getGetApiV1UsersMeQueryKey() });
      toast.success("회원가입을 완료했어요.");
      router.push("/settings");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <SettingsAuthHeader title="회원가입" onCancel={() => router.back()} />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-5 py-8">
        <p className="text-center text-sm leading-relaxed text-stone">
          가입하면 이 기기의 이야기가 계정에 저장돼요.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="signup-email" className="text-sm font-medium text-charcoal">
              이메일
            </label>
            <Input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              {...form.register("email")}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-password" className="text-sm font-medium text-charcoal">
              비밀번호
            </label>
            <Input
              id="signup-password"
              type="password"
              placeholder="8자 이상"
              {...form.register("password")}
            />
            <p className="text-xs text-stone">8자 이상 입력해 주세요.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-nickname" className="text-sm font-medium text-charcoal">
              닉네임 (선택)
            </label>
            <Input
              id="signup-nickname"
              type="text"
              placeholder="커뮤니티에 표시되는 이름"
              {...form.register("nickname")}
            />
          </div>

          <Button
            type="submit"
            className="mt-2 w-full rounded-full"
            disabled={signupMutation.isPending}
          >
            가입하기
          </Button>
        </form>

        <p className="text-center text-sm text-stone">
          이미 계정이 있나요?{" "}
          <Link href="/settings/login" className="font-semibold text-primary">
            로그인
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
