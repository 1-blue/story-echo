import { Component, type ErrorInfo, type ReactNode } from "react";
import { router } from "expo-router";
import { AppScreen, AppScreenButton } from "@/components/AppScreen";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class RootErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[StoryEcho] RootErrorBoundary", error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ error: null });
    router.replace("/");
  };

  render() {
    if (this.state.error) {
      return (
        <AppScreen
          title="문제가 발생했어요"
          body="앱을 다시 시작해 주세요. 같은 문제가 반복되면 최신 버전으로 업데이트해 주세요."
          action={<AppScreenButton label="다시 시도" onPress={this.handleRetry} />}
        />
      );
    }

    return this.props.children;
  }
}
