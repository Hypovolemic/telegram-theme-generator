import {
  DEFAULT_LIGHT_THEME,
  DEFAULT_DARK_THEME,
} from './templates/base-theme';
import type { ThemeColors } from './templates/base-theme';
import { ThemeValidator } from './ThemeValidator';
import type { ValidationResult as AdvancedValidationResult, ValidatorOptions } from './ThemeValidator';

export type ThemeMode = 'light' | 'dark';

export interface ThemeBuilderOptions {
  mode?: ThemeMode;
  name?: string;
  author?: string;
  /** Options passed to the internal ThemeValidator */
  validatorOptions?: ValidatorOptions;
}

/**
 * Simple validation result for backward compatibility.
 * For advanced validation, use ThemeValidator directly.
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  missingProperties: string[];
}

export interface GeneratedTheme {
  name: string;
  content: string;
  properties: Record<string, string>;
  validation: ValidationResult;
  /** Advanced validation result with detailed issues */
  advancedValidation?: AdvancedValidationResult;
}

/**
 * TelegramThemeBuilder is responsible for mapping extracted colors
 * to Telegram Desktop theme properties and generating valid .tdesktop-theme files.
 */
export class TelegramThemeBuilder {
  private options: Required<Omit<ThemeBuilderOptions, 'validatorOptions'>>;
  private baseTheme: Record<string, string>;
  private validator: ThemeValidator;

  constructor(options: ThemeBuilderOptions = {}) {
    this.options = {
      mode: options.mode ?? 'light',
      name: options.name ?? 'Generated Theme',
      author: options.author ?? 'Telegram Theme Generator',
    };

    this.baseTheme =
      this.options.mode === 'dark' ? { ...DEFAULT_DARK_THEME } : { ...DEFAULT_LIGHT_THEME };

    this.validator = new ThemeValidator(options.validatorOptions);
  }

  /**
   * Builds a complete Telegram theme from extracted colors.
   * @param colors - The colors extracted from an image
   * @returns GeneratedTheme object with content and validation
   */
  buildTheme(colors: ThemeColors): GeneratedTheme {
    // Map colors to semantic properties
    const mappedProperties = this.mapColorsToProperties(colors);

    // Merge with base theme
    const finalProperties = {
      ...this.baseTheme,
      ...mappedProperties,
    };

    // Generate theme content
    const content = this.generateThemeContent(finalProperties);

    // Validate the theme
    const advancedValidation = this.validator.validate(finalProperties);
    const validation = this.convertToSimpleValidation(advancedValidation);

    return {
      name: this.options.name,
      content,
      properties: finalProperties,
      validation,
      advancedValidation,
    };
  }

