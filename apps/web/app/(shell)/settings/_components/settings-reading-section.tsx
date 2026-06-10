"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getGetApiV1UsersMeQueryKey, usePatchApiV1UsersMe } from "@storyecho/api-client";
import type { UserMe } from "@storyecho/schemas";
import { FontSizeDialog } from "@/app/(detail)/drawer/[id]/_components/font-size-dialog";
import {
  FONT_SIZE_OPTIONS,
  useFontSize,
  type FontSizePreference,
} from "@/app/(detail)/drawer/[id]/_hooks/use-font-size";
import { getErrorMessage } from "@/lib/get-error-message";
import { SettingsRow, SettingsSection } from "./settings-section";

type SettingsReadingSectionProps = {
  user: UserMe;
};

export function SettingsReadingSection({ user }: SettingsReadingSectionProps) {
  const queryClient = useQueryClient();
  const patchUser = usePatchApiV1UsersMe();
  const { fontSize, setFontSize } = useFontSize();
  const [showFontDialog, setShowFontDialog] = useState(false);

  const fontLabel =
    FONT_SIZE_OPTIONS.find((option) => option.value === (user.fontSize as FontSizePreference))
      ?.label ?? "중";

  const handleFontSizeChange = async (next: FontSizePreference) => {
    setFontSize(next);
    try {
      await patchUser.mutateAsync({ data: { fontSize: next } });
      await queryClient.invalidateQueries({ queryKey: getGetApiV1UsersMeQueryKey() });
      setShowFontDialog(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <SettingsSection title="읽기">
        <SettingsRow label="글자 크기" onClick={() => setShowFontDialog(true)}>
          <span className="flex items-center gap-1 text-sm text-stone">
            {fontSize === user.fontSize
              ? fontLabel
              : FONT_SIZE_OPTIONS.find((o) => o.value === fontSize)?.label}
            <ChevronRight className="size-4" strokeWidth={1.75} />
          </span>
        </SettingsRow>
      </SettingsSection>

      <FontSizeDialog
        open={showFontDialog}
        onOpenChange={setShowFontDialog}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
      />
    </>
  );
}
