import {
  THEME_PROPERTIES,
  REQUIRED_PROPERTIES,
} from './templates/base-theme';
import type { ThemeProperty, ThemeCategory } from './templates/base-theme';

/**
 * Severity levels for validation issues.
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';

/**
 * Individual validation issue with detailed information.
 */
export interface ValidationIssue {
  severity: ValidationSeverity;
  property: string;
  message: string;
  code: ValidationErrorCode;
  suggestion?: string;
}

/**
 * Error codes for categorizing validation issues.
 */
export type ValidationErrorCode =
  | 'MISSING_REQUIRED'
  | 'MISSING_OPTIONAL'
  | 'INVALID_FORMAT'
  | 'INVALID_ALPHA'
  | 'COLOR_CONTRAST'
  | 'DUPLICATE_VALUE'
  | 'UNKNOWN_PROPERTY'
  | 'SEMANTIC_MISMATCH';

/**
 * Comprehensive validation result with categorized issues.
 */
export interface ValidationResult {
  valid: boolean;
  score: number; // 0-100 quality score
  /** All issues combined */
  issues: ValidationIssue[];
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  info: ValidationIssue[];
  summary: ValidationSummary;
}

/**
 * Summary statistics for validation results.
 */
export interface ValidationSummary {
  totalProperties: number;
  presentProperties: number;
  missingRequired: number;
  missingOptional: number;
  invalidFormats: number;
  coverage: number; // Percentage of properties defined
  categoryCoverage: Record<ThemeCategory, number>;
}

/**
 * Configuration options for the validator.
 */
export interface ValidatorOptions {
  /**
   * Whether to validate color contrast ratios.
   * @default false
   */
  checkContrast?: boolean;

  /**
   * Whether to check for semantic consistency.
   * @default false
   */
  checkSemantic?: boolean;

  /**
   * Whether to warn about unknown properties.
   * @default true
   */
  warnUnknown?: boolean;

  /**
   * Minimum acceptable quality score (0-100).
   * @default 70
   */
  minScore?: number;

  /**
   * Custom validation rules to apply.
   */
  customRules?: ValidationRule[];
}

/**
 * Interface for custom validation rules.
 */
export interface ValidationRule {
  name: string;
  description: string;
  validate: (properties: Record<string, string>) => ValidationIssue[];
}