  /**
   * Maps extracted colors to semantic Telegram theme properties.
   * Uses intelligent mapping based on color brightness and vibrancy.
   */
  private mapColorsToProperties(colors: ThemeColors): Record<string, string> {
    const properties: Record<string, string> = {};

    // Convert hex colors to format without #
    const primary = this.normalizeColor(colors.primary);
    const primaryLight = this.normalizeColor(colors.primaryLight);
    const primaryDark = this.normalizeColor(colors.primaryDark);
    const accent = this.normalizeColor(colors.accent);
    const accentLight = this.normalizeColor(colors.accentLight);
    const background = this.normalizeColor(colors.background);
    const backgroundSecondary = this.normalizeColor(colors.backgroundSecondary);
    const backgroundTertiary = this.normalizeColor(colors.backgroundTertiary);
    const textPrimary = this.normalizeColor(colors.textPrimary);
    const textSecondary = this.normalizeColor(colors.textSecondary);
    const textMuted = this.normalizeColor(colors.textMuted);
    const textOnPrimary = this.normalizeColor(colors.textOnPrimary);
    const online = this.normalizeColor(colors.online);

    // === Window/General ===
    properties.windowBg = background;
    properties.windowFg = textPrimary;
    properties.windowBgOver = backgroundSecondary;
    properties.windowBgRipple = backgroundTertiary;
    properties.windowFgOver = textPrimary;
    properties.windowSubTextFg = textSecondary;
    properties.windowSubTextFgOver = textSecondary;
    properties.windowBoldFg = textPrimary;
    properties.windowBoldFgOver = textPrimary;
    properties.windowBgActive = primary;
    properties.windowFgActive = textOnPrimary;
    properties.windowActiveTextFg = accent;

    // === Scrollbar ===
    properties.scrollBarBg = this.addAlpha(primary, '53');
    properties.scrollBarBgOver = this.addAlpha(primary, '7a');
    properties.scrollBg = this.addAlpha(textPrimary, '14');
    properties.scrollBgOver = this.addAlpha(textPrimary, '29');

    // === Links ===
    properties.linkFg = accent;
    properties.linkOverFg = accentLight;

    // === Tooltips ===
    properties.tooltipBg = backgroundSecondary;
    properties.tooltipFg = textPrimary;
    properties.tooltipBorderFg = backgroundTertiary;

    // === Menu ===
    properties.menuBg = backgroundSecondary;
    properties.menuBgOver = backgroundTertiary;
    properties.menuBgRipple = backgroundTertiary;
    properties.menuIconFg = textMuted;
    properties.menuIconFgOver = textSecondary;
    properties.menuSubmenuArrowFg = textPrimary;
    properties.menuFgDisabled = textMuted;
    properties.menuSeparatorFg = backgroundTertiary;

    // === Title Bar ===
    properties.titleBg = backgroundSecondary;
    properties.titleBgActive = backgroundTertiary;
    properties.titleFg = textMuted;
    properties.titleFgActive = textPrimary;

    // === Dialogs List ===
    properties.dialogsBg = background;
    properties.dialogsBgOver = backgroundSecondary;
    properties.dialogsBgActive = primary;
    properties.dialogsBgRipple = backgroundTertiary;
    properties.dialogsNameFg = textPrimary;
    properties.dialogsNameFgOver = textPrimary;
    properties.dialogsNameFgActive = textOnPrimary;
    properties.dialogsChatIconFg = accent;
    properties.dialogsChatIconFgOver = accent;
    properties.dialogsChatIconFgActive = textOnPrimary;
    properties.dialogsDateFg = textSecondary;
    properties.dialogsDateFgOver = textSecondary;
    properties.dialogsDateFgActive = textOnPrimary;
    properties.dialogsTextFg = textSecondary;
    properties.dialogsTextFgOver = textSecondary;
    properties.dialogsTextFgActive = textOnPrimary;
    properties.dialogsTextFgService = accent;
    properties.dialogsTextFgServiceOver = accent;
    properties.dialogsTextFgServiceActive = textOnPrimary;
    properties.dialogsDraftFg = this.getErrorColor();
    properties.dialogsDraftFgOver = this.getErrorColor();
    properties.dialogsDraftFgActive = this.lightenColor(textOnPrimary, 0.1);
    properties.dialogsVerifiedIconBg = primary;
    properties.dialogsVerifiedIconFg = textOnPrimary;
    properties.dialogsVerifiedIconBgOver = primary;
    properties.dialogsVerifiedIconFgOver = textOnPrimary;
    properties.dialogsVerifiedIconBgActive = textOnPrimary;
    properties.dialogsVerifiedIconFgActive = primary;
    properties.dialogsSendingIconFg = textMuted;
    properties.dialogsSendingIconFgOver = textMuted;
    properties.dialogsSendingIconFgActive = textOnPrimary;
    properties.dialogsSentIconFg = online;
    properties.dialogsSentIconFgOver = online;
    properties.dialogsSentIconFgActive = textOnPrimary;
    properties.dialogsUnreadBg = primary;
    properties.dialogsUnreadBgOver = primary;
    properties.dialogsUnreadBgActive = textOnPrimary;
    properties.dialogsUnreadBgMuted = textMuted;
    properties.dialogsUnreadBgMutedOver = textMuted;
    properties.dialogsUnreadBgMutedActive = textOnPrimary;
    properties.dialogsUnreadFg = textOnPrimary;
    properties.dialogsUnreadFgOver = textOnPrimary;
    properties.dialogsUnreadFgActive = primary;
    properties.dialogsOnlineBadgeFg = online;
    properties.dialogsForwardBg = primaryDark;
    properties.dialogsForwardFg = textOnPrimary;

    // === Search ===
    properties.searchedBarBg = backgroundTertiary;
    properties.searchedBarFg = textPrimary;

    // === Archive ===
    properties.dialogsArchiveFg = textSecondary;
    properties.dialogsArchiveFgOver = textSecondary;
    properties.dialogsArchiveBg = textMuted;
    properties.dialogsArchiveBgOver = textMuted;

    // === Chat History ===
    properties.historyPeerArchiveUserpicBg = textSecondary;
    properties.historyScrollBarBg = this.addAlpha(primary, '7a');
    properties.historyScrollBarBgOver = this.addAlpha(primary, 'bc');
    properties.historyScrollBg = this.addAlpha(textPrimary, '14');
    properties.historyScrollBgOver = this.addAlpha(textPrimary, '29');
    properties.historyForwardChooseBg = this.addAlpha('000000', '66');
    properties.historyForwardChooseFg = textOnPrimary;

    // === Message Bubbles - Outgoing ===
    const outgoingBg = this.options.mode === 'dark' 
      ? primaryDark 
      : this.lightenColor(primary, 0.85);
    properties.msgOutBg = outgoingBg;
    properties.msgOutBgSelected = this.darkenColor(outgoingBg, 0.1);
    properties.msgOutShadow = this.addAlpha(primaryDark, '29');
    properties.msgOutShadowSelected = this.addAlpha(primaryDark, '29');
    properties.msgOutServiceFg = this.options.mode === 'dark' ? accentLight : primaryDark;
    properties.msgOutServiceFgSelected = this.options.mode === 'dark' ? accentLight : primaryDark;
    properties.msgOutDateFg = this.options.mode === 'dark' ? accentLight : this.lightenColor(primaryDark, 0.3);
    properties.msgOutDateFgSelected = this.options.mode === 'dark' ? accentLight : this.lightenColor(primaryDark, 0.3);

    // === Message Bubbles - Incoming ===
    const incomingBg = this.options.mode === 'dark' 
      ? this.darkenColor(background, 0.1) 
      : background;
    properties.msgInBg = incomingBg;
    properties.msgInBgSelected = this.darkenColor(incomingBg, 0.1);
    properties.msgInShadow = this.addAlpha(textMuted, '29');
    properties.msgInShadowSelected = this.addAlpha(textMuted, '29');
    properties.msgInServiceFg = accent;
    properties.msgInServiceFgSelected = accent;
    properties.msgInDateFg = textMuted;
    properties.msgInDateFgSelected = textMuted;

    // === Service Messages ===
    properties.msgServiceBg = this.addAlpha(primary, 'a7');
    properties.msgServiceBgSelected = this.addAlpha(primary, 'ab');
    properties.msgServiceFg = textOnPrimary;

    // === Selection ===
    properties.msgSelectOverlay = this.addAlpha(primary, '66');
    properties.msgStickerOverlay = this.addAlpha(primary, '7f');

    // === Reply Bars ===
    properties.msgInReplyBarColor = accent;
    properties.msgInReplyBarSelColor = accent;
    properties.msgOutReplyBarColor = this.options.mode === 'dark' ? accentLight : primaryDark;
    properties.msgOutReplyBarSelColor = this.options.mode === 'dark' ? accentLight : primaryDark;
    properties.msgInMonoFg = this.options.mode === 'dark' ? accentLight : primaryDark;
    properties.msgInMonoFgSelected = this.options.mode === 'dark' ? accentLight : primaryDark;
    properties.msgOutMonoFg = this.options.mode === 'dark' ? accentLight : primaryDark;
    properties.msgOutMonoFgSelected = this.options.mode === 'dark' ? accentLight : primaryDark;

    // === Media Date ===
    properties.msgDateImgBg = this.addAlpha('000000', '54');
    properties.msgDateImgFg = 'ffffff';

    // === Voice Waveform ===
    properties.msgWaveformInActive = accent;
    properties.msgWaveformInInactive = backgroundTertiary;
    properties.msgWaveformOutActive = this.options.mode === 'dark' ? accentLight : primaryDark;
    properties.msgWaveformOutInactive = this.options.mode === 'dark' ? primaryDark : this.lightenColor(primary, 0.5);

    // === Compose Area ===
    properties.historyComposeAreaBg = background;
    properties.historyComposeAreaFg = textPrimary;
    properties.historyComposeAreaFgService = textSecondary;
    properties.historyComposeIconFg = textMuted;
    properties.historyComposeIconFgOver = accent;
    properties.historySendIconFg = accent;
    properties.historySendIconFgOver = accentLight;
    properties.historyPinnedBg = backgroundSecondary;
    properties.historyReplyBg = backgroundSecondary;
    properties.historyReplyIconFg = accent;
    properties.historyReplyCancelFg = textMuted;
    properties.historyReplyCancelFgOver = textSecondary;

    // === Scroll to Bottom ===
    properties.historyToDownBg = background;
    properties.historyToDownBgOver = backgroundSecondary;
    properties.historyToDownBgRipple = backgroundTertiary;
    properties.historyToDownFg = accent;
    properties.historyToDownFgOver = accent;
    properties.historyToDownShadow = '00000040';

    // === History Text ===
    properties.historyTextInFg = textPrimary;
    properties.historyTextInFgSelected = textPrimary;
    properties.historyTextOutFg = textPrimary;
    properties.historyTextOutFgSelected = textPrimary;
    properties.historyLinkInFg = accent;
    properties.historyLinkInFgSelected = accent;
    properties.historyLinkOutFg = this.options.mode === 'dark' ? accentLight : accent;
    properties.historyLinkOutFgSelected = this.options.mode === 'dark' ? accentLight : accent;

    // === Read Markers ===
    properties.historyOutIconFg = online;
    properties.historyOutIconFgSelected = online;
    properties.historyIconFgInverted = 'ffffffc8';

    // === Profile/Top Bar ===
    properties.topBarBg = background;
    properties.profileBg = background;
    properties.profileVerifiedCheckBg = primary;
    properties.profileVerifiedCheckFg = textOnPrimary;

    // === Emoji Panel ===
    properties.emojiPanBg = backgroundSecondary;
    properties.emojiPanCategories = backgroundSecondary;
    properties.emojiPanHeaderBg = backgroundSecondary;
    properties.emojiPanHeaderFg = textSecondary;
    properties.stickerPanDeleteBg = this.addAlpha(backgroundSecondary, 'cc');
    properties.stickerPanDeleteFg = textPrimary;
    properties.stickerPreviewBg = this.addAlpha(backgroundSecondary, 'eb');

    // === Box/Dialog ===
    properties.boxBg = background;
    properties.boxTextFg = textPrimary;
    properties.boxTextFgGood = online;
    properties.boxTextFgError = this.getErrorColor();
    properties.boxTitleFg = textPrimary;
    properties.boxSearchBg = backgroundSecondary;
    properties.boxTitleAdditionalFg = textMuted;
    properties.boxTitleCloseFg = textMuted;
    properties.boxTitleCloseFgOver = textSecondary;

    // === Buttons ===
    properties.activeButtonBg = primary;
    properties.activeButtonBgOver = primaryLight;
    properties.activeButtonBgRipple = primaryDark;
    properties.activeButtonFg = textOnPrimary;
    properties.activeButtonFgOver = textOnPrimary;
    properties.activeButtonSecondaryFg = this.addAlpha(textOnPrimary, 'cc');
    properties.activeButtonSecondaryFgOver = this.addAlpha(textOnPrimary, 'cc');
    properties.activeLineFg = accent;
    properties.activeLineFgError = this.getErrorColor();
    properties.lightButtonBg = background;
    properties.lightButtonBgOver = backgroundSecondary;
    properties.lightButtonBgRipple = backgroundTertiary;
    properties.lightButtonFg = accent;
    properties.lightButtonFgOver = accent;
    properties.cancelIconFg = textMuted;
    properties.cancelIconFgOver = textSecondary;

    // === Checkbox/Slider ===
    properties.checkboxFg = textMuted;
    properties.sliderBgInactive = backgroundTertiary;
    properties.sliderBgActive = primary;

    // === Input ===
    properties.inputBorderFg = backgroundTertiary;

    // === Media Player ===
    properties.mediaPlayerBg = background;
    properties.mediaPlayerActiveFg = accent;
    properties.mediaPlayerInactiveFg = backgroundTertiary;
    properties.mediaPlayerDisabledFg = backgroundSecondary;

    // === Notification ===
    properties.notificationBg = background;

    // === Calls ===
    properties.callBg = this.addAlpha('26282c', 'f2');
    properties.callNameFg = 'ffffff';
    properties.callFingerprintBg = 'ffffff12';
    properties.callStatusFg = 'ffffff';
    properties.callIconFg = 'ffffff';
    properties.callAnswerBg = online;
    properties.callAnswerRipple = this.lightenColor(online, 0.3);
    properties.callAnswerBgOuter = this.addAlpha(online, '66');
    properties.callHangupBg = this.getErrorColor();
    properties.callHangupRipple = this.lightenColor(this.getErrorColor(), 0.3);
    properties.callBarBg = online;
    properties.callBarFg = 'ffffff';

    // === Intro ===
    properties.introBg = background;
    properties.introTitleFg = textPrimary;
    properties.introDescriptionFg = textSecondary;
    properties.introErrorFg = this.getErrorColor();
    properties.introCoverTopBg = primaryLight;
    properties.introCoverBottomBg = primary;
    properties.introCoverIconsFg = accent;

    // === Settings Sidebar ===
    properties.sideBarBg = backgroundSecondary;
    properties.sideBarBgActive = primary;
    properties.sideBarBgRipple = backgroundTertiary;
    properties.sideBarTextFg = textPrimary;
    properties.sideBarTextFgActive = textOnPrimary;
    properties.sideBarIconFg = textSecondary;
    properties.sideBarIconFgActive = textOnPrimary;
    properties.sideBarBadgeBg = primary;
    properties.sideBarBadgeBgMuted = textMuted;
    properties.sideBarBadgeFg = textOnPrimary;

    // === Placeholder ===
    properties.placeholderFg = textMuted;
    properties.placeholderFgActive = textSecondary;

    return properties;
  }

