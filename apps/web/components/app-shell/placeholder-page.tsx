type PlaceholderPageProps = {
  title: string;
  description?: string;
};

export function PlaceholderPage({ title, description = "다음 단계에서 구현합니다." }: PlaceholderPageProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5">
      <h1 className="text-charcoal text-lg font-semibold">{title}</h1>
      <p className="text-stone mt-2 text-sm">{description}</p>
    </main>
  );
}
