import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeGeneratorProvider, useThemeGenerator } from './ThemeGeneratorContext';
import type { ReactNode } from 'react';

// Mock modules at module level - these must be hoisted
vi.mock('../core/color-extraction', () => {
  return {
    ColorExtractor: class {
      getDominantColors = vi.fn().mockResolvedValue([
        { rgb: [64, 167, 227], hex: '#40a7e3', vibrancy: 0.8, brightness: 0.6 },
        { rgb: [93, 196, 82], hex: '#5dc452', vibrancy: 0.7, brightness: 0.5 },
        { rgb: [255, 200, 100], hex: '#ffc864', vibrancy: 0.6, brightness: 0.7 },
      ]);
    },
  };
});

vi.mock('../core/contrast', () => {
  return {
    ContrastOptimizer: class {
      ensureContrast = vi.fn().mockReturnValue({
        wasAdjusted: false,
        adjustedForeground: '#000000',
        originalForeground: '#000000',
        background: '#ffffff',
        originalRatio: 21,
        finalRatio: 21,
        meetsTarget: true,
        iterations: 0,
        targetRatio: 4.5,
      });
    },
  };
});

vi.mock('../core/theme-generation', () => {
  return {
    TelegramThemeBuilder: class {
      buildTheme = vi.fn().mockReturnValue({
        name: 'Test Theme',
        content: 'windowBg: #ffffff',
        properties: {
          windowBg: 'ffffff',
          windowFg: '000000',
          windowBgOver: 'f1f1f1',
          windowFgOver: '000000',
          windowBgActive: '40a7e3',
          windowFgActive: 'ffffff',
          msgInBg: 'ffffff',
          msgOutBg: 'efffde',
          historyTextInFg: '000000',
          historyTextOutFg: '000000',
          dialogsBg: 'ffffff',
          dialogsNameFg: '212121',
        },
        validation: {
          valid: true,
          errors: [],
          warnings: [],
          missingProperties: [],
        },
      });
    },
  };
});

function wrapper({ children }: { children: ReactNode }) {
  return <ThemeGeneratorProvider>{children}</ThemeGeneratorProvider>;
}

describe('ThemeGeneratorContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('initial state', () => {
    it('should have upload stage initially', () => {
      const { result } = renderHook(() => useThemeGenerator(), { wrapper });
      
      expect(result.current.stage).toBe('upload');
      expect(result.current.imageFile).toBeNull();
      expect(result.current.imagePreviewUrl).toBeNull();
      expect(result.current.extractedColors).toEqual([]);
      expect(result.current.generatedTheme).toBeNull();
      expect(result.current.previewColors).toBeNull();
      expect(result.current.themeMode).toBe('light');
      expect(result.current.error).toBeNull();
      expect(result.current.isProcessing).toBe(false);
    });
  });

  describe('uploadImage', () => {
    it('should process an image and generate a theme', async () => {
      const { result } = renderHook(() => useThemeGenerator(), { wrapper });
      
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockPreviewUrl = 'data:image/jpeg;base64,test';
      
      await act(async () => {
        await result.current.uploadImage(mockFile, mockPreviewUrl);
      });
      
      expect(result.current.imageFile).toBe(mockFile);
      expect(result.current.imagePreviewUrl).toBe(mockPreviewUrl);
      expect(result.current.stage).toBe('preview');
      expect(result.current.extractedColors.length).toBeGreaterThan(0);
      expect(result.current.generatedTheme).not.toBeNull();
      expect(result.current.previewColors).not.toBeNull();
      expect(result.current.isProcessing).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset state to initial values', async () => {
      const { result } = renderHook(() => useThemeGenerator(), { wrapper });
      
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      await act(async () => {
        await result.current.uploadImage(mockFile, 'data:image/jpeg;base64,test');
      });
      
      expect(result.current.stage).toBe('preview');
      
      act(() => {
        result.current.reset();
      });
      
      expect(result.current.stage).toBe('upload');
      expect(result.current.imageFile).toBeNull();
      expect(result.current.generatedTheme).toBeNull();
    });
  });

  describe('setThemeMode', () => {
    it('should update the theme mode', () => {
      const { result } = renderHook(() => useThemeGenerator(), { wrapper });
      
      expect(result.current.themeMode).toBe('light');
      
      act(() => {
        result.current.setThemeMode('dark');
      });
      
      expect(result.current.themeMode).toBe('dark');
    });
  });

  describe('error handling', () => {
    it('should throw error when useThemeGenerator is used outside provider', () => {
      expect(() => {
        renderHook(() => useThemeGenerator());
      }).toThrow('useThemeGenerator must be used within a ThemeGeneratorProvider');
    });
  });
});
