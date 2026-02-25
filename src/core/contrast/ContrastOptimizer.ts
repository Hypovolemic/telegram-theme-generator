import {
  type WCAGLevel,
  type TextSize,
  type ContrastOptimizerOptions,
  type ContrastResult,
  type HSLColor,
  type RGBColor,
  WCAG_CONTRAST_RATIOS,
} from './wcag-standards';

/**
 * ContrastOptimizer provides WCAG 2.1 compliant contrast ratio calculations
 * and automatic color adjustment to ensure text readability.
 *
 * Features:
 * - Calculate contrast ratios per WCAG 2.1 formula
 * - Adjust colors to meet AA (4.5:1) or AAA (7:1) standards
 * - Preserve hue while adjusting lightness
 * - Binary search for efficient convergence (<20 iterations)
 *
 * @example
 * ```typescript
 * const optimizer = new ContrastOptimizer({ level: 'AA' });
 * const ratio = optimizer.calculateContrastRatio('#ffffff', '#000000');
 * // ratio = 21 (maximum contrast)
 *
 * const result = optimizer.ensureContrast('#777777', '#ffffff');
 * // result.adjustedForeground = adjusted color meeting AA standard
 * ```
 */
export class ContrastOptimizer {
  private options: Required<Omit<ContrastOptimizerOptions, 'preferLighten'>> & {
    preferLighten?: boolean;
  };

  constructor(options: ContrastOptimizerOptions = {}) {
    this.options = {
      level: options.level ?? 'AA',
      textSize: options.textSize ?? 'normal',
      maxIterations: options.maxIterations ?? 20,
      tolerance: options.tolerance ?? 0.01,
      preferLighten: options.preferLighten,
    };
  }

  // ============================================================
  // Public API
  // ============================================================

  /**
   * Calculates the WCAG 2.1 contrast ratio between two colors.
   *
   * The contrast ratio is calculated as (L1 + 0.05) / (L2 + 0.05)
   * where L1 is the relative luminance of the lighter color and
   * L2 is the relative luminance of the darker color.
   *
   * @param foreground - Foreground color (hex string with or without #)
   * @param background - Background color (hex string with or without #)
   * @returns Contrast ratio from 1:1 to 21:1
   */
  calculateContrastRatio(foreground: string, background: string): number {
    const fgLuminance = this.getRelativeLuminance(foreground);
    const bgLuminance = this.getRelativeLuminance(background);

    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);

