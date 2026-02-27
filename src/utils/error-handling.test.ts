import { describe, it, expect, vi } from 'vitest';
import {
  ErrorCode,
  AppError,
  getUserFriendlyMessage,
  createFileUploadError,
  createColorExtractionError,
  createThemeGenerationError,
  createDownloadError,
  tryCatch,
  tryCatchSync,
  normalizeError,
  isErrorCode,
  logError,
  retry,
} from './error-handling';

describe('ErrorCode', () => {
  it('should have file upload error codes', () => {
    expect(ErrorCode.FILE_TOO_LARGE).toBe('FILE_TOO_LARGE');
    expect(ErrorCode.FILE_INVALID_TYPE).toBe('FILE_INVALID_TYPE');
    expect(ErrorCode.FILE_READ_ERROR).toBe('FILE_READ_ERROR');
    expect(ErrorCode.FILE_UPLOAD_CANCELLED).toBe('FILE_UPLOAD_CANCELLED');
  });

  it('should have color extraction error codes', () => {
    expect(ErrorCode.COLOR_EXTRACTION_FAILED).toBe('COLOR_EXTRACTION_FAILED');
    expect(ErrorCode.IMAGE_LOAD_ERROR).toBe('IMAGE_LOAD_ERROR');
    expect(ErrorCode.CANVAS_ERROR).toBe('CANVAS_ERROR');
    expect(ErrorCode.INSUFFICIENT_COLORS).toBe('INSUFFICIENT_COLORS');
  });

  it('should have theme generation error codes', () => {
    expect(ErrorCode.THEME_GENERATION_FAILED).toBe('THEME_GENERATION_FAILED');
    expect(ErrorCode.THEME_VALIDATION_FAILED).toBe('THEME_VALIDATION_FAILED');
    expect(ErrorCode.CONTRAST_OPTIMIZATION_FAILED).toBe('CONTRAST_OPTIMIZATION_FAILED');
  });

  it('should have download error codes', () => {
    expect(ErrorCode.DOWNLOAD_FAILED).toBe('DOWNLOAD_FAILED');
    expect(ErrorCode.BLOB_CREATION_FAILED).toBe('BLOB_CREATION_FAILED');
  });
});

describe('AppError', () => {
  it('should create an error with required properties', () => {
    const error = new AppError({
      code: ErrorCode.FILE_TOO_LARGE,
      message: 'File exceeds 10MB',
    });

    expect(error.code).toBe(ErrorCode.FILE_TOO_LARGE);
    expect(error.message).toBe('File exceeds 10MB');
    expect(error.name).toBe('AppError');
    expect(error.timestamp).toBeInstanceOf(Date);
  });

  it('should use default user message from error code', () => {
    const error = new AppError({
      code: ErrorCode.FILE_TOO_LARGE,
      message: 'Technical message',
    });

    expect(error.userMessage).toBe('The file is too large. Please select an image under 10MB.');
  });

  it('should allow custom user message', () => {
    const error = new AppError({
      code: ErrorCode.FILE_TOO_LARGE,
      message: 'Technical message',
      userMessage: 'Custom user message',
    });

    expect(error.userMessage).toBe('Custom user message');
  });

  it('should default severity to error', () => {
    const error = new AppError({
      code: ErrorCode.UNKNOWN_ERROR,
      message: 'Test',
    });

    expect(error.severity).toBe('error');
  });

  it('should allow custom severity', () => {
    const error = new AppError({
      code: ErrorCode.CONTRAST_OPTIMIZATION_FAILED,
      message: 'Test',
      severity: 'warning',
    });

    expect(error.severity).toBe('warning');
  });

  it('should store recovery actions', () => {
    const actions = [
      { label: 'Retry', action: () => {} },
      { label: 'Cancel', action: () => {}, variant: 'secondary' as const },
    ];

    const error = new AppError({
      code: ErrorCode.UNKNOWN_ERROR,
      message: 'Test',
      recoveryActions: actions,
    });

    expect(error.recoveryActions).toHaveLength(2);
    expect(error.recoveryActions?.[0].label).toBe('Retry');
  });

  it('should store cause error', () => {
    const cause = new Error('Original error');
    const error = new AppError({
      code: ErrorCode.UNKNOWN_ERROR,
      message: 'Wrapped error',
      cause,
    });

    expect(error.cause).toBe(cause);
  });
});

