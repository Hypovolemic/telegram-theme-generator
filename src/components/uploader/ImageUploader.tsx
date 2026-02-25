import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_EXTENSIONS,
  MAX_FILE_SIZE,
  ERROR_MESSAGES,
  type ImageUploaderProps,
  type ValidationError,
} from './types';

/**
 * ImageUploader component allows users to upload wallpaper images
 * with drag-and-drop support, file validation, and preview.
 */
export function ImageUploader({
  onImageUpload,
  onClear,
  onError,
  maxFileSize = MAX_FILE_SIZE,
  acceptedTypes = ACCEPTED_IMAGE_TYPES,
  className = '',
  disabled = false,
}: ImageUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  /**
   * Validates the file type and size.
   */
  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: ValidationError } => {
      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        return { valid: false, error: 'invalid-type' };
      }

      // Check file size
      if (file.size > maxFileSize) {
        return { valid: false, error: 'file-too-large' };
      }

      return { valid: true };
    },
    [acceptedTypes, maxFileSize]
  );

  /**
   * Processes a valid file and creates a preview.
   */
  const processFile = useCallback(
    (file: File) => {
      setUploadState('uploading');
      setError(null);
      setFileName(file.name);

      // Simulate upload progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
        }
        setUploadProgress(Math.min(progress, 100));
      }, 100);

      // Create preview URL
      const reader = new FileReader();

      reader.onload = (e) => {
        clearInterval(progressInterval);
        setUploadProgress(100);

        const url = e.target?.result as string;
        setPreviewUrl(url);
        setUploadState('success');
        onImageUpload(file, url);
      };

      reader.onerror = () => {
        clearInterval(progressInterval);
        setUploadState('error');
        setError(ERROR_MESSAGES['upload-failed']);
        onError?.('upload-failed', ERROR_MESSAGES['upload-failed']);
      };

      reader.readAsDataURL(file);
    },
    [onImageUpload, onError]
  );

  /**
   * Handles file selection from input or drop.
   */
  const handleFile = useCallback(
    (file: File | null | undefined) => {
      if (!file) {
        setError(ERROR_MESSAGES['no-file']);
        onError?.('no-file', ERROR_MESSAGES['no-file']);
        return;
      }

      const validation = validateFile(file);

      if (!validation.valid && validation.error) {
        setUploadState('error');
        setError(ERROR_MESSAGES[validation.error]);
        onError?.(validation.error, ERROR_MESSAGES[validation.error]);
        return;
      }

      processFile(file);
    },
    [validateFile, processFile, onError]
  );

  /**
   * Handles file input change.
   */
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      handleFile(file);
    },
    [handleFile]
  );

  /**
   * Handles click on drop zone.
   */
  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  /**
   * Handles drag enter event.
   */
  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setUploadState('dragging');
      }
    },
    [disabled]
  );

  /**
   * Handles drag leave event.
   */
  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Only reset if leaving the drop zone entirely
      if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
        if (uploadState === 'dragging') {
          setUploadState(previewUrl ? 'success' : 'idle');
        }
      }
    },
    [uploadState, previewUrl]
  );

  /**
   * Handles drag over event.
   */
  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setUploadState('dragging');
      }
    },
    [disabled]
  );

  /**
   * Handles drop event.
   */
  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) {
        return;
      }

      setUploadState('idle');
      const file = e.dataTransfer.files?.[0];
      handleFile(file);
    },
    [disabled, handleFile]
  );

  /**
   * Clears the current upload.
   */
  const handleClear = useCallback(() => {
    setPreviewUrl(null);
    setError(null);
    setUploadState('idle');
    setUploadProgress(0);
    setFileName(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    onClear?.();
  }, [onClear]);

  /**
   * Formats file size for display.
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
        data-testid="file-input"
      />

      {/* Drop zone */}
      <div
        ref={dropZoneRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center
          min-h-[200px] p-6 rounded-lg border-2 border-dashed
          transition-all duration-200 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
          ${uploadState === 'dragging' ? 'border-blue-500 bg-blue-50' : ''}
          ${uploadState === 'error' ? 'border-red-400 bg-red-50' : ''}
          ${uploadState === 'success' ? 'border-green-400 bg-green-50' : ''}
          ${uploadState === 'idle' ? 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100' : ''}
        `}
        data-testid="drop-zone"
        aria-label="Upload image"
      >
        {/* Preview state */}
        {previewUrl && uploadState === 'success' && (
          <div className="relative w-full">
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="max-h-[300px] mx-auto rounded-md object-contain"
              data-testid="image-preview"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              aria-label="Remove image"
              data-testid="clear-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {fileName && (
              <p className="mt-2 text-sm text-gray-600 text-center">{fileName}</p>
            )}
          </div>
        )}

        {/* Uploading state */}
        {uploadState === 'uploading' && (
          <div className="w-full max-w-xs" data-testid="upload-progress">
            <div className="flex items-center justify-center mb-2">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
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
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
                data-testid="progress-bar"
              />
            </div>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Uploading... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}

        {/* Idle/Dragging state */}
        {(uploadState === 'idle' || uploadState === 'dragging') && !previewUrl && (
          <div className="text-center">
            <svg
              className={`mx-auto h-12 w-12 ${uploadState === 'dragging' ? 'text-blue-500' : 'text-gray-400'}`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              {uploadState === 'dragging' ? (
                <span className="text-blue-600 font-medium">Drop image here</span>
              ) : (
                <>
                  <span className="text-blue-600 font-medium">Click to upload</span> or drag and
                  drop
                </>
              )}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {ACCEPTED_EXTENSIONS.join(', ').toUpperCase()} up to {formatFileSize(maxFileSize)}
            </p>
          </div>
        )}

        {/* Error state */}
        {uploadState === 'error' && error && (
          <div className="text-center" data-testid="error-message">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;
