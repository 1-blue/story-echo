"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SignupRequestSchema, type SignupRequest } from "@storyecho/schemas";
import {
  getGetApiV1UsersMeQueryKey,
  usePostApiV1AuthSignup,
} from "@storyecho/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingsAuthHeader } from "../../_components/settings-auth-header";
import { getErrorMessage } from "@/lib/get-error-message";

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
      router.push("/app/settings");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  return (
    <div className="bg-canvas flex min-h-dvh flex-col">
      <SettingsAuthHeader title="회원가입" onCancel={() => router.back()} />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-5 py-8">
        <p className="text-stone text-center text-sm leading-relaxed">
          가입하면 이 기기의 이야기가 계정에 저장돼요.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="signup-email" className="text-charcoal text-sm font-medium">
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
            <label htmlFor="signup-password" className="text-charcoal text-sm font-medium">
              비밀번호
            </label>
            <Input
              id="signup-password"
              type="password"
              placeholder="8자 이상"
              {...form.register("password")}
            />
            <p className="text-stone text-xs">8자 이상 입력해 주세요.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-nickname" className="text-charcoal text-sm font-medium">
              닉네임 (선택)
            </label>
            <Input
              id="signup-nickname"
              type="text"
              placeholder="커뮤니티에 표시되는 이름"
              {...form.register("nickname")}
            />
          </div>

          <Button type="submit" className="mt-2 w-full rounded-full" disabled={signupMutation.isPending}>
            가입하기
          </Button>
        </form>

        <p className="text-stone text-center text-sm">
          이미 계정이 있나요?{" "}
          <Link href="/app/settings/login" className="text-primary font-semibold">
            로그인
          </Link>
        </p>
      </main>
    </div>
  );
}
