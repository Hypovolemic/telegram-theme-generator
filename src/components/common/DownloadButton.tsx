import { useState, useCallback } from 'react';
import { downloadTheme, type DownloadResult } from '../../utils/file-utils';

/**
 * Download state type.
 */
export type DownloadState = 'idle' | 'downloading' | 'success' | 'error';

/**
 * Props for DownloadButton component.
 */
export interface DownloadButtonProps {
  /**
   * The theme content to download.
   */
  content: string;

  /**
   * The filename (without extension).
   */
  filename: string;

  /**
   * Callback when download succeeds.
   */
  onSuccess?: (result: DownloadResult) => void;

  /**
   * Callback when download fails.
   */
  onError?: (error: Error) => void;

  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;

  /**
   * Optional class name for styling.
   */
  className?: string;

  /**
   * Button variant.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline';

  /**
   * Button size.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Duration to show success/error state in ms.
   * @default 2000
   */
  feedbackDuration?: number;

  /**
   * Custom button text.
   */
  children?: React.ReactNode;
}

/**
 * Notification component for showing download feedback.
 */
function Notification({
  type,
  message,
  onDismiss,
}: {
  type: 'success' | 'error';
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div
      className={`
        fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        animate-in slide-in-from-bottom-2 duration-200
        ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
      `}
      role="alert"
      data-testid={`notification-${type}`}
    >
      {type === 'success' ? (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Dismiss notification"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

/**
 * DownloadButton component for downloading theme files.
 *
 * Features:
 * - Downloads .tdesktop-theme files
 * - Shows loading state during download
 * - Displays success/error notifications
 * - Supports multiple variants and sizes
 *
 * @example
 * ```tsx
 * <DownloadButton
 *   content={themeContent}
 *   filename="my-theme"
 *   onSuccess={() => console.log('Downloaded!')}
 * />
 * ```
 */
export function DownloadButton({
  content,
  filename,
  onSuccess,
  onError,
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'medium',
  feedbackDuration = 2000,
  children,
}: DownloadButtonProps) {
  const [state, setState] = useState<DownloadState>('idle');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const handleDownload = useCallback(async () => {
    if (disabled || state === 'downloading') return;

    setState('downloading');

    const result = await downloadTheme({
      filename,
      content,
      onStart: () => setState('downloading'),
      onSuccess: (downloadResult) => {
        setState('success');
        setNotification({
          type: 'success',
          message: `Downloaded ${downloadResult.filename}`,
        });
        onSuccess?.(downloadResult);

        setTimeout(() => {
          setState('idle');
          setNotification(null);
        }, feedbackDuration);
      },
      onError: (error) => {
        setState('error');
        setNotification({
          type: 'error',
          message: error.message || 'Download failed. Please try again.',
        });
        onError?.(error);

        setTimeout(() => {
          setState('idle');
          setNotification(null);
        }, feedbackDuration);
      },
    });

    // Handle case where callbacks weren't triggered
    if (!result.success && state === 'downloading') {
      setState('error');
      setNotification({
        type: 'error',
        message: result.error || 'Download failed. Please try again.',
      });
      setTimeout(() => {
        setState('idle');
        setNotification(null);
      }, feedbackDuration);
    }
  }, [content, filename, disabled, state, feedbackDuration, onSuccess, onError]);

  // Variant styles
  const variantStyles = {
    primary: `
      bg-blue-600 text-white hover:bg-blue-700 
      disabled:bg-blue-400 disabled:cursor-not-allowed
      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    `,
    secondary: `
      bg-gray-600 text-white hover:bg-gray-700
      disabled:bg-gray-400 disabled:cursor-not-allowed
      focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
    `,
    outline: `
      border-2 border-blue-600 text-blue-600 hover:bg-blue-50
      disabled:border-blue-300 disabled:text-blue-300 disabled:cursor-not-allowed
      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    `,
  };

  // Size styles
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  // State-specific styles
  const stateStyles = {
    idle: '',
    downloading: 'opacity-75 cursor-wait',
    success: variant === 'outline' ? 'border-green-600 text-green-600' : 'bg-green-600',
    error: variant === 'outline' ? 'border-red-600 text-red-600' : 'bg-red-600',
  };

  const buttonContent = () => {
    switch (state) {
      case 'downloading':
        return (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Downloading...
          </>
        );
      case 'success':
        return (
          <>
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Downloaded!
          </>
        );
      case 'error':
        return (
          <>
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Failed
          </>
        );
      default:
        return (
          children ?? (
            <>
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Theme
            </>
          )
        );
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleDownload}
        disabled={disabled || state === 'downloading'}
        className={`
          inline-flex items-center justify-center
          font-medium rounded-lg
          transition-all duration-200
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${stateStyles[state]}
          ${className}
        `}
        data-testid="download-button"
        aria-busy={state === 'downloading'}
      >
        {buttonContent()}
      </button>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onDismiss={dismissNotification}
        />
      )}
    </>
  );
}

export default DownloadButton;
