export {
  TelegramThemeBuilder,
  type ThemeMode,
  type ThemeBuilderOptions,
  type ValidationResult,
  type GeneratedTheme,
} from './TelegramThemeBuilder';

export {
  ThemeValidator,
  type ValidationResult as AdvancedValidationResult,
  type ValidationIssue,
  type ValidationRule,
  type ValidatorOptions,
  type ValidationSummary,
  type ValidationSeverity,
  type ValidationErrorCode,
} from './ThemeValidator';

export {
  type ThemeColors,
  type ThemeProperty,
  type ThemeCategory,
  THEME_PROPERTIES,
  REQUIRED_PROPERTIES,
  DEFAULT_LIGHT_THEME,
  DEFAULT_DARK_THEME,
} from './templates/base-theme';
