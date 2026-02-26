import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import {
  Toast,
  StandaloneToast,
  type ToastItem,
} from './Toast';
import { ToastProvider, useToast } from './useToast';

describe('Toast', () => {
  const defaultToast: ToastItem = {
    id: 'test-toast',
    message: 'Test message',
    variant: 'info',
    dismissible: true,
  };

  describe('rendering', () => {
    it('should render the toast', () => {
      render(<Toast toast={defaultToast} onDismiss={vi.fn()} />);

      expect(screen.getByTestId('toast-test-toast')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should render title when provided', () => {
      render(
        <Toast
          toast={{ ...defaultToast, title: 'Test Title' }}
          onDismiss={vi.fn()}
        />
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should have alert role', () => {
      render(<Toast toast={defaultToast} onDismiss={vi.fn()} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('should render success variant', () => {
      render(
        <Toast
          toast={{ ...defaultToast, variant: 'success' }}
          onDismiss={vi.fn()}
        />
      );

      const toast = screen.getByTestId('toast-test-toast');
      expect(toast).toHaveClass('bg-green-50');
    });

    it('should render error variant', () => {
      render(
        <Toast
          toast={{ ...defaultToast, variant: 'error' }}
          onDismiss={vi.fn()}
        />
      );

      const toast = screen.getByTestId('toast-test-toast');
      expect(toast).toHaveClass('bg-red-50');
    });

    it('should render warning variant', () => {
      render(
        <Toast
          toast={{ ...defaultToast, variant: 'warning' }}
          onDismiss={vi.fn()}
        />
      );

      const toast = screen.getByTestId('toast-test-toast');
      expect(toast).toHaveClass('bg-yellow-50');
    });

    it('should render info variant', () => {
      render(
        <Toast
          toast={{ ...defaultToast, variant: 'info' }}
          onDismiss={vi.fn()}
        />
      );

      const toast = screen.getByTestId('toast-test-toast');
      expect(toast).toHaveClass('bg-blue-50');
    });
  });

  describe('dismiss', () => {
    it('should show dismiss button when dismissible', () => {
      render(
        <Toast
          toast={{ ...defaultToast, dismissible: true }}
          onDismiss={vi.fn()}
        />
      );

      expect(screen.getByTestId('toast-dismiss-test-toast')).toBeInTheDocument();
    });

    it('should not show dismiss button when not dismissible', () => {
      render(
        <Toast
          toast={{ ...defaultToast, dismissible: false }}
          onDismiss={vi.fn()}
        />
      );

      expect(screen.queryByTestId('toast-dismiss-test-toast')).not.toBeInTheDocument();
    });

    it('should call onDismiss when dismiss button clicked', () => {
      const onDismiss = vi.fn();

      render(
        <Toast
          toast={{ ...defaultToast, dismissible: true }}
          onDismiss={onDismiss}
        />
      );

      fireEvent.click(screen.getByTestId('toast-dismiss-test-toast'));
      expect(onDismiss).toHaveBeenCalledWith('test-toast');
    });
  });

  describe('auto-dismiss', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should auto-dismiss after duration', async () => {
      const onDismiss = vi.fn();

      render(
        <Toast
          toast={{ ...defaultToast, duration: 3000 }}
          onDismiss={onDismiss}
        />
      );

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(onDismiss).toHaveBeenCalledWith('test-toast');
    });

    it('should not auto-dismiss when duration is 0', async () => {
      const onDismiss = vi.fn();

      render(
        <Toast
          toast={{ ...defaultToast, duration: 0 }}
          onDismiss={onDismiss}
        />
      );

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe('action', () => {
    it('should render action button when provided', () => {
      const onClick = vi.fn();

      render(
        <Toast
          toast={{
            ...defaultToast,
            action: { label: 'Undo', onClick },
          }}
          onDismiss={vi.fn()}
        />
      );

      expect(screen.getByTestId('toast-action-test-toast')).toBeInTheDocument();
      expect(screen.getByText('Undo')).toBeInTheDocument();
    });

    it('should call action onClick when clicked', () => {
      const onClick = vi.fn();

      render(
        <Toast
          toast={{
            ...defaultToast,
            action: { label: 'Undo', onClick },
          }}
          onDismiss={vi.fn()}
        />
      );

      fireEvent.click(screen.getByTestId('toast-action-test-toast'));
      expect(onClick).toHaveBeenCalled();
    });
  });
});

describe('ToastProvider', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(
        <ToastProvider>
          <div data-testid="child">Child content</div>
        </ToastProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should not render container when no toasts', () => {
      render(
        <ToastProvider>
          <div>Child</div>
        </ToastProvider>
      );

      expect(screen.queryByTestId('toast-container')).not.toBeInTheDocument();
    });
  });

  describe('position', () => {
    const TestComponent = () => {
      const { success } = useToast();
      return (
        <button onClick={() => success('Test')}>
          Add Toast
        </button>
      );
    };

    it('should position top-right by default', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Add Toast'));

      expect(screen.getByTestId('toast-container')).toHaveClass('top-4', 'right-4');
    });

    it('should position bottom-left when specified', () => {
      render(
        <ToastProvider position="bottom-left">
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Add Toast'));

      expect(screen.getByTestId('toast-container')).toHaveClass('bottom-4', 'left-4');
    });
  });
});

describe('useToast', () => {
  function wrapper({ children }: { children: ReactNode }) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useToast());
    }).toThrow('useToast must be used within a ToastProvider');
  });

  describe('toast methods', () => {
    it('should add success toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.success('Success message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].variant).toBe('success');
      expect(result.current.toasts[0].message).toBe('Success message');
    });

    it('should add error toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.error('Error message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].variant).toBe('error');
      expect(result.current.toasts[0].duration).toBe(0); // Error toasts don't auto-dismiss
    });

    it('should add warning toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.warning('Warning message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].variant).toBe('warning');
    });

    it('should add info toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.info('Info message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].variant).toBe('info');
    });

    it('should add generic toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.toast('Generic message', { variant: 'success' });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].variant).toBe('success');
    });

    it('should return toast id', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      let toastId: string = '';
      act(() => {
        toastId = result.current.success('Test');
      });

      expect(toastId).toMatch(/^toast-/);
    });
  });

  describe('dismiss', () => {
    it('should dismiss toast by id', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      let toastId: string = '';
      act(() => {
        toastId = result.current.success('Test');
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.dismiss(toastId);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should clear all toasts', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.success('Toast 1');
        result.current.success('Toast 2');
        result.current.success('Toast 3');
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.clearAll();
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });

  describe('max toasts', () => {
    function limitedWrapper({ children }: { children: ReactNode }) {
      return <ToastProvider maxToasts={2}>{children}</ToastProvider>;
    }

    it('should limit number of toasts', () => {
      const { result } = renderHook(() => useToast(), { wrapper: limitedWrapper });

      act(() => {
        result.current.success('Toast 1');
        result.current.success('Toast 2');
        result.current.success('Toast 3');
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts[0].message).toBe('Toast 2');
      expect(result.current.toasts[1].message).toBe('Toast 3');
    });
  });

  describe('options', () => {
    it('should accept title option', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.success('Message', { title: 'Success!' });
      });

      expect(result.current.toasts[0].title).toBe('Success!');
    });

    it('should accept duration option', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.success('Message', { duration: 10000 });
      });

      expect(result.current.toasts[0].duration).toBe(10000);
    });

    it('should accept dismissible option', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.success('Message', { dismissible: false });
      });

      expect(result.current.toasts[0].dismissible).toBe(false);
    });

    it('should accept action option', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      const onClick = vi.fn();

      act(() => {
        result.current.success('Message', {
          action: { label: 'Undo', onClick },
        });
      });

      expect(result.current.toasts[0].action?.label).toBe('Undo');
    });
  });
});

describe('StandaloneToast', () => {
  it('should render without provider', () => {
    render(<StandaloneToast message="Standalone message" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Standalone message')).toBeInTheDocument();
  });

  it('should accept variant prop', () => {
    render(<StandaloneToast message="Error" variant="error" />);

    expect(screen.getByRole('alert')).toHaveClass('bg-red-50');
  });

  it('should call onDismiss when dismissed', () => {
    const onDismiss = vi.fn();

    render(<StandaloneToast message="Test" onDismiss={onDismiss} />);

    fireEvent.click(screen.getByLabelText('Dismiss notification'));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<StandaloneToast message="Test" className="custom-class" />);

    expect(screen.getByRole('alert').parentElement).toHaveClass('custom-class');
  });
});
