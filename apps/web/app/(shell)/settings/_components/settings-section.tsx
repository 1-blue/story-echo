import type { ReactNode } from "react";

type SettingsSectionProps = {
  title: string;
  children: ReactNode;
};

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="px-1 text-xs font-semibold tracking-wide text-stone uppercase">{title}</h3>
      <div className="overflow-hidden rounded-xl border border-hairline bg-white shadow-sm">
        {children}
      </div>
    </section>
  );
}

type SettingsRowProps = {
  label: string;
  value?: string;
  onClick?: () => void;
  children?: ReactNode;
  destructive?: boolean;
};

export function SettingsRow({ label, value, onClick, children, destructive }: SettingsRowProps) {
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className="flex min-h-14 w-full items-center justify-between gap-3 border-b border-hairline px-4 py-3 text-left last:border-b-0"
    >
      <span
        className={destructive ? "text-sm font-medium text-destructive" : "text-sm text-charcoal"}
      >
        {label}
      </span>
      {children ?? (value ? <span className="text-sm text-stone">{value}</span> : null)}
    </Comp>
  );
}
