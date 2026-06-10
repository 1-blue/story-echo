export function RecipientSection() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-charcoal">받는 사람</h2>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-capsule px-4 py-2 text-sm font-medium text-primary-foreground">
          나에게
        </span>
        <span className="inline-flex cursor-not-allowed items-center rounded-full border border-hairline px-4 py-2 text-sm text-stone">
          다른 사람에게 (준비 중)
        </span>
      </div>
      <p className="text-xs leading-relaxed text-stone">
        지금은 나에게만 보낼 수 있어요. 곧 다른 사람에게도 보낼 수 있게 준비 중이에요.
      </p>
    </section>
  );
}
