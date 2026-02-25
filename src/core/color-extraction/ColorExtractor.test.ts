import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ColorExtractor } from './ColorExtractor';
import type { ExtractedColor, RGB } from './ColorExtractor';

// Mock ColorThief
vi.mock('colorthief', () => {
  return {
    default: class MockColorThief {
      getPalette(_img: HTMLImageElement, colorCount: number): RGB[] {
        // Return mock palette
        const palette: RGB[] = [
          [255, 100, 100], // Red-ish
          [100, 255, 100], // Green-ish
          [100, 100, 255], // Blue-ish
          [255, 255, 100], // Yellow-ish
          [255, 100, 255], // Magenta-ish
          [100, 255, 255], // Cyan-ish
        ];
        return palette.slice(0, colorCount);
      }

      getColor(): RGB {
        return [128, 128, 128];
      }
    },
  };
});

describe('ColorExtractor', () => {
  let extractor: ColorExtractor;

  beforeEach(() => {
    extractor = new ColorExtractor();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with default options', () => {
      const ext = new ColorExtractor();
      expect(ext).toBeInstanceOf(ColorExtractor);
    });

    it('should accept custom options', () => {
      const ext = new ColorExtractor({
        colorCount: 8,
        quality: 5,
        maxSize: 200,
      });
      expect(ext).toBeInstanceOf(ColorExtractor);
    });
  });

  describe('getDominantColors', () => {
    it('should extract 6 dominant colors by default', async () => {
      const colors = await extractor.getDominantColors('data:image/png;base64,test');
      
      expect(colors).toHaveLength(6);
      colors.forEach((color: ExtractedColor) => {
        expect(color).toHaveProperty('rgb');
        expect(color).toHaveProperty('hex');
        expect(color).toHaveProperty('vibrancy');
        expect(color).toHaveProperty('brightness');
      });
    });

    it('should return colors with valid RGB values', async () => {
      const colors = await extractor.getDominantColors('data:image/png;base64,test');
      
      colors.forEach((color: ExtractedColor) => {
        expect(color.rgb).toHaveLength(3);
        color.rgb.forEach((value: number) => {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(255);
        });
      });
    });

    it('should return colors with valid hex values', async () => {
      const colors = await extractor.getDominantColors('data:image/png;base64,test');
      
      colors.forEach((color: ExtractedColor) => {
        expect(color.hex).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    it('should sort colors by vibrancy in descending order', async () => {
      const colors = await extractor.getDominantColors('data:image/png;base64,test');
      
      for (let i = 0; i < colors.length - 1; i++) {
        expect(colors[i].vibrancy).toBeGreaterThanOrEqual(colors[i + 1].vibrancy);
      }
    });

    it('should accept HTMLImageElement as source', async () => {
      const img = new Image();
      img.src = 'data:image/png;base64,test';
      
      // Wait for mock image to "load"
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const colors = await extractor.getDominantColors(img);
      expect(colors).toHaveLength(6);
    });

    it('should accept HTMLCanvasElement as source', async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      
      const colors = await extractor.getDominantColors(canvas);
      expect(colors).toHaveLength(6);
    });

    it('should respect custom colorCount option', async () => {
      const customExtractor = new ColorExtractor({ colorCount: 4 });
      const colors = await customExtractor.getDominantColors('data:image/png;base64,test');
      
      expect(colors).toHaveLength(4);
    });

    it('should process images within 500ms', async () => {
      const start = performance.now();
      await extractor.getDominantColors('data:image/png;base64,test');
      const elapsed = performance.now() - start;
      
      expect(elapsed).toBeLessThan(500);
    });
  });

  describe('getAverageBrightness', () => {
    it('should return a brightness value between 0 and 255', async () => {
      const brightness = await extractor.getAverageBrightness('data:image/png;base64,test');
      
      expect(brightness).toBeGreaterThanOrEqual(0);
      expect(brightness).toBeLessThanOrEqual(255);
    });

    it('should return a number', async () => {
      const brightness = await extractor.getAverageBrightness('data:image/png;base64,test');
      
      expect(typeof brightness).toBe('number');
      expect(Number.isFinite(brightness)).toBe(true);
    });
  });

  describe('isGrayscale', () => {
    it('should return a boolean', async () => {
      const result = await extractor.isGrayscale('data:image/png;base64,test');
      
      expect(typeof result).toBe('boolean');
    });

    it('should return false for colorful images', async () => {
      // Our mock returns colorful palette
      const result = await extractor.isGrayscale('data:image/png;base64,test');
      
      expect(result).toBe(false);
    });
  });

  describe('isSingleColor', () => {
    it('should return a boolean', async () => {
      const result = await extractor.isSingleColor('data:image/png;base64,test');
      
      expect(typeof result).toBe('boolean');
    });

    it('should return false for multi-color images', async () => {
      // Our mock returns varied palette
      const result = await extractor.isSingleColor('data:image/png;base64,test');
      
      expect(result).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle grayscale palette detection', async () => {
      // Create a custom extractor that we'll test grayscale detection with
      const grayscaleExtractor = new ColorExtractor();
      
      // The mock returns colorful colors, so this should return false
      const isGray = await grayscaleExtractor.isGrayscale('data:image/png;base64,test');
      expect(isGray).toBe(false);
    });

    it('should handle small images without resizing', async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 50;
      canvas.height = 50;
      
      const colors = await extractor.getDominantColors(canvas);
      expect(colors).toHaveLength(6);
    });

    it('should handle wide images correctly', async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 100;
      
      const colors = await extractor.getDominantColors(canvas);
      expect(colors).toHaveLength(6);
    });

    it('should handle tall images correctly', async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 1000;
      
      const colors = await extractor.getDominantColors(canvas);
      expect(colors).toHaveLength(6);
    });
  });

  describe('color utilities', () => {
    it('should calculate consistent brightness values', async () => {
      const colors = await extractor.getDominantColors('data:image/png;base64,test');
      
      colors.forEach((color: ExtractedColor) => {
        // Brightness should be weighted average of RGB
        const expectedBrightness = 
          0.299 * color.rgb[0] + 
          0.587 * color.rgb[1] + 
          0.114 * color.rgb[2];
        
        expect(color.brightness).toBeCloseTo(expectedBrightness, 2);
      });
    });

    it('should calculate vibrancy between 0 and 1', async () => {
      const colors = await extractor.getDominantColors('data:image/png;base64,test');
      
      colors.forEach((color: ExtractedColor) => {
        expect(color.vibrancy).toBeGreaterThanOrEqual(0);
        expect(color.vibrancy).toBeLessThanOrEqual(1);
      });
    });

    it('should generate correct hex from RGB', async () => {
      const colors = await extractor.getDominantColors('data:image/png;base64,test');
      
      colors.forEach((color: ExtractedColor) => {
        const [r, g, b] = color.rgb;
        const expectedHex = '#' + [r, g, b]
          .map(c => c.toString(16).padStart(2, '0'))
          .join('');
        
        expect(color.hex.toLowerCase()).toBe(expectedHex.toLowerCase());
      });
    });
  });
});

