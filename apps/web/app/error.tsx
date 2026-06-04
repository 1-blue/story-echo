"use client";

import { ErrorPage } from "@/components/errors/error-page";
import { getErrorMessage } from "@/lib/get-error-message";

export default function RootError({
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
      primaryHref="/"
      primaryLabel="시작하기"
      onRetry={reset}
    />
  );
}
