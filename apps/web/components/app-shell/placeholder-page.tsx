type PlaceholderPageProps = {
  title: string;
  description?: string;
};

export function PlaceholderPage({
  title,
  description = "다음 단계에서 구현합니다.",
}: PlaceholderPageProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5">
      <h1 className="text-lg font-semibold text-charcoal">{title}</h1>
      <p className="mt-2 text-sm text-stone">{description}</p>
    </main>
  );
}
