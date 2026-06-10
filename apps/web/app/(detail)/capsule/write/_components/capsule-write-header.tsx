type CapsuleWriteHeaderProps = {
  onCancel: () => void;
  onSeal: () => void;
  canSeal: boolean;
  isSubmitting: boolean;
};

export function CapsuleWriteHeader({
  onCancel,
  onSeal,
  canSeal,
  isSubmitting,
}: CapsuleWriteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-[calc(4rem+var(--safe-area-top))] shrink-0 items-center justify-between border-b border-hairline bg-canvas px-5 pt-[var(--safe-area-top)]">
      <button
        type="button"
        onClick={onCancel}
        className="text-sm font-medium text-slate transition-colors hover:text-charcoal"
      >
        취소
      </button>
      <h1 className="text-lg font-semibold text-ink">타임캡슐 만들기</h1>
      <button
        type="button"
        onClick={onSeal}
        disabled={!canSeal || isSubmitting}
        className="text-sm font-bold text-capsule transition-colors hover:text-capsule/80 disabled:opacity-40"
      >
        봉인하기
      </button>
    </header>
  );
}
