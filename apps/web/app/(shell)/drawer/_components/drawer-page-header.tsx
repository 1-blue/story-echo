type DrawerPageHeaderProps = {
  statsLabel: string;
};

export function DrawerPageHeader({ statsLabel }: DrawerPageHeaderProps) {
  return (
    <header className="mb-6 text-center">
      <h2 className="text-ink mb-1 text-2xl font-semibold tracking-tight">서랍</h2>
      <p className="text-stone text-xs">{statsLabel}</p>
    </header>
  );
}
