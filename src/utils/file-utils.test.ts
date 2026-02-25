import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  sanitizeFilename,
  generateThemeFilename,
  createThemeBlob,
  downloadTheme,
  createDownloadUrl,
  revokeDownloadUrl,
  isValidThemeContent,
  THEME_FILE_EXTENSION,
  THEME_MIME_TYPE,
} from './file-utils';

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

import { saveAs } from 'file-saver';

describe('file-utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constants', () => {
    it('should export correct file extension', () => {
      expect(THEME_FILE_EXTENSION).toBe('.tdesktop-theme');
    });

    it('should export correct MIME type', () => {
      expect(THEME_MIME_TYPE).toBe('application/octet-stream');
    });
  });

  describe('sanitizeFilename', () => {
    it('should convert to lowercase', () => {
      expect(sanitizeFilename('MyTheme')).toBe('mytheme');
    });

    it('should replace spaces with dashes', () => {
      expect(sanitizeFilename('my theme name')).toBe('my-theme-name');
    });

    it('should remove invalid characters', () => {
      expect(sanitizeFilename('my<>:"/\\|?*theme')).toBe('mytheme');
    });

    it('should collapse multiple dashes', () => {
      expect(sanitizeFilename('my   theme')).toBe('my-theme');
    });

    it('should trim leading and trailing dashes', () => {
      expect(sanitizeFilename('  my theme  ')).toBe('my-theme');
    });

    it('should limit length to 100 characters', () => {
      const longName = 'a'.repeat(150);
      expect(sanitizeFilename(longName).length).toBe(100);
    });

    it('should return "theme" for empty input', () => {
      expect(sanitizeFilename('')).toBe('theme');
    });

    it('should return "theme" for input with only invalid chars', () => {
      expect(sanitizeFilename('<>:"/\\|?*')).toBe('theme');
    });

    it('should handle emoji', () => {
      expect(sanitizeFilename('my 🎨 theme')).toBe('my-🎨-theme');
    });
  });

  describe('generateThemeFilename', () => {
    it('should add .tdesktop-theme extension', () => {
      expect(generateThemeFilename('my-theme')).toBe('my-theme.tdesktop-theme');
    });

    it('should sanitize the filename', () => {
      expect(generateThemeFilename('My Cool Theme')).toBe('my-cool-theme.tdesktop-theme');
    });

    it('should handle special characters', () => {
      expect(generateThemeFilename('theme<>name')).toBe('themename.tdesktop-theme');
    });
  });

  describe('createThemeBlob', () => {
    it('should create a Blob with correct type', () => {
      const blob = createThemeBlob('test content');
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe(THEME_MIME_TYPE);
    });

    it('should contain the content', async () => {
      const content = 'windowBg: #ffffff;';
      const blob = createThemeBlob(content);
      // Use FileReader since jsdom doesn't support blob.text()
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(blob);
      });
      expect(text).toBe(content);
    });
  });

  describe('downloadTheme', () => {
    it('should call saveAs with correct arguments', async () => {
      await downloadTheme({
        filename: 'my-theme',
        content: 'windowBg: #ffffff;',
      });

      expect(saveAs).toHaveBeenCalledTimes(1);
      expect(saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        'my-theme.tdesktop-theme'
      );
    });

    it('should call onStart callback', async () => {
      const onStart = vi.fn();

      await downloadTheme({
        filename: 'test',
        content: 'content',
        onStart,
      });

      expect(onStart).toHaveBeenCalled();
    });

    it('should call onSuccess callback with result', async () => {
      const onSuccess = vi.fn();

      await downloadTheme({
        filename: 'test',
        content: 'content',
        onSuccess,
      });

      expect(onSuccess).toHaveBeenCalledWith({
        success: true,
        filename: 'test.tdesktop-theme',
      });
    });

    it('should return success result', async () => {
      const result = await downloadTheme({
        filename: 'test',
        content: 'content',
      });

      expect(result.success).toBe(true);
      expect(result.filename).toBe('test.tdesktop-theme');
    });

    it('should sanitize filename in result', async () => {
      const result = await downloadTheme({
        filename: 'My Cool Theme',
        content: 'content',
      });

      expect(result.filename).toBe('my-cool-theme.tdesktop-theme');
    });

    it('should call onError on failure', async () => {
      const error = new Error('Mock error');
      vi.mocked(saveAs).mockImplementationOnce(() => {
        throw error;
      });

      const onError = vi.fn();

      await downloadTheme({
        filename: 'test',
        content: 'content',
        onError,
      });

      expect(onError).toHaveBeenCalledWith(error);
    });

    it('should return error result on failure', async () => {
      vi.mocked(saveAs).mockImplementationOnce(() => {
        throw new Error('Download failed');
      });

      const result = await downloadTheme({
        filename: 'test',
        content: 'content',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Download failed');
    });
  });

  describe('createDownloadUrl', () => {
    it('should create a blob URL', () => {
      // Mock URL.createObjectURL since jsdom doesn't support it
      const mockUrl = 'blob:http://localhost/mock-uuid';
      const createObjectURLSpy = vi.fn(() => mockUrl);
      URL.createObjectURL = createObjectURLSpy;

      const url = createDownloadUrl('test content');
      
      expect(createObjectURLSpy).toHaveBeenCalledWith(expect.any(Blob));
      expect(url).toBe(mockUrl);
    });
  });

  describe('revokeDownloadUrl', () => {
    it('should call URL.revokeObjectURL', () => {
      // Mock URL.revokeObjectURL since jsdom doesn't support it
      const revokeObjectURLSpy = vi.fn();
      URL.revokeObjectURL = revokeObjectURLSpy;

      const url = 'blob:http://localhost/test';

      revokeDownloadUrl(url);

      expect(revokeObjectURLSpy).toHaveBeenCalledWith(url);
    });
  });

  describe('isValidThemeContent', () => {
    it('should return true for valid theme content', () => {
      const content = `
windowBg: #ffffff;
windowFg: #000000;
`;
      expect(isValidThemeContent(content)).toBe(true);
    });

    it('should return true for content without semicolons', () => {
      const content = 'windowBg: #ffffff';
      expect(isValidThemeContent(content)).toBe(true);
    });

    it('should return true for content with alpha channel', () => {
      const content = 'windowBg: #ffffff80;';
      expect(isValidThemeContent(content)).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(isValidThemeContent('')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isValidThemeContent(null as unknown as string)).toBe(false);
      expect(isValidThemeContent(undefined as unknown as string)).toBe(false);
    });

    it('should return false for random text', () => {
      expect(isValidThemeContent('hello world')).toBe(false);
    });

    it('should ignore comment lines', () => {
      const content = `
// This is a comment
windowBg: #ffffff;
`;
      expect(isValidThemeContent(content)).toBe(true);
    });
  });
});
