type DrawerPageHeaderProps = {
  statsLabel: string;
};

export function DrawerPageHeader({ statsLabel }: DrawerPageHeaderProps) {
  return (
    <header className="mb-6 text-center">
      <h2 className="mb-1 text-2xl font-semibold tracking-tight text-ink">서랍</h2>
      <p className="text-xs text-stone">{statsLabel}</p>
    </header>
  );
}
