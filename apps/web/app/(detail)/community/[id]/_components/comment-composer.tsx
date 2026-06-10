"use client";

import { useRef } from "react";
import { AtSign, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CommentComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onMentionClick: () => void;
  isSubmitting: boolean;
  placeholder?: string;
};

export function CommentComposer({
  value,
  onChange,
  onSubmit,
  onMentionClick,
  isSubmitting,
  placeholder = "댓글을 남겨보세요",
}: CommentComposerProps) {
  const isComposingRef = useRef(false);

  const handleSubmit = () => {
    if (isSubmitting || isComposingRef.current || !value.trim()) return;
    onSubmit();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-hairline bg-canvas px-4 py-3 pb-[calc(0.75rem+var(--safe-area-bottom))] shadow-[0_-4px_20px_-10px_rgba(144,72,36,0.1)]">
      <button
        type="button"
        aria-label="멘션"
        onClick={onMentionClick}
        className="rounded-full p-2 text-slate transition-colors hover:bg-surface-cream/60 hover:text-primary"
      >
        <AtSign className="size-5" strokeWidth={1.75} />
      </button>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-full border-hairline-strong bg-white"
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={() => {
          isComposingRef.current = false;
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" || event.shiftKey) return;
          // 한글 등 IME 조합 중 Enter는 글자 확정용 — 제출하지 않음
          if (event.nativeEvent.isComposing || isComposingRef.current || event.keyCode === 229) {
            return;
          }
          event.preventDefault();
          handleSubmit();
        }}
      />
      <Button
        type="button"
        size="icon"
        className="size-10 shrink-0 rounded-full"
        onClick={handleSubmit}
        disabled={isSubmitting || !value.trim()}
        aria-label="댓글 보내기"
      >
        <Send className="size-4" strokeWidth={1.75} />
      </Button>
    </div>
  );
}
