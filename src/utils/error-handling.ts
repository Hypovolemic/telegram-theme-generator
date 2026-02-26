/**
 * Error handling utilities for the Telegram Theme Generator
 */

/**
 * Application error codes
 */
export enum ErrorCode {
  // File upload errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  FILE_INVALID_TYPE = 'FILE_INVALID_TYPE',
  FILE_READ_ERROR = 'FILE_READ_ERROR',
  FILE_UPLOAD_CANCELLED = 'FILE_UPLOAD_CANCELLED',
  
  // Color extraction errors
  COLOR_EXTRACTION_FAILED = 'COLOR_EXTRACTION_FAILED',
  IMAGE_LOAD_ERROR = 'IMAGE_LOAD_ERROR',
  CANVAS_ERROR = 'CANVAS_ERROR',
  INSUFFICIENT_COLORS = 'INSUFFICIENT_COLORS',
  
  // Theme generation errors
  THEME_GENERATION_FAILED = 'THEME_GENERATION_FAILED',
  THEME_VALIDATION_FAILED = 'THEME_VALIDATION_FAILED',
  CONTRAST_OPTIMIZATION_FAILED = 'CONTRAST_OPTIMIZATION_FAILED',
  
  // Download errors
  DOWNLOAD_FAILED = 'DOWNLOAD_FAILED',
  BLOB_CREATION_FAILED = 'BLOB_CREATION_FAILED',
  
  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  BROWSER_NOT_SUPPORTED = 'BROWSER_NOT_SUPPORTED',
}

/**
 * Error severity levels
 */
export type ErrorSeverity = 'error' | 'warning' | 'info';

/**
 * Recovery action types
 */
export interface RecoveryAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary';
}

