"use client";

import { ErrorPage } from "@/components/errors/error-page";
import { getErrorMessage } from "@/lib/get-error-message";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body className="bg-canvas antialiased">
        <ErrorPage
          title="앱을 불러오지 못했어요"
          description={getErrorMessage(error)}
          primaryHref="/"
          primaryLabel="처음으로"
          onRetry={reset}
        />
      </body>
    </html>
  );
}
