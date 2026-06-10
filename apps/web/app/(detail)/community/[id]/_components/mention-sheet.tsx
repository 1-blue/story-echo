"use client";

import { AtSign } from "lucide-react";
import { AuthorAvatar } from "@/components/community/author-avatar";
import { BottomSheet, BottomSheetContent } from "@/components/ui/bottom-sheet";

type MentionUser = {
  id: string;
  nickname: string;
};

type MentionSheetProps = {
  open: boolean;
  users: MentionUser[];
  onSelect: (nickname: string) => void;
  onClose: () => void;
};

export function MentionSheet({ open, users, onSelect, onClose }: MentionSheetProps) {
  return (
    <BottomSheet open={open} onOpenChange={(next) => !next && onClose()}>
      <BottomSheetContent unpadded showHandle={false}>
        <div className="flex items-center gap-2 border-b border-hairline bg-surface-cream/50 px-4 py-2">
          <AtSign className="size-4 text-stone" strokeWidth={1.75} />
          <span className="text-xs text-stone">멘션할 사용자를 선택하세요</span>
        </div>
        <ul className="max-h-52 overflow-y-auto pb-6">
          {users.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-stone">검색 결과가 없어요</li>
          ) : (
            users.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(user.nickname);
                    onClose();
                  }}
                  className="flex w-full items-center gap-3 border-b border-hairline/50 px-4 py-3 text-left transition-colors hover:bg-surface-cream/60"
                >
                  <AuthorAvatar nickname={user.nickname} />
                  <span className="text-sm font-medium text-ink">{user.nickname}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </BottomSheetContent>
    </BottomSheet>
  );
}
