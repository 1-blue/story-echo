"use client";

import { Component, Suspense, type ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ClientOnly } from "@/components/client-only";
import { getErrorMessage } from "@/lib/get-error-message";
import { CapsuleDetailContent } from "./capsule-detail-content";

type CapsuleDetailPageClientProps = {
  capsuleId: string;
};

function CapsuleDetailFallback() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <div className="h-16 border-b border-hairline" />
      <div className="space-y-4 px-5 py-6">
        <div className="mx-auto size-20 animate-pulse rounded-full bg-capsule-soft/40" />
        <div className="h-32 animate-pulse rounded-xl bg-surface-cream/60" />
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

class CapsuleDetailErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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

function CapsuleDetailPageInner({ capsuleId }: CapsuleDetailPageClientProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <CapsuleDetailErrorBoundary
          onReset={reset}
          fallback={(error) => (
            <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-5 py-16 text-center">
              <p className="text-base font-medium text-charcoal">타임캡슐을 불러오지 못했어요</p>
              <p className="mt-2 text-sm text-stone">{getErrorMessage(error)}</p>
            </div>
          )}
        >
          <Suspense fallback={<CapsuleDetailFallback />}>
            <CapsuleDetailContent capsuleId={capsuleId} />
          </Suspense>
        </CapsuleDetailErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export function CapsuleDetailPageClient({ capsuleId }: CapsuleDetailPageClientProps) {
  return (
    <ClientOnly fallback={<CapsuleDetailFallback />}>
      <CapsuleDetailPageInner capsuleId={capsuleId} />
    </ClientOnly>
  );
}