  /**
   * Generates the .tdesktop-theme file content.
   */
  private generateThemeContent(properties: Record<string, string>): string {
    const lines: string[] = [
      `// ${this.options.name}`,
      `// Generated by ${this.options.author}`,
      `// Mode: ${this.options.mode}`,
      '',
    ];

    // Sort properties alphabetically for consistency
    const sortedKeys = Object.keys(properties).sort();

    for (const key of sortedKeys) {
      const value = properties[key];
      lines.push(`${key}: #${value};`);
    }

    return lines.join('\n');
  }

  /**
   * Validates the generated theme properties.
   * Uses the internal ThemeValidator for comprehensive validation.
   */
  validateTheme(properties: Record<string, string>): ValidationResult {
    const advancedResult = this.validator.validate(properties);
    return this.convertToSimpleValidation(advancedResult);
  }

  /**
   * Converts advanced validation result to simple format for backward compatibility.
   */
  private convertToSimpleValidation(advanced: AdvancedValidationResult): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingProperties: string[] = [];

    for (const issue of advanced.issues) {
      const message = issue.property
        ? `${issue.message} (${issue.property})`
        : issue.message;

      if (issue.severity === 'error') {
        errors.push(message);
        if (issue.message.includes('Missing required')) {
          missingProperties.push(issue.property || '');
        }
      } else {
        warnings.push(message);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      missingProperties,
    };
  }

