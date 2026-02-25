/**
 * Accepted image MIME types.
 */
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

/**
 * Accepted file extensions for display.
 */
export const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const;

/**
 * Maximum file size in bytes (10MB).
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Upload state type.
 */
export type UploadState = 'idle' | 'dragging' | 'uploading' | 'success' | 'error';

/**
 * Validation error types.
 */
export type ValidationError = 'invalid-type' | 'file-too-large' | 'no-file' | 'upload-failed';

/**
 * Error messages for validation errors.
 */
export const ERROR_MESSAGES: Record<ValidationError, string> = {
  'invalid-type': 'Invalid file type. Please upload a JPG, PNG, or WebP image.',
  'file-too-large': 'File is too large. Maximum size is 10MB.',
  'no-file': 'No file selected.',
  'upload-failed': 'Failed to upload image. Please try again.',
};

/**
 * Props for ImageUploader component.
 */
export interface ImageUploaderProps {
  /**
   * Callback when a valid image is uploaded.
   */
  onImageUpload: (file: File, previewUrl: string) => void;

  /**
   * Callback when upload is cleared.
   */
  onClear?: () => void;

  /**
   * Callback when an error occurs.
   */
  onError?: (error: ValidationError, message: string) => void;

  /**
   * Maximum file size in bytes.
   * @default 10485760 (10MB)
   */
  maxFileSize?: number;

  /**
   * Accepted MIME types.
   * @default ['image/jpeg', 'image/png', 'image/webp']
   */
  acceptedTypes?: readonly string[];

  /**
   * Optional class name for the container.
   */
  className?: string;

  /**
   * Whether the uploader is disabled.
   */
  disabled?: boolean;
}
