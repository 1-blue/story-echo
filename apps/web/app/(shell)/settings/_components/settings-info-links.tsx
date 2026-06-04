"use client";

import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import { SettingsRow, SettingsSection } from "./settings-section";

const INFO_LINKS = [
  { label: "개인정보처리방침" },
  { label: "서비스 이용약관" },
  { label: "오픈카톡방" },
  { label: "문의하기" },
] as const;

export function SettingsInfoLinks() {
  return (
    <SettingsSection title="정보">
      {INFO_LINKS.map((link) => (
        <SettingsRow
          key={link.label}
          label={link.label}
          onClick={() => toast.message("TODO: 링크넣기")}
        >
          <ChevronRight className="text-stone size-4" strokeWidth={1.75} />
        </SettingsRow>
      ))}
    </SettingsSection>
  );
}
