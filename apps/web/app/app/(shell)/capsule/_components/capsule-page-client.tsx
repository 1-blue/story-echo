"use client";

import { Component, type ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/get-error-message";
import { CapsuleContent } from "./capsule-content";

type ErrorBoundaryProps = {
  children: ReactNode;
  onReset?: () => void;
  fallback: (error: Error) => ReactNode;
};

type ErrorBoundaryState = { error: Error | null };

class CapsuleErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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

export function CapsulePageClient() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <CapsuleErrorBoundary
          onReset={reset}
          fallback={(error) => (
            <div className="flex flex-1 flex-col items-center justify-center px-5 py-16 text-center">
              <p className="text-charcoal text-base font-medium">타임캡슐을 불러오지 못했어요</p>
              <p className="text-stone mt-2 text-sm">{getErrorMessage(error)}</p>
            </div>
          )}
        >
          <CapsuleContent />
        </CapsuleErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
