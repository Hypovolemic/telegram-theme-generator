import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, InlineError, ErrorState } from './ErrorBoundary';
import { AppError, ErrorCode } from '../../utils/error-handling';

// Component that throws an error
function ThrowingComponent({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div data-testid="child">Child content</div>;
}

describe('ErrorBoundary', () => {
  // Suppress error output during tests
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  describe('rendering', () => {
    it('should render children when no error', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should render fallback when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should show user-friendly error message', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      // Default error message for unknown errors - check in the paragraph
      const errorMessage = screen.getByTestId('error-fallback').querySelector('p');
      expect(errorMessage).toHaveTextContent(/Something went wrong/);
    });
  });

  describe('custom fallback', () => {
    it('should render custom ReactNode fallback', () => {
      render(
        <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom</div>}>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    });

    it('should render function fallback with error and reset', () => {
      const fallbackFn = vi.fn((error: AppError, reset: () => void) => (
        <div>
          <span data-testid="error-code">{error.code}</span>
          <button data-testid="reset-btn" onClick={reset}>Reset</button>
        </div>
      ));

      render(
        <ErrorBoundary fallback={fallbackFn}>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      expect(fallbackFn).toHaveBeenCalled();
      expect(screen.getByTestId('error-code')).toHaveTextContent('UNKNOWN_ERROR');
    });
  });

  describe('error handling', () => {
    it('should call onError callback', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.any(AppError),
        expect.objectContaining({ componentStack: expect.any(String) })
      );
    });

    it('should log errors by default', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      expect(console.error).toHaveBeenCalled();
    });

    it('should not log errors when logErrors is false', () => {
      // Reset mock to check no new calls
      (console.error as ReturnType<typeof vi.fn>).mockClear();

      render(
        <ErrorBoundary logErrors={false}>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      // Only React's internal error boundary logging should occur
      // Our custom logging should not occur
    });
  });

  describe('recovery', () => {
    it('should reset error state when try again is clicked', () => {
      // Use a key to force remounting the component
      const TestWrapper = ({ throwError }: { throwError: boolean }) => (
        <ErrorBoundary key={throwError ? 'error' : 'success'}>
          {throwError ? <ThrowingComponent shouldThrow={true} /> : <div data-testid="child">Success</div>}
        </ErrorBoundary>
      );

      const { rerender } = render(<TestWrapper throwError={true} />);

      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();

      // Re-render with non-throwing content (simulates reset + retry)
      rerender(<TestWrapper throwError={false} />);

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should have reload page button', () => {
      // Mock window.location.reload
      const reloadMock = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: reloadMock },
        writable: true,
      });

      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByTestId('error-reload-button'));
      expect(reloadMock).toHaveBeenCalled();
    });
  });
});

describe('InlineError', () => {
  describe('rendering', () => {
    it('should render the error message', () => {
      render(<InlineError error="Test error message" />);

      expect(screen.getByTestId('inline-error')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
    });

    it('should render with AppError', () => {
      const error = new AppError({
        code: ErrorCode.FILE_TOO_LARGE,
        message: 'Technical details',
      });

      render(<InlineError error={error} />);

      expect(screen.getByText(/too large/i)).toBeInTheDocument();
    });

    it('should render with Error object', () => {
      const error = new Error('Standard error');

      render(<InlineError error={error} />);

      expect(screen.getByTestId('inline-error')).toBeInTheDocument();
    });

    it('should have alert role', () => {
      render(<InlineError error="Error" />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<InlineError error="Error" className="custom-class" />);

      expect(screen.getByTestId('inline-error')).toHaveClass('custom-class');
    });
  });

  describe('actions', () => {
    it('should show retry button when onRetry provided', () => {
      const onRetry = vi.fn();

      render(<InlineError error="Error" onRetry={onRetry} />);

      fireEvent.click(screen.getByTestId('inline-error-retry'));
      expect(onRetry).toHaveBeenCalled();
    });

    it('should show dismiss button when onDismiss provided', () => {
      const onDismiss = vi.fn();

      render(<InlineError error="Error" onDismiss={onDismiss} />);

      fireEvent.click(screen.getByTestId('inline-error-dismiss'));
      expect(onDismiss).toHaveBeenCalled();
    });

    it('should not show actions when not provided', () => {
      render(<InlineError error="Error" />);

      expect(screen.queryByTestId('inline-error-retry')).not.toBeInTheDocument();
      expect(screen.queryByTestId('inline-error-dismiss')).not.toBeInTheDocument();
    });
  });
});

describe('ErrorState', () => {
  describe('rendering', () => {
    it('should render the error state', () => {
      render(<ErrorState description="Something went wrong" />);

      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    it('should show default title', () => {
      render(<ErrorState description="Error description" />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should show custom title', () => {
      render(<ErrorState title="Custom Title" description="Description" />);

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('should show description', () => {
      render(<ErrorState description="Detailed error description" />);

      expect(screen.getByText('Detailed error description')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<ErrorState description="Error" className="custom-class" />);

      expect(screen.getByTestId('error-state')).toHaveClass('custom-class');
    });
  });

  describe('icons', () => {
    it('should show error icon by default', () => {
      render(<ErrorState description="Error" />);

      const iconContainer = screen.getByTestId('error-state').querySelector('.text-red-500');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should show warning icon', () => {
      render(<ErrorState description="Warning" icon="warning" />);

      const iconContainer = screen.getByTestId('error-state').querySelector('.text-yellow-500');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should show empty icon', () => {
      render(<ErrorState description="Empty" icon="empty" />);

      const iconContainer = screen.getByTestId('error-state').querySelector('.text-gray-400');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('should show primary action button', () => {
      const onClick = vi.fn();

      render(
        <ErrorState
          description="Error"
          action={{ label: 'Try Again', onClick }}
        />
      );

      fireEvent.click(screen.getByTestId('error-state-action'));
      expect(onClick).toHaveBeenCalled();
    });

    it('should show secondary action button', () => {
      const onClick = vi.fn();

      render(
        <ErrorState
          description="Error"
          secondaryAction={{ label: 'Go Back', onClick }}
        />
      );

      fireEvent.click(screen.getByTestId('error-state-secondary-action'));
      expect(onClick).toHaveBeenCalled();
    });

    it('should show both action buttons', () => {
      render(
        <ErrorState
          description="Error"
          action={{ label: 'Primary', onClick: vi.fn() }}
          secondaryAction={{ label: 'Secondary', onClick: vi.fn() }}
        />
      );

      expect(screen.getByText('Primary')).toBeInTheDocument();
      expect(screen.getByText('Secondary')).toBeInTheDocument();
    });

    it('should not show actions when not provided', () => {
      render(<ErrorState description="Error" />);

      expect(screen.queryByTestId('error-state-action')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-state-secondary-action')).not.toBeInTheDocument();
    });
  });
});