  /**
   * Returns the internal ThemeValidator for advanced validation features.
   */
  getValidator(): ThemeValidator {
    return this.validator;
  }

  /**
   * Creates a .tdesktop-theme file as a Blob.
   */
  createThemeFile(theme: GeneratedTheme): Blob {
    return new Blob([theme.content], { type: 'application/octet-stream' });
  }

  /**
   * Creates a download URL for the theme file.
   */
  createDownloadUrl(theme: GeneratedTheme): string {
    const blob = this.createThemeFile(theme);
    return URL.createObjectURL(blob);
  }

  /**
   * Generates a filename for the theme.
   */
  getFilename(): string {
    const safeName = this.options.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `${safeName}.tdesktop-theme`;
  }

  // === Color Utility Methods ===

  /**
   * Normalizes a color to hex format without #.
   */
  private normalizeColor(color: string): string {
    return color.replace(/^#/, '').toLowerCase();
  }

  /**
   * Adds alpha channel to a color.
   */
  private addAlpha(color: string, alpha: string): string {
    const normalized = this.normalizeColor(color);
    // If already has alpha, replace it
    if (normalized.length === 8) {
      return normalized.slice(0, 6) + alpha;
    }
    return normalized + alpha;
  }

  /**
   * Lightens a color by a percentage.
   */
  private lightenColor(color: string, amount: number): string {
    const normalized = this.normalizeColor(color);
    const rgb = this.hexToRgb(normalized);
    
    const lightened = rgb.map((c) => {
      const newValue = Math.round(c + (255 - c) * amount);
      return Math.min(255, Math.max(0, newValue));
    });

    return this.rgbToHex(lightened as [number, number, number]);
  }

  /**
   * Darkens a color by a percentage.
   */
  private darkenColor(color: string, amount: number): string {
    const normalized = this.normalizeColor(color);
    const rgb = this.hexToRgb(normalized);
    
    const darkened = rgb.map((c) => {
      const newValue = Math.round(c * (1 - amount));
      return Math.min(255, Math.max(0, newValue));
    });

    return this.rgbToHex(darkened as [number, number, number]);
  }

  /**
   * Converts hex color to RGB array.
   */
  private hexToRgb(hex: string): [number, number, number] {
    const normalized = hex.replace(/^#/, '').slice(0, 6);
    const bigint = parseInt(normalized, 16);
    return [
      (bigint >> 16) & 255,
      (bigint >> 8) & 255,
      bigint & 255,
    ];
  }

  /**
   * Converts RGB array to hex string.
   */
  private rgbToHex(rgb: [number, number, number]): string {
    return rgb
      .map((c) => {
        const hex = Math.round(c).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('');
  }

  /**
   * Gets a suitable error/danger color.
   */
  private getErrorColor(): string {
    return this.options.mode === 'dark' ? 'e48383' : 'dd4b39';
  }

  /**
   * Validates that a color is in valid hex format.
   */
  private isValidColorFormat(color: string): boolean {
    // Valid formats: RRGGBB or RRGGBBAA
    return /^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(color);
  }

  /**
   * Gets the current theme mode.
   */
  getMode(): ThemeMode {
    return this.options.mode;
  }

  /**
   * Gets the theme name.
   */
  getName(): string {
    return this.options.name;
  }
}

export default TelegramThemeBuilder;
