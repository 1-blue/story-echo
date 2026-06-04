"use client";

import { Component, type ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/get-error-message";
import { CommunityContent } from "./community-content";

type ErrorBoundaryProps = {
  children: ReactNode;
  onReset?: () => void;
  fallback: (error: Error, reset: () => void) => ReactNode;
};

type ErrorBoundaryState = { error: Error | null };

class CommunityErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  reset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return this.props.children;
  }
}

export function CommunityPageClient() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <CommunityErrorBoundary
          onReset={reset}
          fallback={(error) => (
            <div className="flex flex-1 flex-col items-center justify-center px-5 py-16 text-center">
              <p className="text-charcoal text-base font-medium">커뮤니티를 불러오지 못했어요</p>
              <p className="text-stone mt-2 text-sm">{getErrorMessage(error)}</p>
            </div>
          )}
        >
          <CommunityContent />
        </CommunityErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
