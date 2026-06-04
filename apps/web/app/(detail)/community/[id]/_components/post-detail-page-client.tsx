"use client";

import { Component, Suspense, type ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ClientOnly } from "@/components/client-only";
import { getErrorMessage } from "@/lib/get-error-message";
import { PostDetailContent } from "./post-detail-content";

type PostDetailPageClientProps = {
  postId: string;
};

function PostDetailFallback() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="border-hairline h-16 animate-pulse border-b bg-white" />
      <div className="space-y-4 px-5 py-6">
        <div className="bg-surface-cream/60 h-10 w-40 animate-pulse rounded" />
        <div className="bg-surface-cream/60 h-32 animate-pulse rounded-xl" />
        <div className="bg-surface-cream/60 h-24 animate-pulse rounded" />
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

class PostDetailErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
      return this.props.fallback(this.state.error);
    }
    return this.props.children;
  }
}

function PostDetailPageInner({ postId }: PostDetailPageClientProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <PostDetailErrorBoundary
          onReset={reset}
          fallback={(error) => (
            <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-16 text-center">
              <p className="text-charcoal text-base font-medium">토론을 불러오지 못했어요</p>
              <p className="text-stone mt-2 text-sm">{getErrorMessage(error)}</p>
            </div>
          )}
        >
          <Suspense fallback={<PostDetailFallback />}>
            <PostDetailContent postId={postId} />
          </Suspense>
        </PostDetailErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export function PostDetailPageClient({ postId }: PostDetailPageClientProps) {
  return (
    <ClientOnly fallback={<PostDetailFallback />}>
      <PostDetailPageInner postId={postId} />
    </ClientOnly>
  );
}