describe('getUserFriendlyMessage', () => {
  it('should return message for known error codes', () => {
    expect(getUserFriendlyMessage(ErrorCode.FILE_TOO_LARGE)).toContain('too large');
    expect(getUserFriendlyMessage(ErrorCode.FILE_INVALID_TYPE)).toContain('not supported');
    expect(getUserFriendlyMessage(ErrorCode.COLOR_EXTRACTION_FAILED)).toContain('extract colours');
  });

  it('should return generic message for unknown code', () => {
    expect(getUserFriendlyMessage('INVALID_CODE' as ErrorCode)).toContain('Something went wrong');
  });
});

describe('createFileUploadError', () => {
  it('should create error for file too large', () => {
    const error = createFileUploadError('size', { maxSize: 10 * 1024 * 1024 });

    expect(error.code).toBe(ErrorCode.FILE_TOO_LARGE);
    expect(error.severity).toBe('error');
    expect(error.recoveryActions).toBeDefined();
  });

  it('should create error for invalid type', () => {
    const error = createFileUploadError('type', { allowedTypes: ['image/png', 'image/jpeg'] });

    expect(error.code).toBe(ErrorCode.FILE_INVALID_TYPE);
    expect(error.message).toContain('image/png');
  });

  it('should create error for read failure', () => {
    const originalError = new Error('Read failed');
    const error = createFileUploadError('read', { originalError });

    expect(error.code).toBe(ErrorCode.FILE_READ_ERROR);
    expect(error.cause).toBe(originalError);
  });

  it('should create info-level error for cancelled', () => {
    const error = createFileUploadError('cancelled');

    expect(error.code).toBe(ErrorCode.FILE_UPLOAD_CANCELLED);
    expect(error.severity).toBe('info');
    expect(error.recoveryActions).toBeUndefined();
  });
});

describe('createColorExtractionError', () => {
  it('should create error for image load failure', () => {
    const error = createColorExtractionError('load');

    expect(error.code).toBe(ErrorCode.IMAGE_LOAD_ERROR);
    expect(error.recoveryActions).toBeDefined();
  });

  it('should create error for canvas failure', () => {
    const error = createColorExtractionError('canvas');

    expect(error.code).toBe(ErrorCode.CANVAS_ERROR);
  });

  it('should create error for extraction failure', () => {
    const error = createColorExtractionError('extraction');

    expect(error.code).toBe(ErrorCode.COLOR_EXTRACTION_FAILED);
  });

  it('should create error for insufficient colors', () => {
    const error = createColorExtractionError('insufficient', { colorCount: 2 });

    expect(error.code).toBe(ErrorCode.INSUFFICIENT_COLORS);
    expect(error.message).toContain('2');
  });
});

describe('createThemeGenerationError', () => {
  it('should create error for generation failure', () => {
    const error = createThemeGenerationError('generation');

    expect(error.code).toBe(ErrorCode.THEME_GENERATION_FAILED);
    expect(error.severity).toBe('error');
  });

  it('should create error for validation failure', () => {
    const error = createThemeGenerationError('validation', {
      validationErrors: ['Invalid color', 'Missing property'],
    });

    expect(error.code).toBe(ErrorCode.THEME_VALIDATION_FAILED);
    expect(error.message).toContain('Invalid color');
  });

  it('should create warning for contrast failure', () => {
    const error = createThemeGenerationError('contrast');

    expect(error.code).toBe(ErrorCode.CONTRAST_OPTIMIZATION_FAILED);
    expect(error.severity).toBe('warning');
  });
});

describe('createDownloadError', () => {
  it('should create error for download failure', () => {
    const error = createDownloadError('download');

    expect(error.code).toBe(ErrorCode.DOWNLOAD_FAILED);
  });

  it('should create error for blob creation failure', () => {
    const error = createDownloadError('blob');

    expect(error.code).toBe(ErrorCode.BLOB_CREATION_FAILED);
  });
});

