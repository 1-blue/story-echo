type SettingsAuthHeaderProps = {
  title: string;
  onCancel: () => void;
};

export function SettingsAuthHeader({ title, onCancel }: SettingsAuthHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-[calc(4rem+var(--safe-area-top))] shrink-0 items-center justify-between border-b border-hairline bg-canvas px-5 pt-[var(--safe-area-top)]">
      <button
        type="button"
        onClick={onCancel}
        className="text-sm font-medium text-slate transition-colors hover:text-charcoal"
      >
        취소
      </button>
      <h1 className="text-lg font-semibold text-ink">{title}</h1>
      <span className="w-10" />
    </header>
  );
}