/**
 * Application error with additional context
 */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly severity: ErrorSeverity;
  readonly userMessage: string;
  readonly technicalDetails?: string;
  readonly recoveryActions?: RecoveryAction[];
  readonly timestamp: Date;

  constructor(options: {
    code: ErrorCode;
    message: string;
    userMessage?: string;
    severity?: ErrorSeverity;
    technicalDetails?: string;
    recoveryActions?: RecoveryAction[];
    cause?: Error;
  }) {
    super(options.message);
    this.name = 'AppError';
    this.code = options.code;
    this.severity = options.severity ?? 'error';
    this.userMessage = options.userMessage ?? getUserFriendlyMessage(options.code);
    this.technicalDetails = options.technicalDetails;
    this.recoveryActions = options.recoveryActions;
    this.timestamp = new Date();
    
    if (options.cause) {
      this.cause = options.cause;
    }
    
    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Get user-friendly error message for error code
 */
export function getUserFriendlyMessage(code: ErrorCode): string {
  const messages: Record<ErrorCode, string> = {
    // File upload errors
    [ErrorCode.FILE_TOO_LARGE]: 'The file is too large. Please select an image under 10MB.',
    [ErrorCode.FILE_INVALID_TYPE]: 'This file type is not supported. Please upload a PNG, JPG, or WebP image.',
    [ErrorCode.FILE_READ_ERROR]: 'Unable to read the file. Please try selecting it again.',
    [ErrorCode.FILE_UPLOAD_CANCELLED]: 'File upload was cancelled.',
    
    // Color extraction errors
    [ErrorCode.COLOR_EXTRACTION_FAILED]: 'Unable to extract colors from the image. Please try a different image.',
    [ErrorCode.IMAGE_LOAD_ERROR]: 'Unable to load the image. The file may be corrupted.',
    [ErrorCode.CANVAS_ERROR]: 'Unable to process the image. Your browser may not support this feature.',
    [ErrorCode.INSUFFICIENT_COLORS]: 'The image doesn\'t have enough colors. Please try a more colorful image.',
    
    // Theme generation errors
    [ErrorCode.THEME_GENERATION_FAILED]: 'Unable to generate the theme. Please try again.',
    [ErrorCode.THEME_VALIDATION_FAILED]: 'The generated theme is invalid. Please try a different image.',
    [ErrorCode.CONTRAST_OPTIMIZATION_FAILED]: 'Unable to optimize colors for accessibility. Using default contrast settings.',
    
    // Download errors
    [ErrorCode.DOWNLOAD_FAILED]: 'Unable to download the file. Please check your browser settings.',
    [ErrorCode.BLOB_CREATION_FAILED]: 'Unable to create the theme file. Please try again.',
    
    // General errors
    [ErrorCode.UNKNOWN_ERROR]: 'Something went wrong. Please try again.',
    [ErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection and try again.',
    [ErrorCode.BROWSER_NOT_SUPPORTED]: 'Your browser doesn\'t support this feature. Please try a modern browser.',
  };
  
  return messages[code] ?? messages[ErrorCode.UNKNOWN_ERROR];
}

/**
 * Create file upload error
 */
export function createFileUploadError(
  type: 'size' | 'type' | 'read' | 'cancelled',
  details?: { maxSize?: number; allowedTypes?: string[]; originalError?: Error }
): AppError {
  const errorMap: Record<string, { code: ErrorCode; message: string }> = {
    size: {
      code: ErrorCode.FILE_TOO_LARGE,
      message: `File exceeds maximum size${details?.maxSize ? ` of ${formatBytes(details.maxSize)}` : ''}`,
    },
    type: {
      code: ErrorCode.FILE_INVALID_TYPE,
      message: `Invalid file type${details?.allowedTypes ? `. Allowed: ${details.allowedTypes.join(', ')}` : ''}`,
    },
    read: {
      code: ErrorCode.FILE_READ_ERROR,
      message: 'Failed to read file',
    },
    cancelled: {
      code: ErrorCode.FILE_UPLOAD_CANCELLED,
      message: 'Upload cancelled by user',
    },
  };

  const { code, message } = errorMap[type] ?? errorMap.read;

  return new AppError({
    code,
    message,
    severity: type === 'cancelled' ? 'info' : 'error',
    cause: details?.originalError,
    recoveryActions: type !== 'cancelled' ? [
      { label: 'Try another file', action: () => {}, variant: 'primary' },
    ] : undefined,
  });
}

/**
 * Create color extraction error
 */
export function createColorExtractionError(
  type: 'load' | 'canvas' | 'extraction' | 'insufficient',
  details?: { originalError?: Error; colorCount?: number }
): AppError {
  const errorMap: Record<string, { code: ErrorCode; message: string }> = {
    load: {
      code: ErrorCode.IMAGE_LOAD_ERROR,
      message: 'Failed to load image for processing',
    },
    canvas: {
      code: ErrorCode.CANVAS_ERROR,
      message: 'Canvas operation failed',
    },
    extraction: {
      code: ErrorCode.COLOR_EXTRACTION_FAILED,
      message: 'Color extraction algorithm failed',
    },
    insufficient: {
      code: ErrorCode.INSUFFICIENT_COLORS,
      message: `Not enough unique colors found${details?.colorCount !== undefined ? ` (found ${details.colorCount})` : ''}`,
    },
  };

  const { code, message } = errorMap[type] ?? errorMap.extraction;

  return new AppError({
    code,
    message,
    cause: details?.originalError,
    recoveryActions: [
      { label: 'Try another image', action: () => {}, variant: 'primary' },
    ],
  });
}

/**
 * Create theme generation error
 */
export function createThemeGenerationError(
  type: 'generation' | 'validation' | 'contrast',
  details?: { originalError?: Error; validationErrors?: string[] }
): AppError {
  const errorMap: Record<string, { code: ErrorCode; message: string; severity: ErrorSeverity }> = {
    generation: {
      code: ErrorCode.THEME_GENERATION_FAILED,
      message: 'Theme generation failed',
      severity: 'error',
    },
    validation: {
      code: ErrorCode.THEME_VALIDATION_FAILED,
      message: `Theme validation failed${details?.validationErrors ? `: ${details.validationErrors.join(', ')}` : ''}`,
      severity: 'error',
    },
    contrast: {
      code: ErrorCode.CONTRAST_OPTIMIZATION_FAILED,
      message: 'Contrast optimization failed',
      severity: 'warning',
    },
  };

  const { code, message, severity } = errorMap[type] ?? errorMap.generation;

  return new AppError({
    code,
    message,
    severity,
    cause: details?.originalError,
    recoveryActions: [
      { label: 'Try again', action: () => {}, variant: 'primary' },
      { label: 'Use different image', action: () => {}, variant: 'secondary' },
    ],
  });
}

/**
 * Create download error
 */
export function createDownloadError(
  type: 'download' | 'blob',
  details?: { originalError?: Error }
): AppError {
  const errorMap: Record<string, { code: ErrorCode; message: string }> = {
    download: {
      code: ErrorCode.DOWNLOAD_FAILED,
      message: 'File download failed',
    },
    blob: {
      code: ErrorCode.BLOB_CREATION_FAILED,
      message: 'Failed to create downloadable file',
    },
  };

  const { code, message } = errorMap[type] ?? errorMap.download;

  return new AppError({
    code,
    message,
    cause: details?.originalError,
    recoveryActions: [
      { label: 'Try again', action: () => {}, variant: 'primary' },
    ],
  });
}

/**
 * Wrap async function with error handling
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: AppError) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const appError = normalizeError(error);
    errorHandler?.(appError);
    return null;
  }
}

/**
 * Wrap sync function with error handling
 */
export function tryCatchSync<T>(
  fn: () => T,
  errorHandler?: (error: AppError) => void
): T | null {
  try {
    return fn();
  } catch (error) {
    const appError = normalizeError(error);
    errorHandler?.(appError);
    return null;
  }
}

/**
 * Normalize any error to AppError
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError({
      code: ErrorCode.UNKNOWN_ERROR,
      message: error.message,
      cause: error,
    });
  }

  return new AppError({
    code: ErrorCode.UNKNOWN_ERROR,
    message: String(error),
  });
}

/**
 * Check if error is of specific type
 */
export function isErrorCode(error: unknown, code: ErrorCode): boolean {
  return error instanceof AppError && error.code === code;
}

/**
 * Log error for debugging
 */
export function logError(error: AppError, context?: string): void {
  const logData = {
    code: error.code,
    message: error.message,
    userMessage: error.userMessage,
    severity: error.severity,
    timestamp: error.timestamp.toISOString(),
    context,
    stack: error.stack,
    cause: error.cause instanceof Error ? error.cause.message : undefined,
  };

  if (error.severity === 'error') {
    console.error('[AppError]', logData);
  } else if (error.severity === 'warning') {
    console.warn('[AppWarning]', logData);
  } else {
    console.info('[AppInfo]', logData);
  }
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Create a retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delayMs?: number;
    backoffFactor?: number;
    shouldRetry?: (error: unknown, attempt: number) => boolean;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffFactor = 2,
    shouldRetry = () => true,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts || !shouldRetry(error, attempt)) {
        throw error;
      }

      const delay = delayMs * Math.pow(backoffFactor, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
