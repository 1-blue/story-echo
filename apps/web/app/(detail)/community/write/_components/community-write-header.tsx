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
    <header className="sticky top-0 z-40 flex h-[calc(4rem+var(--safe-area-top))] shrink-0 items-center justify-between border-b border-hairline bg-canvas px-5 pt-[var(--safe-area-top)]">
      <button
        type="button"
        onClick={onCancel}
        className="text-sm font-medium text-slate transition-colors hover:text-charcoal"
      >
        취소
      </button>
      <h1 className="text-lg font-semibold text-ink">
        {mode === "edit" ? "토론 수정" : "토론 시작"}
      </h1>
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="text-sm font-bold text-primary transition-colors hover:text-primary/80 disabled:opacity-50"
      >
        {mode === "edit" ? "저장" : "게시"}
      </button>
    </header>
  );
}
