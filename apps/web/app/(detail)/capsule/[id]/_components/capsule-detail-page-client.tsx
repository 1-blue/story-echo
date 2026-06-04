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
    <div className="bg-canvas flex min-h-dvh flex-col">
      <div className="border-hairline h-16 border-b" />
      <div className="space-y-4 px-5 py-6">
        <div className="bg-capsule-soft/40 mx-auto size-20 animate-pulse rounded-full" />
        <div className="bg-surface-cream/60 h-32 animate-pulse rounded-xl" />
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
            <div className="bg-canvas flex min-h-dvh flex-col items-center justify-center px-5 py-16 text-center">
              <p className="text-charcoal text-base font-medium">타임캡슐을 불러오지 못했어요</p>
              <p className="text-stone mt-2 text-sm">{getErrorMessage(error)}</p>
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