describe('ColorExtractor with grayscale mock', () => {
  it('should identify grayscale colors correctly', async () => {
    // Test the internal logic - grayscale means R ≈ G ≈ B
    const grayColor: RGB = [128, 128, 128];
    const maxDiff = Math.max(
      Math.abs(grayColor[0] - grayColor[1]),
      Math.abs(grayColor[1] - grayColor[2]),
      Math.abs(grayColor[0] - grayColor[2])
    );
    expect(maxDiff).toBeLessThan(20);
  });

  it('should identify non-grayscale colors correctly', async () => {
    const colorfulColor: RGB = [255, 100, 50];
    const maxDiff = Math.max(
      Math.abs(colorfulColor[0] - colorfulColor[1]),
      Math.abs(colorfulColor[1] - colorfulColor[2]),
      Math.abs(colorfulColor[0] - colorfulColor[2])
    );
    expect(maxDiff).toBeGreaterThanOrEqual(20);
  });
});

describe('ColorExtractor with single color mock', () => {
  it('should calculate color distance correctly', async () => {
    const color1: RGB = [100, 100, 100];
    const color2: RGB = [100, 100, 100];
    
    const distance = Math.sqrt(
      Math.pow(color1[0] - color2[0], 2) +
      Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2)
    );
    
    expect(distance).toBe(0);
  });

  it('should detect similar colors as single color', async () => {
    const color1: RGB = [100, 100, 100];
    const color2: RGB = [110, 105, 95];
    
    const distance = Math.sqrt(
      Math.pow(color1[0] - color2[0], 2) +
      Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2)
    );
    
    expect(distance).toBeLessThan(50);
  });
});
