import { saveAs } from 'file-saver';

/**
 * Theme file extension for Telegram Desktop.
 */
export const THEME_FILE_EXTENSION = '.tdesktop-theme';

/**
 * MIME type for theme files.
 */
export const THEME_MIME_TYPE = 'application/octet-stream';

/**
 * Result of a download operation.
 */
export interface DownloadResult {
  success: boolean;
  filename: string;
  error?: string;
}

/**
 * Options for downloading a theme file.
 */
export interface DownloadOptions {
  /**
   * The name to use for the file (without extension).
   */
  filename: string;

  /**
   * The theme content as a string.
   */
  content: string;

  /**
   * Optional callback when download starts.
   */
  onStart?: () => void;

  /**
   * Optional callback when download succeeds.
   */
  onSuccess?: (result: DownloadResult) => void;

  /**
   * Optional callback when download fails.
   */
  onError?: (error: Error) => void;
}

/**
 * Sanitizes a filename by removing invalid characters.
 *
 * @param name - The original filename
 * @returns Sanitized filename safe for all operating systems
 */
export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    // eslint-disable-next-line no-control-regex
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Collapse multiple dashes
    .replace(/^-|-$/g, '') // Trim leading/trailing dashes
    .substring(0, 100) // Limit length
    || 'theme'; // Fallback if empty
}

/**
 * Generates a theme filename from a wallpaper name or theme name.
 *
 * @param name - The name to use (wallpaper name, theme name, etc.)
 * @returns Full filename with .tdesktop-theme extension
 */
export function generateThemeFilename(name: string): string {
  const sanitized = sanitizeFilename(name);
  return `${sanitized}${THEME_FILE_EXTENSION}`;
}

/**
 * Creates a Blob from theme content.
 *
 * @param content - The theme file content as a string
 * @returns Blob ready for download
 */
export function createThemeBlob(content: string): Blob {
  return new Blob([content], { type: THEME_MIME_TYPE });
}

/**
 * Downloads theme content as a .tdesktop-theme file.
 *
 * Uses file-saver for cross-browser compatibility.
 *
 * @param options - Download options
 * @returns Promise resolving to download result
 *
 * @example
 * ```typescript
 * await downloadTheme({
 *   filename: 'my-wallpaper',
 *   content: themeContent,
 *   onSuccess: (result) => console.log('Downloaded:', result.filename),
 *   onError: (error) => console.error('Failed:', error.message),
 * });
 * ```
 */
export async function downloadTheme(options: DownloadOptions): Promise<DownloadResult> {
  const { filename, content, onStart, onSuccess, onError } = options;

  const fullFilename = generateThemeFilename(filename);

  try {
    onStart?.();

    const blob = createThemeBlob(content);
    saveAs(blob, fullFilename);

    const result: DownloadResult = {
      success: true,
      filename: fullFilename,
    };

    onSuccess?.(result);
    return result;
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Download failed');

    onError?.(error);

    return {
      success: false,
      filename: fullFilename,
      error: error.message,
    };
  }
}

/**
 * Creates a download URL for a theme file.
 * Remember to revoke the URL when done using URL.revokeObjectURL().
 *
 * @param content - The theme file content
 * @returns Object URL for the blob
 */
export function createDownloadUrl(content: string): string {
  const blob = createThemeBlob(content);
  return URL.createObjectURL(blob);
}

/**
 * Revokes a previously created download URL.
 *
 * @param url - The URL to revoke
 */
export function revokeDownloadUrl(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Validates that the content looks like a valid theme file.
 *
 * @param content - The theme content to validate
 * @returns Whether the content appears valid
 */
export function isValidThemeContent(content: string): boolean {
  if (!content || typeof content !== 'string') {
    return false;
  }

  // Check for typical theme file structure
  // Should contain property: value; patterns
  const propertyPattern = /^[a-zA-Z][a-zA-Z0-9_]*:\s*#?[0-9a-fA-F]{6,8};?$/m;

  // Should have at least some properties
  const lines = content.split('\n').filter((line) => line.trim() && !line.startsWith('//'));

  return lines.length > 0 && propertyPattern.test(content);
}