/**
 * ThemeValidator provides comprehensive validation for Telegram Desktop themes.
 * 
 * This class can be extended to add custom validation logic or used standalone
 * for theme validation. It supports:
 * 
 * - Required property validation
 * - Color format validation (hex with optional alpha)
 * - Coverage analysis by category
 * - Quality scoring
 * - Custom validation rules
 * - Contrast checking (future)
 * - Semantic consistency checking (future)
 * 
 * @example
 * ```typescript
 * const validator = new ThemeValidator();
 * const result = validator.validate(themeProperties);
 * 
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export class ThemeValidator {
  protected options: Required<ValidatorOptions>;
  protected customRules: ValidationRule[] = [];

  constructor(options: ValidatorOptions = {}) {
    this.options = {
      checkContrast: options.checkContrast ?? false,
      checkSemantic: options.checkSemantic ?? false,
      warnUnknown: options.warnUnknown ?? true,
      minScore: options.minScore ?? 70,
      customRules: options.customRules ?? [],
    };

    this.customRules = this.options.customRules;
  }

  /**
   * Validates theme properties and returns comprehensive results.
   * @param properties - Theme properties to validate
   * @returns Detailed validation result
   */
  validate(properties: Record<string, string>): ValidationResult {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    const info: ValidationIssue[] = [];

    // Run all validation checks
    errors.push(...this.validateRequiredProperties(properties));
    errors.push(...this.validateColorFormats(properties));
    warnings.push(...this.validateOptionalProperties(properties));

    if (this.options.warnUnknown) {
      info.push(...this.validateUnknownProperties(properties));
    }

    if (this.options.checkContrast) {
      warnings.push(...this.validateColorContrast(properties));
    }

    if (this.options.checkSemantic) {
      warnings.push(...this.validateSemanticConsistency(properties));
    }

    // Run custom validation rules
    for (const rule of this.customRules) {
      const issues = rule.validate(properties);
      for (const issue of issues) {
        if (issue.severity === 'error') {
          errors.push(issue);
        } else if (issue.severity === 'warning') {
          warnings.push(issue);
        } else {
          info.push(issue);
        }
      }
    }

    // Calculate summary
    const summary = this.calculateSummary(properties, errors, warnings);

    // Calculate quality score
    const score = this.calculateScore(summary, errors, warnings);

    return {
      valid: errors.length === 0 && score >= this.options.minScore,
      score,
      issues: [...errors, ...warnings, ...info],
      errors,
      warnings,
      info,
      summary,
    };
  }

  /**
   * Validates that all required properties are present.
   */
  protected validateRequiredProperties(properties: Record<string, string>): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    for (const required of REQUIRED_PROPERTIES) {
      if (!properties[required]) {
        issues.push({
          severity: 'error',
          property: required,
          message: `Missing required property: ${required}`,
          code: 'MISSING_REQUIRED',
          suggestion: `Add the property: ${required}: #RRGGBB;`,
        });
      }
    }

    return issues;
  }

  /**
   * Validates that all color values are in valid hex format.
   */
  protected validateColorFormats(properties: Record<string, string>): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    for (const [key, value] of Object.entries(properties)) {
      if (!this.isValidColorFormat(value)) {
        issues.push({
          severity: 'error',
          property: key,
          message: `Invalid color format for ${key}: "${value}"`,
          code: 'INVALID_FORMAT',
          suggestion: 'Use format RRGGBB or RRGGBBAA (hex without #)',
        });
      }
    }

    return issues;
  }

  /**
   * Checks for missing optional properties.
   */
  protected validateOptionalProperties(properties: Record<string, string>): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const requiredSet = new Set(REQUIRED_PROPERTIES);

    for (const prop of THEME_PROPERTIES) {
      if (!requiredSet.has(prop.key) && !properties[prop.key]) {
        issues.push({
          severity: 'warning',
          property: prop.key,
          message: `Missing optional property: ${prop.key} (${prop.description})`,
          code: 'MISSING_OPTIONAL',
        });
      }
    }

    return issues;
  }

  /**
   * Checks for properties not in the known schema.
   */
  protected validateUnknownProperties(properties: Record<string, string>): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const knownKeys = new Set(THEME_PROPERTIES.map((p) => p.key));

    for (const key of Object.keys(properties)) {
      if (!knownKeys.has(key)) {
        issues.push({
          severity: 'info',
          property: key,
          message: `Unknown property: ${key}`,
          code: 'UNKNOWN_PROPERTY',
          suggestion: 'This property may not be recognized by Telegram Desktop',
        });
      }
    }

    return issues;
  }

  /**
   * Validates color contrast ratios for accessibility.
   * Placeholder for future implementation.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected validateColorContrast(properties: Record<string, string>): ValidationIssue[] {
    // TODO: Implement WCAG contrast ratio checking
    // This would check pairs like:
    // - windowBg vs windowFg
    // - msgInBg vs historyTextInFg
    // - activeButtonBg vs activeButtonFg
    return [];
  }

  /**
   * Validates semantic consistency of color assignments.
   * Placeholder for future implementation.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected validateSemanticConsistency(properties: Record<string, string>): ValidationIssue[] {
    // TODO: Implement semantic checks like:
    // - Active states should be visually distinct
    // - Hover states should be visually different from default
    // - Error colors should be distinct from success colors
    return [];
  }

  /**
   * Calculates validation summary statistics.
   */
  protected calculateSummary(
    properties: Record<string, string>,
    errors: ValidationIssue[],
    warnings: ValidationIssue[]
  ): ValidationSummary {
    const knownKeys = THEME_PROPERTIES.map((p) => p.key);
    const presentKeys = Object.keys(properties).filter((k) => knownKeys.includes(k));

    // Calculate category coverage
    const categoryCoverage = this.calculateCategoryCoverage(properties);

    const missingRequired = errors.filter((e) => e.code === 'MISSING_REQUIRED').length;
    const missingOptional = warnings.filter((w) => w.code === 'MISSING_OPTIONAL').length;
    const invalidFormats = errors.filter((e) => e.code === 'INVALID_FORMAT').length;

    return {
      totalProperties: knownKeys.length,
      presentProperties: presentKeys.length,
      missingRequired,
      missingOptional,
      invalidFormats,
      coverage: (presentKeys.length / knownKeys.length) * 100,
      categoryCoverage,
    };
  }

  /**
   * Calculates coverage percentage by theme category.
   */
  protected calculateCategoryCoverage(
    properties: Record<string, string>
  ): Record<ThemeCategory, number> {
    const categories: ThemeCategory[] = [
      'window',
      'chat',
      'dialogs',
      'history',
      'media',
      'profile',
      'settings',
      'intro',
      'calls',
      'misc',
    ];

    const coverage: Record<ThemeCategory, number> = {} as Record<ThemeCategory, number>;

    for (const category of categories) {
      const categoryProps = THEME_PROPERTIES.filter((p) => p.category === category);
      const presentProps = categoryProps.filter((p) => properties[p.key]);
      coverage[category] =
        categoryProps.length > 0 ? (presentProps.length / categoryProps.length) * 100 : 100;
    }

    return coverage;
  }

  /**
   * Calculates a quality score from 0-100.
   */
  protected calculateScore(
    summary: ValidationSummary,
    errors: ValidationIssue[],
    warnings: ValidationIssue[]
  ): number {
    let score = 100;

    // Major deductions for errors
    score -= errors.length * 10;

    // Minor deductions for warnings (capped)
    score -= Math.min(warnings.length * 0.5, 20);

    // Bonus for coverage
    if (summary.coverage >= 95) {
      score += 5;
    } else if (summary.coverage < 70) {
      score -= 10;
    }

    // Ensure score is within bounds
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Validates that a color is in valid hex format.
   * Valid formats: RRGGBB or RRGGBBAA
   */
  protected isValidColorFormat(color: string): boolean {
    return /^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(color);
  }

  /**
   * Adds a custom validation rule.
   * @param rule - The validation rule to add
   */
  addRule(rule: ValidationRule): void {
    this.customRules.push(rule);
  }

  /**
   * Removes a custom validation rule by name.
   * @param name - The name of the rule to remove
   */
  removeRule(name: string): void {
    this.customRules = this.customRules.filter((r) => r.name !== name);
  }

  /**
   * Gets the property definition for a given key.
   */
  getPropertyDefinition(key: string): ThemeProperty | undefined {
    return THEME_PROPERTIES.find((p) => p.key === key);
  }

  /**
   * Checks if a property is required.
   */
  isRequired(key: string): boolean {
    return REQUIRED_PROPERTIES.includes(key);
  }

  /**
   * Gets all properties for a specific category.
   */
  getPropertiesByCategory(category: ThemeCategory): ThemeProperty[] {
    return THEME_PROPERTIES.filter((p) => p.category === category);
  }

  /**
   * Creates a simplified validation result compatible with TelegramThemeBuilder.
   * This method provides backward compatibility.
   */
  toSimpleResult(result: ValidationResult): {
    valid: boolean;
    errors: string[];
    warnings: string[];
    missingProperties: string[];
  } {
    return {
      valid: result.valid,
      errors: result.errors.map((e) => e.message),
      warnings: result.warnings.map((w) => w.message),
      missingProperties: result.errors
        .filter((e) => e.code === 'MISSING_REQUIRED')
        .map((e) => e.property),
    };
  }
}

export default ThemeValidator;
