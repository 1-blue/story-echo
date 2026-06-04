"use client";

import { Component, Suspense, useState, type ReactNode } from "react";
import Link from "next/link";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ClientOnly } from "@/components/client-only";
import { Button } from "@/components/ui/button";
import { getErrorMessage, isNotFoundError } from "@/lib/get-error-message";
import { useFontSize } from "../_hooks/use-font-size";
import { FontSizeDialog } from "./font-size-dialog";
import { StoryDetailContent } from "./story-detail-content";
import { StoryDetailHeader } from "./story-detail-header";

function StoryDetailFallback() {
  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-5 py-6">
      <div className="mb-6 flex gap-2">
        <div className="bg-surface-cream/60 h-7 w-32 animate-pulse rounded-full" />
      </div>
      <div className="bg-surface-cream/60 mb-8 h-10 w-full animate-pulse rounded" />
      <div className="space-y-3">
        <div className="bg-surface-cream/60 h-4 w-full animate-pulse rounded" />
        <div className="bg-surface-cream/60 h-4 w-full animate-pulse rounded" />
        <div className="bg-surface-cream/60 h-4 w-3/4 animate-pulse rounded" />
      </div>
    </main>
  );
}

type ErrorBoundaryProps = {
  children: ReactNode;
  onReset?: () => void;
  fallback: (error: Error, reset: () => void) => ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

class StoryDetailErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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

type StoryDetailPageClientProps = {
  storyId: string;
};

function StoryDetailPageInner({ storyId }: StoryDetailPageClientProps) {
  const { fontSize, setFontSize } = useFontSize();
  const [fontDialogOpen, setFontDialogOpen] = useState(false);

  return (
    <div className="bg-canvas text-foreground mx-auto flex min-h-dvh w-full max-w-lg flex-col">
      <StoryDetailHeader storyId={storyId} onFontSizeClick={() => setFontDialogOpen(true)} />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <StoryDetailErrorBoundary
            onReset={reset}
            fallback={(error, retry) => {
              const isNotFound = isNotFoundError(error);

              return (
                <div className="flex flex-1 flex-col items-center justify-center px-5 py-16 text-center">
                  <p className="text-charcoal text-base font-medium">
                    {isNotFound ? "이야기를 찾을 수 없어요" : "이야기를 불러오지 못했어요"}
                  </p>
                  <p className="text-stone mt-2 text-sm">{getErrorMessage(error)}</p>
                  <div className="mt-6 flex gap-3">
                    {!isNotFound && (
                      <Button type="button" variant="outline" className="rounded-full" onClick={retry}>
                        다시 시도
                      </Button>
                    )}
                    <Button asChild className="rounded-full">
                      <Link href="/app/drawer">서랍으로</Link>
                    </Button>
                  </div>
                </div>
              );
            }}
          >
            <Suspense fallback={<StoryDetailFallback />}>
              <StoryDetailContent storyId={storyId} fontSize={fontSize} />
            </Suspense>
          </StoryDetailErrorBoundary>
        )}
      </QueryErrorResetBoundary>
      <FontSizeDialog
        open={fontDialogOpen}
        onOpenChange={setFontDialogOpen}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
    </div>
  );
}

export function StoryDetailPageClient({ storyId }: StoryDetailPageClientProps) {
  return (
    <ClientOnly fallback={<StoryDetailFallback />}>
      <StoryDetailPageInner storyId={storyId} />
    </ClientOnly>
  );
}