    // WCAG 2.1 contrast ratio formula
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Calculates the relative luminance of a color per WCAG 2.1.
   *
   * Relative luminance is the relative brightness of any point in a colorspace,
   * normalized to 0 for darkest black and 1 for lightest white.
   *
   * @param color - Hex color string (with or without #)
   * @returns Relative luminance value between 0 and 1
   */
  getRelativeLuminance(color: string): number {
    const rgb = this.hexToRgb(color);

    // Convert RGB to sRGB
    const sR = rgb.r / 255;
    const sG = rgb.g / 255;
    const sB = rgb.b / 255;

    // Apply gamma correction
    const r = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
    const g = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
    const b = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);

    // Calculate relative luminance using ITU-R BT.709 coefficients
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Adjusts the foreground color to meet the target contrast ratio,
   * preserving the original hue while adjusting lightness.
   *
   * Uses binary search for efficient convergence (typically <10 iterations).
   *
   * @param foreground - Foreground color to adjust (hex string)
   * @param background - Background color (remains unchanged)
   * @param targetRatio - Optional custom target ratio (defaults to level/textSize)
   * @returns ContrastResult with original and adjusted colors
   */
  ensureContrast(foreground: string, background: string, targetRatio?: number): ContrastResult {
    const target = targetRatio ?? this.getTargetRatio();
    const originalRatio = this.calculateContrastRatio(foreground, background);

    // Already meets target
    if (originalRatio >= target) {
      return {
        originalForeground: this.normalizeHex(foreground),
        background: this.normalizeHex(background),
        adjustedForeground: this.normalizeHex(foreground),
        originalRatio,
        finalRatio: originalRatio,
        meetsTarget: true,
        wasAdjusted: false,
        iterations: 0,
        targetRatio: target,
      };
    }

    // Determine adjustment direction based on background luminance
    const bgLuminance = this.getRelativeLuminance(background);
    const shouldLighten = this.options.preferLighten ?? bgLuminance < 0.5;

    // Perform binary search adjustment
    const { adjustedColor, finalRatio, iterations } = this.binarySearchAdjust(
      foreground,
      background,
      target,
      shouldLighten
    );

    return {
      originalForeground: this.normalizeHex(foreground),
      background: this.normalizeHex(background),
      adjustedForeground: adjustedColor,
      originalRatio,
      finalRatio,
      meetsTarget: finalRatio >= target - this.options.tolerance,
      wasAdjusted: true,
      iterations,
      targetRatio: target,
    };
  }

  /**
   * Checks if a color pair meets the specified WCAG standard.
   *
   * @param foreground - Foreground color (hex string)
   * @param background - Background color (hex string)
   * @param level - WCAG level to check (defaults to instance level)
   * @param textSize - Text size category (defaults to instance textSize)
   * @returns Whether the pair meets the standard
   */
  meetsStandard(
    foreground: string,
    background: string,
    level?: WCAGLevel,
    textSize?: TextSize
  ): boolean {
    const ratio = this.calculateContrastRatio(foreground, background);
    const targetLevel = level ?? this.options.level;
    const targetSize = textSize ?? this.options.textSize;
    return ratio >= WCAG_CONTRAST_RATIOS[targetLevel][targetSize];
  }

  /**
   * Gets the target contrast ratio based on current options.
   */
  getTargetRatio(level?: WCAGLevel, textSize?: TextSize): number {
    const targetLevel = level ?? this.options.level;
    const targetSize = textSize ?? this.options.textSize;
    return WCAG_CONTRAST_RATIOS[targetLevel][targetSize];
  }

  /**
   * Optimizes multiple color pairs to meet contrast requirements.
   *
   * @param pairs - Array of foreground/background pairs with property mappings
   * @param themeProperties - Theme properties object to read colors from
   * @returns Map of property names to adjusted colors
   */
  optimizeThemePairs(
    pairs: Array<{ foreground: string; background: string; name?: string }>,
    themeProperties: Record<string, string>
  ): Map<string, ContrastResult> {
    const results = new Map<string, ContrastResult>();

    for (const pair of pairs) {
      const fgColor = themeProperties[pair.foreground];
      const bgColor = themeProperties[pair.background];

      if (fgColor && bgColor) {
        const result = this.ensureContrast(fgColor, bgColor);
        results.set(pair.foreground, result);
      }
    }

    return results;
  }

  // ============================================================
  // Binary Search Implementation
  // ============================================================

  /**
   * Performs binary search to find optimal lightness adjustment.
   */
  private binarySearchAdjust(
    foreground: string,
    background: string,
    targetRatio: number,
    shouldLighten: boolean
  ): { adjustedColor: string; finalRatio: number; iterations: number } {
    const hsl = this.hexToHsl(foreground);
    let iterations = 0;

    // Set search bounds for lightness
    let low: number;
    let high: number;

    if (shouldLighten) {
      low = hsl.l;
      high = 100;
    } else {
      low = 0;
      high = hsl.l;
    }

    let bestColor = this.hslToHex(hsl);
    let bestRatio = this.calculateContrastRatio(bestColor, background);

    // Binary search for optimal lightness
    while (iterations < this.options.maxIterations && high - low > 0.1) {
      const mid = (low + high) / 2;
      const testHsl: HSLColor = { h: hsl.h, s: hsl.s, l: mid };
      const testColor = this.hslToHex(testHsl);
      const testRatio = this.calculateContrastRatio(testColor, background);

      iterations++;

      // Update best if closer to target
      if (testRatio >= targetRatio - this.options.tolerance) {
        bestColor = testColor;
        bestRatio = testRatio;

        // Try to find a color closer to original
        if (shouldLighten) {
          high = mid;
        } else {
          low = mid;
        }
      } else {
        // Need more contrast
        if (shouldLighten) {
          low = mid;
        } else {
          high = mid;
        }
      }

      // Early exit if we've met the target
      if (Math.abs(testRatio - targetRatio) < this.options.tolerance) {
        bestColor = testColor;
        bestRatio = testRatio;
        break;
      }
    }

    // If still not meeting target, try extreme values
    if (bestRatio < targetRatio - this.options.tolerance) {
      const extremeHsl: HSLColor = { h: hsl.h, s: hsl.s, l: shouldLighten ? 100 : 0 };
      const extremeColor = this.hslToHex(extremeHsl);
      const extremeRatio = this.calculateContrastRatio(extremeColor, background);

      if (extremeRatio > bestRatio) {
        bestColor = extremeColor;
        bestRatio = extremeRatio;
      }
    }

    return {
      adjustedColor: bestColor,
      finalRatio: bestRatio,
      iterations,
    };
  }

  // ============================================================
  // Color Conversion Utilities
  // ============================================================

  /**
   * Converts a hex color string to RGB components.
   */
  hexToRgb(hex: string): RGBColor {
    const normalized = this.normalizeHex(hex);

    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16),
    };
  }

  /**
   * Converts RGB components to hex string (without #).
   */
  rgbToHex(rgb: RGBColor): string {
    const r = Math.round(Math.max(0, Math.min(255, rgb.r)));
    const g = Math.round(Math.max(0, Math.min(255, rgb.g)));
    const b = Math.round(Math.max(0, Math.min(255, rgb.b)));

    return (
      r.toString(16).padStart(2, '0') +
      g.toString(16).padStart(2, '0') +
      b.toString(16).padStart(2, '0')
    );
  }

  /**
   * Converts a hex color to HSL representation.
   */
  hexToHsl(hex: string): HSLColor {
    const rgb = this.hexToRgb(hex);
    return this.rgbToHsl(rgb);
  }

  /**
   * Converts RGB to HSL color space.
   */
  rgbToHsl(rgb: RGBColor): HSLColor {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  /**
   * Converts HSL to hex color string (without #).
   */
  hslToHex(hsl: HSLColor): string {
    const rgb = this.hslToRgb(hsl);
    return this.rgbToHex(rgb);
  }

  /**
   * Converts HSL to RGB color space.
   */
  hslToRgb(hsl: HSLColor): RGBColor {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    if (s === 0) {
      const gray = Math.round(l * 255);
      return { r: gray, g: gray, b: gray };
    }

    const hue2rgb = (p: number, q: number, t: number): number => {
      let tNorm = t;
      if (tNorm < 0) tNorm += 1;
      if (tNorm > 1) tNorm -= 1;
      if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
      if (tNorm < 1 / 2) return q;
      if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return {
      r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    };
  }

  /**
   * Normalizes a hex color string (removes # prefix, handles shorthand).
   */
  normalizeHex(hex: string): string {
    let normalized = hex.replace(/^#/, '').toLowerCase();

    // Handle shorthand (e.g., "fff" -> "ffffff")
    if (normalized.length === 3) {
      normalized = normalized
        .split('')
        .map((c) => c + c)
        .join('');
    }

    // Remove alpha if present (8-char hex)
    if (normalized.length === 8) {
      normalized = normalized.slice(0, 6);
    }

    return normalized;
  }

  /**
   * Adjusts color lightness by a specific amount.
   *
   * @param hex - Hex color to adjust
   * @param amount - Lightness adjustment (-100 to 100)
   * @returns Adjusted hex color
   */
  adjustLightness(hex: string, amount: number): string {
    const hsl = this.hexToHsl(hex);
    hsl.l = Math.max(0, Math.min(100, hsl.l + amount));
    return this.hslToHex(hsl);
  }

  /**
   * Creates a color with specific lightness while preserving hue and saturation.
   *
   * @param hex - Original color for hue/saturation
   * @param lightness - Target lightness (0-100)
   * @returns New hex color
   */
  setLightness(hex: string, lightness: number): string {
    const hsl = this.hexToHsl(hex);
    hsl.l = Math.max(0, Math.min(100, lightness));
    return this.hslToHex(hsl);
  }
}

/**
 * Default singleton instance for convenient access.
 */
export const contrastOptimizer = new ContrastOptimizer();
