/**
 * WCAG 2.1 Contrast Ratio Standards
 * https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */

/**
 * WCAG conformance levels for contrast requirements.
 */
export type WCAGLevel = 'AA' | 'AAA';

/**
 * Text size categories affecting contrast requirements.
 */
export type TextSize = 'normal' | 'large';

/**
 * Minimum contrast ratios per WCAG 2.1 guidelines.
 * 
 * Level AA:
 * - Normal text: 4.5:1
 * - Large text (18pt+ or 14pt+ bold): 3:1
 * 
 * Level AAA:
 * - Normal text: 7:1
 * - Large text: 4.5:1
 */
export const WCAG_CONTRAST_RATIOS: Record<WCAGLevel, Record<TextSize, number>> = {
  AA: {
    normal: 4.5,
    large: 3.0,
  },
  AAA: {
    normal: 7.0,
    large: 4.5,
  },
};

/**
 * Common contrast ratio thresholds.
 */
export const CONTRAST_THRESHOLDS = {
  /** Minimum for WCAG AA normal text */
  AA_NORMAL: 4.5,
  /** Minimum for WCAG AA large text */
  AA_LARGE: 3.0,
  /** Minimum for WCAG AAA normal text */
  AAA_NORMAL: 7.0,
  /** Minimum for WCAG AAA large text */
  AAA_LARGE: 4.5,
  /** Maximum possible contrast (black/white) */
  MAX_CONTRAST: 21,
  /** Minimum possible contrast (same color) */
  MIN_CONTRAST: 1,
} as const;

/**
 * Configuration for the contrast optimizer.
 */
export interface ContrastOptimizerOptions {
  /**
   * Target WCAG conformance level.
   * @default 'AA'
   */
  level?: WCAGLevel;

  /**
   * Text size category.
   * @default 'normal'
   */
  textSize?: TextSize;

  /**
   * Maximum iterations for binary search convergence.
   * @default 20
   */
  maxIterations?: number;

  /**
   * Tolerance for contrast ratio matching.
   * @default 0.01
   */
  tolerance?: number;

  /**
   * Whether to prefer lightening over darkening when adjusting.
   * @default undefined (auto-detect based on background)
   */
  preferLighten?: boolean;
}

/**
 * Result of a contrast check or adjustment.
 */
export interface ContrastResult {
  /** Original foreground color */
  originalForeground: string;
  /** Original background color */
  background: string;
  /** Adjusted foreground color (if adjustment was needed) */
  adjustedForeground: string;
  /** Contrast ratio before adjustment */
  originalRatio: number;
  /** Contrast ratio after adjustment */
  finalRatio: number;
  /** Whether the original met the target */
  meetsTarget: boolean;
  /** Whether adjustment was performed */
  wasAdjusted: boolean;
  /** Number of iterations used (if adjusted) */
  iterations: number;
  /** Target contrast ratio */
  targetRatio: number;
}

/**
 * HSL color representation for hue-preserving adjustments.
 */
export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

/**
 * RGB color representation.
 */
export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

/**
 * Text-background color pair for contrast checking.
 */
export interface ColorPair {
  foreground: string;
  background: string;
  name?: string;
}

/**
 * Telegram-specific text-background pairs that should meet contrast requirements.
 */
export const TELEGRAM_TEXT_PAIRS: ColorPair[] = [
  { foreground: 'windowFg', background: 'windowBg', name: 'Window text' },
  { foreground: 'windowFgActive', background: 'windowBgActive', name: 'Active window text' },
  { foreground: 'windowSubTextFg', background: 'windowBg', name: 'Subtitle text' },
  { foreground: 'menuFg', background: 'menuBg', name: 'Menu text' },
  { foreground: 'historyTextInFg', background: 'msgInBg', name: 'Incoming message text' },
  { foreground: 'historyTextOutFg', background: 'msgOutBg', name: 'Outgoing message text' },
  { foreground: 'dialogsNameFg', background: 'dialogsBg', name: 'Dialog name' },
  { foreground: 'dialogsTextFg', background: 'dialogsBg', name: 'Dialog text' },
  { foreground: 'activeButtonFg', background: 'activeButtonBg', name: 'Active button text' },
  { foreground: 'lightButtonFg', background: 'lightButtonBg', name: 'Light button text' },
];
