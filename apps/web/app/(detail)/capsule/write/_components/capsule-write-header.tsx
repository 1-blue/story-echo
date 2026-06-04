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
    <header className="border-hairline bg-canvas sticky top-0 z-40 flex h-[calc(4rem+var(--safe-area-top))] shrink-0 items-center justify-between border-b px-5 pt-[var(--safe-area-top)]">
      <button
        type="button"
        onClick={onCancel}
        className="text-slate hover:text-charcoal text-sm font-medium transition-colors"
      >
        취소
      </button>
      <h1 className="text-ink text-lg font-semibold">타임캡슐 만들기</h1>
      <button
        type="button"
        onClick={onSeal}
        disabled={!canSeal || isSubmitting}
        className="text-capsule hover:text-capsule/80 text-sm font-bold transition-colors disabled:opacity-40"
      >
        봉인하기
      </button>
    </header>
  );
}
