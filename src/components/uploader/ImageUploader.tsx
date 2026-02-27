import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import {
  ACCEPTED_IMAGE_TYPES,
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
          min-h-[220px] p-8 rounded-2xl border-3
          transition-all duration-300 cursor-pointer
          shadow-lg hover:shadow-xl
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${uploadState === 'dragging' ? 'border-solid scale-[1.02]' : 'border-dashed'}
          ${uploadState === 'error' ? 'border-red-400 bg-red-50' : ''}
          ${uploadState === 'success' ? 'border-green-400 bg-green-50' : ''}
        `}
        style={{
          borderWidth: '3px',
          borderColor: uploadState === 'dragging' ? '#4fa8a8' : 
                       uploadState === 'error' ? '#f87171' :
                       uploadState === 'success' ? '#4ade80' : '#c0675c',
          background: uploadState === 'dragging' ? 'linear-gradient(135deg, #e6f7f7 0%, #fff5f4 100%)' :
                      uploadState === 'idle' || !uploadState ? 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)' : undefined,
        }}
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
          <div className="text-center py-6">
            <div 
              className="mx-auto w-32 h-32 rounded-full flex items-center justify-center mb-5"
              style={{ 
                background: uploadState === 'dragging' ? '#4fa8a8' : 'linear-gradient(135deg, #4fa8a8 0%, #c0675c 100%)',
              }}
            >
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="#1e1e1e"
                strokeWidth="2"
                viewBox="0 0 28 28"
                aria-hidden="true"
              >
                {/* Image frame - centered */}
                <rect x="4" y="5" width="14" height="12" rx="2" />
                {/* Mountain landscape */}
                <path d="M4 13l3.5-3.5 2.5 2.5 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
                {/* Sun circle */}
                <circle cx="8" cy="9" r="1.5" fill="#1e1e1e" stroke="none" />
                {/* Plus sign - bottom right corner */}
                <circle cx="21" cy="21" r="5.5" fill="#1e1e1e" stroke="none" />
                <line x1="21" y1="18" x2="21" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="18" y1="21" x2="24" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-base font-medium" style={{ color: '#1e1e1e' }}>
              {uploadState === 'dragging' ? (
                <span style={{ color: '#4fa8a8' }}>Drop image here</span>
              ) : (
                <>
                  <span style={{ color: '#4fa8a8' }} className="font-semibold">Click to upload</span> or drag and drop
                </>
              )}
            </p>
            <p className="mt-2 text-sm" style={{ color: '#666666' }}>
              .JPG, .JPEG, .PNG, .WEBP up to {formatFileSize(maxFileSize)}
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
