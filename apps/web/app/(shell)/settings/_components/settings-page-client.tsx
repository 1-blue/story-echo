"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGetApiV1UsersMeSuspense } from "@storyecho/api-client";
import { ROUTES } from "@/lib/routes/routes";
import { SettingsAccountSection } from "./settings-account-section";
import { SettingsInfoLinks } from "./settings-info-links";
import { SettingsNicknameSheet } from "./settings-nickname-sheet";
import { SettingsNotificationRow } from "./settings-notification-row";
import { SettingsProfileCard } from "./settings-profile-card";
import { SettingsReadingSection } from "./settings-reading-section";

export function SettingsPageClient() {
  const { data } = useGetApiV1UsersMeSuspense();
  const user = data.data;
  const [showNicknameSheet, setShowNicknameSheet] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && user.fontSize) {
      window.localStorage.setItem("storyecho-font-size", user.fontSize);
    }
  }, [user.fontSize]);

  return (
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-[calc(var(--shell-tab-height)+var(--ad-strip-height)+2rem+var(--safe-area-bottom))]" data-shell-scroll>
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-ink">설정</h2>
        <p className="text-base text-slate">앱 사용 환경과 계정을 관리해요</p>
      </div>

      <div className="flex flex-col gap-6">
        <SettingsProfileCard user={user} onEditNickname={() => setShowNicknameSheet(true)} />
        <SettingsReadingSection user={user} />
        <SettingsNotificationRow user={user} />
        <SettingsAccountSection user={user} />
        <SettingsInfoLinks />
        <p className="pb-2 text-center text-xs text-stone">
          <Link href={ROUTES.about.url} className="transition-colors hover:text-charcoal">
            {ROUTES.about.label}
          </Link>
          {" · storyecho.app"}
        </p>
      </div>

      <SettingsNicknameSheet
        open={showNicknameSheet}
        onOpenChange={setShowNicknameSheet}
        currentNickname={user.nickname}
      />
    </div>
  );
}