describe('tryCatch', () => {
  it('should return result on success', async () => {
    const result = await tryCatch(async () => 'success');

    expect(result).toBe('success');
  });

  it('should return null on error', async () => {
    const result = await tryCatch(async () => {
      throw new Error('Failed');
    });

    expect(result).toBeNull();
  });

  it('should call error handler on error', async () => {
    const handler = vi.fn();

    await tryCatch(async () => {
      throw new Error('Failed');
    }, handler);

    expect(handler).toHaveBeenCalledWith(expect.any(AppError));
  });
});

describe('tryCatchSync', () => {
  it('should return result on success', () => {
    const result = tryCatchSync(() => 'success');

    expect(result).toBe('success');
  });

  it('should return null on error', () => {
    const result = tryCatchSync(() => {
      throw new Error('Failed');
    });

    expect(result).toBeNull();
  });

  it('should call error handler on error', () => {
    const handler = vi.fn();

    tryCatchSync(() => {
      throw new Error('Failed');
    }, handler);

    expect(handler).toHaveBeenCalledWith(expect.any(AppError));
  });
});

describe('normalizeError', () => {
  it('should return AppError as-is', () => {
    const appError = new AppError({
      code: ErrorCode.UNKNOWN_ERROR,
      message: 'Test',
    });

    expect(normalizeError(appError)).toBe(appError);
  });

  it('should wrap Error in AppError', () => {
    const error = new Error('Test error');
    const appError = normalizeError(error);

    expect(appError).toBeInstanceOf(AppError);
    expect(appError.message).toBe('Test error');
    expect(appError.code).toBe(ErrorCode.UNKNOWN_ERROR);
  });

  it('should convert string to AppError', () => {
    const appError = normalizeError('String error');

    expect(appError).toBeInstanceOf(AppError);
    expect(appError.message).toBe('String error');
  });

  it('should convert other types to AppError', () => {
    const appError = normalizeError(42);

    expect(appError).toBeInstanceOf(AppError);
    expect(appError.message).toBe('42');
  });
});

describe('isErrorCode', () => {
  it('should return true for matching error code', () => {
    const error = new AppError({
      code: ErrorCode.FILE_TOO_LARGE,
      message: 'Test',
    });

    expect(isErrorCode(error, ErrorCode.FILE_TOO_LARGE)).toBe(true);
  });

  it('should return false for non-matching error code', () => {
    const error = new AppError({
      code: ErrorCode.FILE_TOO_LARGE,
      message: 'Test',
    });

    expect(isErrorCode(error, ErrorCode.FILE_INVALID_TYPE)).toBe(false);
  });

  it('should return false for non-AppError', () => {
    expect(isErrorCode(new Error('Test'), ErrorCode.UNKNOWN_ERROR)).toBe(false);
  });
});

describe('logError', () => {
  it('should log error to console.error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const error = new AppError({
      code: ErrorCode.UNKNOWN_ERROR,
      message: 'Test',
      severity: 'error',
    });

    logError(error, 'TestContext');

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should log warning to console.warn', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const error = new AppError({
      code: ErrorCode.CONTRAST_OPTIMIZATION_FAILED,
      message: 'Test',
      severity: 'warning',
    });

    logError(error);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should log info to console.info', () => {
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    const error = new AppError({
      code: ErrorCode.FILE_UPLOAD_CANCELLED,
      message: 'Test',
      severity: 'info',
    });

    logError(error);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('retry', () => {
  it('should return result on first success', async () => {
    const fn = vi.fn().mockResolvedValue('success');

    const result = await retry(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('Fail 1'))
      .mockRejectedValueOnce(new Error('Fail 2'))
      .mockResolvedValue('success');

    const result = await retry(fn, { delayMs: 10 });

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should throw after max attempts', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Always fails'));

    await expect(
      retry(fn, { maxAttempts: 2, delayMs: 10 })
    ).rejects.toThrow('Always fails');

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should respect shouldRetry option', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Should not retry'));

    await expect(
      retry(fn, {
        maxAttempts: 3,
        delayMs: 10,
        shouldRetry: () => false,
      })
    ).rejects.toThrow('Should not retry');

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
