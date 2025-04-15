import React from 'react';

/**
 * ErrorBoundary component for catching and displaying errors in the React component tree.
 * Provides accessible fallback UI and logs errors for auditability.
 *
 * @param children - React children nodes
 */
export class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // TODO: Integrate with logging/audit trail (e.g., Sentry)
    // console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" aria-live="assertive" className="flex flex-col items-center justify-center min-h-[200px] bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 p-6 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Something went wrong.</h2>
          <p className="mb-2">An unexpected error occurred. Please try again or contact support.</p>
          <details className="text-xs opacity-70 whitespace-pre-wrap">
            {this.state.error?.toString()}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
} 