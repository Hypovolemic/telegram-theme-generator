import { useEffect, type ReactNode } from 'react';

/**
 * Toast variant types
 */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

/**
 * Individual toast item
 */
export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Individual toast props
 */
interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

/**
 * Individual toast component
 */
export function Toast({ toast, onDismiss }: ToastProps) {
  const { id, title, message, variant, duration, dismissible, action } = toast;

  // Auto-dismiss after duration
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const variantStyles: Record<ToastVariant, { bg: string; border: string; icon: string }> = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-500',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-500',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-500',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-500',
    },
  };

  const styles = variantStyles[variant];

  const icons: Record<ToastVariant, ReactNode> = {
    success: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    ),
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
    info: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  };

  return (
    <div
      data-testid={`toast-${id}`}
      className={`
        flex items-start gap-3 p-4 min-w-[300px] max-w-[400px]
        ${styles.bg} border ${styles.border}
        rounded-lg shadow-lg
        animate-in slide-in-from-right fade-in duration-200
      `}
      role="alert"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${styles.icon}`}>
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          {icons[variant]}
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            {title}
          </h4>
        )}
        <p className="text-sm text-gray-700">
          {message}
        </p>
        
        {action && (
          <button
            data-testid={`toast-action-${id}`}
            onClick={action.onClick}
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Dismiss button */}
      {dismissible && (
        <button
          data-testid={`toast-dismiss-${id}`}
          onClick={() => onDismiss(id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-500 transition-colors"
          aria-label="Dismiss notification"
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
 * Standalone toast component for use without provider
 */
export interface StandaloneToastProps {
  title?: string;
  message: string;
  variant?: ToastVariant;
  onDismiss?: () => void;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function StandaloneToast({
  title,
  message,
  variant = 'info',
  onDismiss,
  dismissible = true,
  action,
  className = '',
}: StandaloneToastProps) {
  const toastItem: ToastItem = {
    id: 'standalone',
    title,
    message,
    variant,
    dismissible,
    action,
  };

  return (
    <div className={className}>
      <Toast
        toast={toastItem}
        onDismiss={() => onDismiss?.()}
      />
    </div>
  );
}

export default Toast;
