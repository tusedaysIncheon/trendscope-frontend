import React from "react";

type AppErrorBoundaryProps = {
  children: React.ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Unhandled app error:", error);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="w-full max-w-[480px] rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h1 className="text-xl font-bold text-slate-900">화면을 불러오지 못했습니다</h1>
            <p className="mt-2 text-sm text-slate-500">
              일시적인 오류가 발생했습니다. 새로고침 후 다시 시도해 주세요.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-white"
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

