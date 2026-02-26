import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AppError, ErrorCode, normalizeError, logError } from '../../utils/error-handling';

/**
 * ErrorBoundary component props
 */
export interface ErrorBoundaryProps {
  /**
   * Child components to render
   */
  children: ReactNode;
  
  /**
   * Custom fallback UI when error occurs
   */
  fallback?: ReactNode | ((error: AppError, reset: () => void) => ReactNode);
  
  /**
   * Callback when error is caught
   */
  onError?: (error: AppError, errorInfo: ErrorInfo) => void;
  
  /**
   * Whether to log errors to console
   * @default true
   */
  logErrors?: boolean;
  
  /**
   * Context label for error logging
   */
  context?: string;
}

/**
 * ErrorBoundary component state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
}

/**
 * ErrorBoundary component
 * 
 * Catches JavaScript errors in child component tree, logs them,
 * and displays a fallback UI instead of crashing the whole app.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const appError = normalizeError(error);
    return { hasError: true, error: appError };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, logErrors = true, context } = this.props;
    const appError = normalizeError(error);

    if (logErrors) {
      logError(appError, context ?? 'ErrorBoundary');
      console.error('Component stack:', errorInfo.componentStack);
    }

    onError?.(appError, errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      if (typeof fallback === 'function') {
        return fallback(error, this.resetError);
      }

      if (fallback) {
        return fallback;
      }

      return (
        <DefaultErrorFallback
          error={error}
          onReset={this.resetError}
        />
      );
    }

    return children;
  }
}

/**
 * Default error fallback UI props
 */
interface DefaultErrorFallbackProps {
  error: AppError;
  onReset: () => void;
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({ error, onReset }: DefaultErrorFallbackProps) {
  return (
    <div
      data-testid="error-fallback"
      className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-red-50 border border-red-200 rounded-lg"
      role="alert"
    >
      <div className="flex items-center justify-center w-12 h-12 mb-4 bg-red-100 rounded-full">
        <svg
          className="w-6 h-6 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      
      <h2 className="mb-2 text-lg font-semibold text-red-800">
        Something went wrong
      </h2>
      
      <p className="mb-4 text-sm text-center text-red-600 max-w-md">
        {error.userMessage}
      </p>
      
      <div className="flex gap-3">
        <button
          data-testid="error-reset-button"
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Try again
        </button>
        
        <button
          data-testid="error-reload-button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Reload page
        </button>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 w-full max-w-md">
          <summary className="text-xs text-red-500 cursor-pointer hover:text-red-600">
            Technical details
          </summary>
          <pre className="mt-2 p-3 text-xs bg-red-100 rounded overflow-auto max-h-32">
            {`Code: ${error.code}\nMessage: ${error.message}\n${error.stack ?? ''}`}
          </pre>
        </details>
      )}
    </div>
  );
}

/**
 * Inline error display for smaller error states
 */
export interface InlineErrorProps {
  /**
   * Error to display
   */
  error: AppError | Error | string;
  
  /**
   * Retry callback
   */
  onRetry?: () => void;
  
  /**
   * Dismiss callback
   */
  onDismiss?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function InlineError({
  error,
  onRetry,
  onDismiss,
  className = '',
}: InlineErrorProps) {
  const appError = typeof error === 'string'
    ? new AppError({ code: ErrorCode.UNKNOWN_ERROR, message: error })
    : normalizeError(error);

  return (
    <div
      data-testid="inline-error"
      className={`flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg ${className}`}
      role="alert"
    >
      <svg
        className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-red-700">
          {appError.userMessage}
        </p>
        
        {(onRetry || onDismiss) && (
          <div className="mt-2 flex gap-2">
            {onRetry && (
              <button
                data-testid="inline-error-retry"
                onClick={onRetry}
                className="text-xs font-medium text-red-700 hover:text-red-800 underline"
              >
                Try again
              </button>
            )}
            {onDismiss && (
              <button
                data-testid="inline-error-dismiss"
                onClick={onDismiss}
                className="text-xs font-medium text-red-500 hover:text-red-600"
              >
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>
      
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-red-400 hover:text-red-500"
          aria-label="Dismiss error"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * Hook-friendly error state component
 */
export interface ErrorStateProps {
  /**
   * Title for the error state
   */
  title?: string;
  
  /**
   * Description or error message
   */
  description: string;
  
  /**
   * Icon to display
   * @default 'error'
   */
  icon?: 'error' | 'warning' | 'empty';
  
  /**
   * Primary action
   */
  action?: {
    label: string;
    onClick: () => void;
  };
  
  /**
   * Secondary action
   */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  icon = 'error',
  action,
  secondaryAction,
  className = '',
}: ErrorStateProps) {
  const iconColors = {
    error: 'text-red-500 bg-red-100',
    warning: 'text-yellow-500 bg-yellow-100',
    empty: 'text-gray-400 bg-gray-100',
  };

  const icons = {
    error: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    ),
    warning: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    ),
    empty: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    ),
  };

  return (
    <div
      data-testid="error-state"
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div
        className={`flex items-center justify-center w-16 h-16 mb-4 rounded-full ${iconColors[icon]}`}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          {icons[icon]}
        </svg>
      </div>
      
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {title}
      </h3>
      
      <p className="mb-6 text-sm text-gray-500 max-w-sm">
        {description}
      </p>
      
      {(action || secondaryAction) && (
        <div className="flex gap-3">
          {action && (
            <button
              data-testid="error-state-action"
              onClick={action.onClick}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              data-testid="error-state-secondary-action"
              onClick={secondaryAction.onClick}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ErrorBoundary;
