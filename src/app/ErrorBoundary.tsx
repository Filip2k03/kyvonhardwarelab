import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  readonly children: ReactNode
  readonly fallbackTitle?: string
}

interface ErrorBoundaryState {
  readonly hasError: boolean
  readonly message: string | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, message: null }
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected error occurred.',
    }
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, message: null })
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="mx-auto flex max-w-lg flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
        >
          <h1 className="text-lg font-semibold text-[var(--color-text)]">
            {this.props.fallbackTitle ?? 'Something went wrong'}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            {this.state.message ?? 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex w-fit items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent-strong)] px-3 py-2 text-sm font-medium text-[var(--color-bg)]"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
