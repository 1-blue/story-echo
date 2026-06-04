"use client";

import { Component, type ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/get-error-message";
import { DrawerContent } from "./drawer-content";

type DrawerPageClientProps = {
  writeHref: string;
};

type ErrorBoundaryProps = {
  children: ReactNode;
  onReset?: () => void;
  fallback: (error: Error, reset: () => void) => ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

class DrawerErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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

export function DrawerPageClient({ writeHref }: DrawerPageClientProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <DrawerErrorBoundary
          onReset={reset}
          fallback={(error) => (
            <div className="flex flex-1 flex-col items-center justify-center px-5 py-16 text-center">
              <p className="text-charcoal text-base font-medium">서랍을 불러오지 못했어요</p>
              <p className="text-stone mt-2 text-sm">{getErrorMessage(error)}</p>
            </div>
          )}
        >
          <DrawerContent writeHref={writeHref} />
        </DrawerErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
