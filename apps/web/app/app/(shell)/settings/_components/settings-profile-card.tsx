"use client";

import { ChevronRight } from "lucide-react";
import type { UserMe } from "@storyecho/schemas";

type SettingsProfileCardProps = {
  user: UserMe;
  onEditNickname: () => void;
};

function getInitial(nickname: string | null): string {
  if (!nickname?.trim()) return "?";
  return nickname.trim().slice(0, 1);
}

export function SettingsProfileCard({ user, onEditNickname }: SettingsProfileCardProps) {
  const isGuest = user.role === "guest";

  return (
    <button
      type="button"
      onClick={onEditNickname}
      className="border-hairline hover:bg-surface-cream/40 flex w-full items-center gap-4 rounded-xl border bg-white p-4 text-left shadow-sm transition-colors"
    >
      <div className="bg-primary-soft text-primary flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold">
        {getInitial(user.nickname)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-ink truncate text-lg font-semibold">{user.nickname ?? "닉네임 없음"}</p>
        <p className="text-stone truncate text-sm">
          {isGuest ? "게스트 · 이 기기에서만 사용 중" : (user.email ?? "회원")}
        </p>
      </div>
      <ChevronRight className="text-stone size-5 shrink-0" strokeWidth={1.75} />
    </button>
  );
}
