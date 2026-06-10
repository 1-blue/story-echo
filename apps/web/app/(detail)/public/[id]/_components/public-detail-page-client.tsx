"use client";

import { Component, Suspense, type ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ClientOnly } from "@/components/client-only";
import { getErrorMessage } from "@/lib/get-error-message";
import { PublicDetailContent } from "./public-detail-content";

type PublicDetailPageClientProps = {
  storyId: string;
};

function PublicDetailFallback() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="h-16 animate-pulse border-b border-hairline bg-white" />
      <div className="space-y-4 px-5 py-6">
        <div className="h-10 w-40 animate-pulse rounded bg-surface-cream/60" />
        <div className="h-32 animate-pulse rounded-xl bg-surface-cream/60" />
        <div className="h-24 animate-pulse rounded bg-surface-cream/60" />
      </div>
    </div>
  );
}

type ErrorBoundaryProps = {
  children: ReactNode;
  onReset?: () => void;
  fallback: (error: Error) => ReactNode;
};

type ErrorBoundaryState = { error: Error | null };

class PublicDetailErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error);
    }
    return this.props.children;
  }
}

function PublicDetailPageInner({ storyId }: PublicDetailPageClientProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <PublicDetailErrorBoundary
          fallback={(error) => (
            <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-16 text-center">
              <p className="text-base font-medium text-charcoal">이야기를 불러오지 못했어요</p>
              <p className="mt-2 text-sm text-stone">{getErrorMessage(error)}</p>
              <button
                type="button"
                className="mt-4 text-sm font-medium text-primary"
                onClick={() => reset()}
              >
                다시 시도
              </button>
            </div>
          )}
        >
          <Suspense fallback={<PublicDetailFallback />}>
            <PublicDetailContent storyId={storyId} />
          </Suspense>
        </PublicDetailErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export function PublicDetailPageClient({ storyId }: PublicDetailPageClientProps) {
  return (
    <ClientOnly fallback={<PublicDetailFallback />}>
      <PublicDetailPageInner storyId={storyId} />
    </ClientOnly>
  );
}
