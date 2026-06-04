type SettingsAuthHeaderProps = {
  title: string;
  onCancel: () => void;
};

export function SettingsAuthHeader({ title, onCancel }: SettingsAuthHeaderProps) {
  return (
    <header className="border-hairline bg-canvas sticky top-0 z-40 flex h-[calc(4rem+var(--safe-area-top))] shrink-0 items-center justify-between border-b px-5 pt-[var(--safe-area-top)]">
      <button
        type="button"
        onClick={onCancel}
        className="text-slate hover:text-charcoal text-sm font-medium transition-colors"
      >
        취소
      </button>
      <h1 className="text-ink text-lg font-semibold">{title}</h1>
      <span className="w-10" />
    </header>
  );
}
