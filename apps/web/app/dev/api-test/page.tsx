"use client";

import { Component, Suspense, type ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useGetApiV1StoriesSuspense } from "@storyecho/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StoryListItem } from "@/features/stories/types";

function StoriesContent() {
  const { data } = useGetApiV1StoriesSuspense();
  const stories: StoryListItem[] = data.data ?? [];

  if (stories.length === 0) {
    return (
      <p className="text-muted-foreground">
        이야기가 없습니다. DATABASE_URL 설정 후 POST로 추가하세요.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {stories.map((story) => (
        <Card key={story.id}>
          <CardHeader>
            <CardTitle className="text-base font-normal">{story.bodyText}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {new Date(story.createdAt).toLocaleString("ko-KR")}
          </CardContent>
        </Card>
      ))}
    </div>
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

class QueryErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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

export default function ApiTestPage() {
  return (
    <main className="mx-auto min-h-screen max-w-lg space-y-6 px-5 py-12">
      <div>
        <Badge variant="secondary">dev</Badge>
        <h1 className="mt-2 font-serif text-2xl">API 테스트</h1>
        <p className="text-sm text-muted-foreground">orval + TanStack Query (Suspense) 연동 확인</p>
      </div>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <QueryErrorBoundary
            onReset={reset}
            fallback={(error, resetError) => (
              <Card className="border-destructive">
                <CardContent className="space-y-3 pt-6 text-sm text-destructive">
                  <p>{error.message}</p>
                  <Button type="button" variant="outline" size="sm" onClick={resetError}>
                    다시 시도
                  </Button>
                </CardContent>
              </Card>
            )}
          >
            <Suspense fallback={<p className="text-muted-foreground">로딩 중…</p>}>
              <StoriesContent />
            </Suspense>
          </QueryErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </main>
  );
}
