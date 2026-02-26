/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { Toast, type ToastItem } from './Toast';

/**
 * Toast position options
 */
export type ToastPosition = 
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Toast context value
 */
interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Generate unique toast ID
 */
function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Toast provider props
 */
export interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

/**
 * Toast container props
 */
interface ToastContainerProps {
  toasts: ToastItem[];
  position: ToastPosition;
  onDismiss: (id: string) => void;
}

/**
 * Toast container component
 */
function ToastContainer({ toasts, position, onDismiss }: ToastContainerProps) {
  const positionClasses: Record<ToastPosition, string> = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="toast-container"
      className={`fixed z-50 flex flex-col gap-2 ${positionClasses[position]}`}
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/**
 * Toast provider component
 */
export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastItem, 'id'>): string => {
      const id = generateId();
      const newToast: ToastItem = {
        ...toast,
        id,
        dismissible: toast.dismissible ?? true,
        duration: toast.duration ?? (toast.variant === 'error' ? 0 : 5000),
      };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        // Remove oldest toasts if exceeding max
        return updated.slice(-maxToasts);
      });

      return id;
    },
    [maxToasts]
  );

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer
        toasts={toasts}
        position={position}
        onDismiss={removeToast}
      />
    </ToastContext.Provider>
  );
}

/**
 * Hook to use toast notifications
 */
export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, clearToasts, toasts } = context;

  const toast = useCallback(
    (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message'>>) => {
      return addToast({
        message,
        variant: 'info',
        ...options,
      });
    },
    [addToast]
  );

  const success = useCallback(
    (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) => {
      return addToast({ message, variant: 'success', ...options });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) => {
      return addToast({ message, variant: 'error', duration: 0, ...options });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) => {
      return addToast({ message, variant: 'warning', ...options });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) => {
      return addToast({ message, variant: 'info', ...options });
    },
    [addToast]
  );

  return {
    toast,
    success,
    error,
    warning,
    info,
    dismiss: removeToast,
    clearAll: clearToasts,
    toasts,
  };
}
