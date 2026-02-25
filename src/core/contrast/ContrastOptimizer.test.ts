import { describe, it, expect, beforeEach } from 'vitest';
import { ContrastOptimizer } from './ContrastOptimizer';
import { WCAG_CONTRAST_RATIOS, CONTRAST_THRESHOLDS } from './wcag-standards';

describe('ContrastOptimizer', () => {
  let optimizer: ContrastOptimizer;

  beforeEach(() => {
    optimizer = new ContrastOptimizer();
  });

  describe('constructor', () => {
    it('should create instance with default options', () => {
      expect(optimizer).toBeInstanceOf(ContrastOptimizer);
    });

    it('should accept custom options', () => {
      const customOptimizer = new ContrastOptimizer({
        level: 'AAA',
        textSize: 'large',
        maxIterations: 10,
        tolerance: 0.05,
      });
      expect(customOptimizer.getTargetRatio()).toBe(WCAG_CONTRAST_RATIOS.AAA.large);
    });

    it('should default to AA level', () => {
      expect(optimizer.getTargetRatio()).toBe(WCAG_CONTRAST_RATIOS.AA.normal);
    });
  });

  describe('getRelativeLuminance', () => {
    it('should return 0 for pure black', () => {
      const luminance = optimizer.getRelativeLuminance('000000');
      expect(luminance).toBeCloseTo(0, 5);
    });

    it('should return 1 for pure white', () => {
      const luminance = optimizer.getRelativeLuminance('ffffff');
      expect(luminance).toBeCloseTo(1, 5);
    });

    it('should handle # prefix', () => {
      const luminance = optimizer.getRelativeLuminance('#ffffff');
      expect(luminance).toBeCloseTo(1, 5);
    });

    it('should return ~0.2126 for pure red', () => {
      const luminance = optimizer.getRelativeLuminance('ff0000');
      expect(luminance).toBeCloseTo(0.2126, 4);
    });

    it('should return ~0.7152 for pure green', () => {
      const luminance = optimizer.getRelativeLuminance('00ff00');
      expect(luminance).toBeCloseTo(0.7152, 4);
    });

    it('should return ~0.0722 for pure blue', () => {
      const luminance = optimizer.getRelativeLuminance('0000ff');
      expect(luminance).toBeCloseTo(0.0722, 4);
    });

    it('should calculate correct luminance for gray', () => {
      // Mid-gray (128, 128, 128) should be around 0.215
      const luminance = optimizer.getRelativeLuminance('808080');
      expect(luminance).toBeGreaterThan(0.1);
      expect(luminance).toBeLessThan(0.3);
    });
  });

  describe('calculateContrastRatio', () => {
    it('should return 21:1 for black on white', () => {
      const ratio = optimizer.calculateContrastRatio('000000', 'ffffff');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should return 21:1 for white on black', () => {
      const ratio = optimizer.calculateContrastRatio('ffffff', '000000');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should return 1:1 for same colors', () => {
      const ratio = optimizer.calculateContrastRatio('ff5500', 'ff5500');
      expect(ratio).toBeCloseTo(1, 5);
    });

    it('should handle # prefixes', () => {
      const ratio = optimizer.calculateContrastRatio('#000000', '#ffffff');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should be symmetrical (order independent)', () => {
      const ratio1 = optimizer.calculateContrastRatio('336699', 'ffffff');
      const ratio2 = optimizer.calculateContrastRatio('ffffff', '336699');
      expect(ratio1).toBeCloseTo(ratio2, 5);
    });

    it('should calculate typical gray on white contrast', () => {
      // Gray (#767676) is the minimum for AA on white
      const ratio = optimizer.calculateContrastRatio('767676', 'ffffff');
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should calculate low contrast correctly', () => {
      // Light gray on white should have low contrast
      const ratio = optimizer.calculateContrastRatio('cccccc', 'ffffff');
      expect(ratio).toBeLessThan(2);
    });
  });

  describe('meetsStandard', () => {
    it('should return true for black on white (all standards)', () => {
      expect(optimizer.meetsStandard('000000', 'ffffff', 'AA', 'normal')).toBe(true);
      expect(optimizer.meetsStandard('000000', 'ffffff', 'AA', 'large')).toBe(true);
      expect(optimizer.meetsStandard('000000', 'ffffff', 'AAA', 'normal')).toBe(true);
      expect(optimizer.meetsStandard('000000', 'ffffff', 'AAA', 'large')).toBe(true);
    });

    it('should return false for same color', () => {
      expect(optimizer.meetsStandard('ffffff', 'ffffff', 'AA', 'normal')).toBe(false);
    });

    it('should correctly identify AA compliance', () => {
      // #767676 on white is exactly 4.54:1 (passes AA normal)
      expect(optimizer.meetsStandard('767676', 'ffffff', 'AA', 'normal')).toBe(true);
      // #777777 on white is about 4.48:1 (fails AA normal)
      expect(optimizer.meetsStandard('787878', 'ffffff', 'AA', 'normal')).toBe(false);
    });

    it('should correctly identify AAA compliance', () => {
      // #595959 on white is about 7:1 (passes AAA)
      expect(optimizer.meetsStandard('595959', 'ffffff', 'AAA', 'normal')).toBe(true);
    });

    it('should use instance defaults when not specified', () => {
      const aaOptimizer = new ContrastOptimizer({ level: 'AA', textSize: 'normal' });
      expect(aaOptimizer.meetsStandard('767676', 'ffffff')).toBe(true);
    });
  });

  describe('ensureContrast', () => {
    it('should not adjust when contrast already meets target', () => {
      const result = optimizer.ensureContrast('000000', 'ffffff');
      expect(result.wasAdjusted).toBe(false);
      expect(result.meetsTarget).toBe(true);
      expect(result.iterations).toBe(0);
    });

    it('should adjust low contrast colors to meet AA', () => {
      // Light gray on white (low contrast)
      const result = optimizer.ensureContrast('cccccc', 'ffffff');
      expect(result.wasAdjusted).toBe(true);
      expect(result.finalRatio).toBeGreaterThanOrEqual(4.5 - 0.01);
    });

    it('should adjust to meet AAA when configured', () => {
      const aaaOptimizer = new ContrastOptimizer({ level: 'AAA' });
      const result = aaaOptimizer.ensureContrast('999999', 'ffffff');
      expect(result.wasAdjusted).toBe(true);
      expect(result.finalRatio).toBeGreaterThanOrEqual(7 - 0.01);
    });

    it('should converge in less than 20 iterations', () => {
      const result = optimizer.ensureContrast('aaaaaa', 'ffffff');
      expect(result.iterations).toBeLessThan(20);
    });

    it('should preserve hue when adjusting', () => {
      // Blue on white
      const original = '6699cc';
      const result = optimizer.ensureContrast(original, 'ffffff');

      if (result.wasAdjusted) {
        const originalHsl = optimizer.hexToHsl(original);
        const adjustedHsl = optimizer.hexToHsl(result.adjustedForeground);

        // Hue should be preserved (within rounding tolerance)
        expect(Math.abs(originalHsl.h - adjustedHsl.h)).toBeLessThanOrEqual(2);
      }
    });

    it('should darken colors on light backgrounds', () => {
      const result = optimizer.ensureContrast('aaaaaa', 'ffffff');

      if (result.wasAdjusted) {
        const originalLuminance = optimizer.getRelativeLuminance(result.originalForeground);
        const adjustedLuminance = optimizer.getRelativeLuminance(result.adjustedForeground);
        expect(adjustedLuminance).toBeLessThan(originalLuminance);
      }
    });

    it('should lighten colors on dark backgrounds', () => {
      const result = optimizer.ensureContrast('555555', '000000');

      if (result.wasAdjusted) {
        const originalLuminance = optimizer.getRelativeLuminance(result.originalForeground);
        const adjustedLuminance = optimizer.getRelativeLuminance(result.adjustedForeground);
        expect(adjustedLuminance).toBeGreaterThan(originalLuminance);
      }
    });

    it('should accept custom target ratio', () => {
      const result = optimizer.ensureContrast('888888', 'ffffff', 3.0);
      expect(result.targetRatio).toBe(3.0);
      expect(result.finalRatio).toBeGreaterThanOrEqual(3.0 - 0.01);
    });

    it('should return normalized hex colors', () => {
      const result = optimizer.ensureContrast('#AABBCC', '#FFFFFF');
      expect(result.originalForeground).toBe('aabbcc');
      expect(result.background).toBe('ffffff');
      expect(result.adjustedForeground).toMatch(/^[0-9a-f]{6}$/);
    });
  });

  describe('edge cases', () => {
    it('should handle pure white foreground on white background', () => {
      const result = optimizer.ensureContrast('ffffff', 'ffffff');
      expect(result.wasAdjusted).toBe(true);
      // Should darken to create contrast
      expect(result.finalRatio).toBeGreaterThan(1);
    });

    it('should handle pure black foreground on black background', () => {
      const result = optimizer.ensureContrast('000000', '000000');
      expect(result.wasAdjusted).toBe(true);
      // Should lighten to create contrast
      expect(result.finalRatio).toBeGreaterThan(1);
    });

    it('should handle grayscale colors', () => {
      const result = optimizer.ensureContrast('888888', 'dddddd');
      if (result.wasAdjusted) {
        // Should still create sufficient contrast
        expect(result.finalRatio).toBeGreaterThanOrEqual(3);
      }
    });

    it('should handle saturated colors', () => {
      // Bright red on white
      const result = optimizer.ensureContrast('ff0000', 'ffffff');
      // Red already has decent contrast on white (~4:1)
      expect(result.finalRatio).toBeGreaterThanOrEqual(4);
    });

    it('should handle 3-character hex shorthand', () => {
      const ratio = optimizer.calculateContrastRatio('fff', '000');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should handle 8-character hex with alpha', () => {
      // Should strip alpha channel
      const ratio = optimizer.calculateContrastRatio('ffffffFF', '000000FF');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should handle uppercase hex', () => {
      const ratio = optimizer.calculateContrastRatio('FFFFFF', '000000');
      expect(ratio).toBeCloseTo(21, 0);
    });
  });

  describe('color conversion', () => {
    describe('hexToRgb', () => {
      it('should convert black', () => {
        const rgb = optimizer.hexToRgb('000000');
        expect(rgb).toEqual({ r: 0, g: 0, b: 0 });
      });

      it('should convert white', () => {
        const rgb = optimizer.hexToRgb('ffffff');
        expect(rgb).toEqual({ r: 255, g: 255, b: 255 });
      });

      it('should convert colors correctly', () => {
        const rgb = optimizer.hexToRgb('ff5500');
        expect(rgb).toEqual({ r: 255, g: 85, b: 0 });
      });
    });

    describe('rgbToHex', () => {
      it('should convert black', () => {
        const hex = optimizer.rgbToHex({ r: 0, g: 0, b: 0 });
        expect(hex).toBe('000000');
      });

      it('should convert white', () => {
        const hex = optimizer.rgbToHex({ r: 255, g: 255, b: 255 });
        expect(hex).toBe('ffffff');
      });

      it('should pad single digit values', () => {
        const hex = optimizer.rgbToHex({ r: 1, g: 2, b: 3 });
        expect(hex).toBe('010203');
      });

      it('should clamp out of range values', () => {
        const hex = optimizer.rgbToHex({ r: 300, g: -10, b: 128 });
        expect(hex).toBe('ff0080');
      });
    });

    describe('hexToHsl', () => {
      it('should convert pure red', () => {
        const hsl = optimizer.hexToHsl('ff0000');
        expect(hsl.h).toBe(0);
        expect(hsl.s).toBe(100);
        expect(hsl.l).toBe(50);
      });

      it('should convert pure green', () => {
        const hsl = optimizer.hexToHsl('00ff00');
        expect(hsl.h).toBe(120);
        expect(hsl.s).toBe(100);
        expect(hsl.l).toBe(50);
      });

      it('should convert pure blue', () => {
        const hsl = optimizer.hexToHsl('0000ff');
        expect(hsl.h).toBe(240);
        expect(hsl.s).toBe(100);
        expect(hsl.l).toBe(50);
      });

      it('should convert grayscale', () => {
        const hsl = optimizer.hexToHsl('808080');
        expect(hsl.s).toBe(0);
        expect(hsl.l).toBe(50);
      });
    });

    describe('hslToHex', () => {
      it('should convert pure red', () => {
        const hex = optimizer.hslToHex({ h: 0, s: 100, l: 50 });
        expect(hex).toBe('ff0000');
      });

      it('should convert pure green', () => {
        const hex = optimizer.hslToHex({ h: 120, s: 100, l: 50 });
        expect(hex).toBe('00ff00');
      });

      it('should convert pure blue', () => {
        const hex = optimizer.hslToHex({ h: 240, s: 100, l: 50 });
        expect(hex).toBe('0000ff');
      });

      it('should round-trip correctly', () => {
        // Use a color that converts cleanly
        const original = 'ff5500';
        const hsl = optimizer.hexToHsl(original);
        const roundTripped = optimizer.hslToHex(hsl);
        expect(roundTripped).toBe(original);
      });
    });
  });

  describe('adjustLightness', () => {
    it('should increase lightness', () => {
      const original = '808080';
      const lighter = optimizer.adjustLightness(original, 20);
      const originalHsl = optimizer.hexToHsl(original);
      const lighterHsl = optimizer.hexToHsl(lighter);
      expect(lighterHsl.l).toBeGreaterThan(originalHsl.l);
    });

    it('should decrease lightness', () => {
      const original = '808080';
      const darker = optimizer.adjustLightness(original, -20);
      const originalHsl = optimizer.hexToHsl(original);
      const darkerHsl = optimizer.hexToHsl(darker);
      expect(darkerHsl.l).toBeLessThan(originalHsl.l);
    });

    it('should clamp at 0', () => {
      const result = optimizer.adjustLightness('333333', -100);
      const hsl = optimizer.hexToHsl(result);
      expect(hsl.l).toBe(0);
    });

    it('should clamp at 100', () => {
      const result = optimizer.adjustLightness('cccccc', 100);
      const hsl = optimizer.hexToHsl(result);
      expect(hsl.l).toBe(100);
    });
  });

  describe('setLightness', () => {
    it('should set specific lightness', () => {
      const result = optimizer.setLightness('ff5500', 75);
      const hsl = optimizer.hexToHsl(result);
      expect(hsl.l).toBe(75);
    });

    it('should preserve hue', () => {
      const original = 'ff5500';
      const originalHsl = optimizer.hexToHsl(original);
      const result = optimizer.setLightness(original, 30);
      const resultHsl = optimizer.hexToHsl(result);
      expect(resultHsl.h).toBe(originalHsl.h);
    });

    it('should preserve saturation', () => {
      const original = 'ff5500';
      const originalHsl = optimizer.hexToHsl(original);
      const result = optimizer.setLightness(original, 30);
      const resultHsl = optimizer.hexToHsl(result);
      expect(resultHsl.s).toBe(originalHsl.s);
    });
  });

  describe('getTargetRatio', () => {
    it('should return AA normal by default', () => {
      expect(optimizer.getTargetRatio()).toBe(4.5);
    });

    it('should return AA large when configured', () => {
      const opt = new ContrastOptimizer({ textSize: 'large' });
      expect(opt.getTargetRatio()).toBe(3.0);
    });

    it('should return AAA normal when configured', () => {
      const opt = new ContrastOptimizer({ level: 'AAA' });
      expect(opt.getTargetRatio()).toBe(7.0);
    });

    it('should return AAA large when configured', () => {
      const opt = new ContrastOptimizer({ level: 'AAA', textSize: 'large' });
      expect(opt.getTargetRatio()).toBe(4.5);
    });

    it('should allow override via parameters', () => {
      expect(optimizer.getTargetRatio('AAA', 'normal')).toBe(7.0);
    });
  });

  describe('optimizeThemePairs', () => {
    it('should optimize multiple color pairs', () => {
      const pairs = [
        { foreground: 'windowFg', background: 'windowBg' },
        { foreground: 'menuFg', background: 'menuBg' },
      ];
      const theme = {
        windowFg: 'aaaaaa',
        windowBg: 'ffffff',
        menuFg: 'bbbbbb',
        menuBg: 'eeeeee',
      };

      const results = optimizer.optimizeThemePairs(pairs, theme);

      expect(results.size).toBe(2);
      expect(results.get('windowFg')).toBeDefined();
      expect(results.get('menuFg')).toBeDefined();
    });

    it('should skip missing properties', () => {
      const pairs = [{ foreground: 'missing', background: 'windowBg' }];
      const theme = { windowBg: 'ffffff' };

      const results = optimizer.optimizeThemePairs(pairs, theme);

      expect(results.size).toBe(0);
    });
  });

  describe('WCAG standards constants', () => {
    it('should have correct AA ratios', () => {
      expect(WCAG_CONTRAST_RATIOS.AA.normal).toBe(4.5);
      expect(WCAG_CONTRAST_RATIOS.AA.large).toBe(3.0);
    });

    it('should have correct AAA ratios', () => {
      expect(WCAG_CONTRAST_RATIOS.AAA.normal).toBe(7.0);
      expect(WCAG_CONTRAST_RATIOS.AAA.large).toBe(4.5);
    });

    it('should have correct threshold constants', () => {
      expect(CONTRAST_THRESHOLDS.MAX_CONTRAST).toBe(21);
      expect(CONTRAST_THRESHOLDS.MIN_CONTRAST).toBe(1);
    });
  });

  describe('preferLighten option', () => {
    it('should lighten when preferLighten is true on dark background', () => {
      const opt = new ContrastOptimizer({ preferLighten: true });
      const result = opt.ensureContrast('444444', '222222');

      if (result.wasAdjusted) {
        const originalLum = opt.getRelativeLuminance(result.originalForeground);
        const adjustedLum = opt.getRelativeLuminance(result.adjustedForeground);
        expect(adjustedLum).toBeGreaterThan(originalLum);
      }
    });

    it('should darken when preferLighten is false on light background', () => {
      const opt = new ContrastOptimizer({ preferLighten: false });
      const result = opt.ensureContrast('cccccc', 'ffffff');

      if (result.wasAdjusted) {
        const originalLum = opt.getRelativeLuminance(result.originalForeground);
        const adjustedLum = opt.getRelativeLuminance(result.adjustedForeground);
        expect(adjustedLum).toBeLessThan(originalLum);
      }
    });
  });
});
