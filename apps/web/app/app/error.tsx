"use client";

import { ErrorPage } from "@/components/errors/error-page";
import { getErrorMessage } from "@/lib/get-error-message";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage
      title="문제가 발생했어요"
      description={getErrorMessage(error)}
      primaryHref="/app"
      primaryLabel="홈으로"
      secondaryHref="/app/drawer"
      secondaryLabel="서랍으로"
      onRetry={reset}
    />
  );
}
