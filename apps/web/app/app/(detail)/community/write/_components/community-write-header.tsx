type CommunityWriteHeaderProps = {
  mode: "create" | "edit";
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export function CommunityWriteHeader({
  mode,
  onCancel,
  onSubmit,
  isSubmitting,
}: CommunityWriteHeaderProps) {
  return (
    <header className="border-hairline bg-canvas sticky top-0 z-40 flex h-[calc(4rem+var(--safe-area-top))] shrink-0 items-center justify-between border-b px-5 pt-[var(--safe-area-top)]">
      <button
        type="button"
        onClick={onCancel}
        className="text-slate hover:text-charcoal text-sm font-medium transition-colors"
      >
        취소
      </button>
      <h1 className="text-ink text-lg font-semibold">{mode === "edit" ? "토론 수정" : "토론 시작"}</h1>
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="text-primary hover:text-primary/80 text-sm font-bold transition-colors disabled:opacity-50"
      >
        {mode === "edit" ? "저장" : "게시"}
      </button>
    </header>
  );
}
