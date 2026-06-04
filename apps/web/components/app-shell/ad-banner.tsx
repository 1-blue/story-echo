export function AdBanner() {
  return (
    <aside
      aria-hidden="true"
      className="border-hairline bg-ad-banner pointer-events-none fixed inset-x-0 bottom-[var(--shell-tab-height)] z-40 flex h-[var(--ad-strip-height)] min-h-[var(--ad-strip-height)] shrink-0 items-center justify-center border-t px-5 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]"
    >
      <p className="text-stone flex items-center gap-2 text-xs">
        <span className="rounded-sm bg-white/50 px-1.5 py-0.5 text-[10px] tracking-wider text-slate uppercase">
          Ad
        </span>
        광고 영역
      </p>
    </aside>
  );
}
