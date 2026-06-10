import Link from "next/link";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  onRetry?: () => void;
};

export function ErrorPage({
  title,
  description,
  primaryHref = "/",
  primaryLabel = "홈으로",
  secondaryHref,
  secondaryLabel,
  onRetry,
}: ErrorPageProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-6 py-16 text-center text-foreground">
      <h1 className="text-2xl font-semibold text-ink">{title}</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone">{description}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button type="button" variant="outline" className="rounded-full" onClick={onRetry}>
            다시 시도
          </Button>
        )}
        <Button asChild className="rounded-full">
          <Link href={primaryHref}>{primaryLabel}</Link>
        </Button>
        {secondaryHref && secondaryLabel && (
          <Button asChild variant="outline" className="rounded-full">
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        )}
      </div>
    </main>
  );
}
