import { describe, it, expect, beforeEach } from 'vitest';
import {
  ThemeValidator,
  type ValidationRule,
  type ValidationIssue,
} from './ThemeValidator';
import { DEFAULT_LIGHT_THEME, REQUIRED_PROPERTIES, THEME_PROPERTIES } from './templates/base-theme';

describe('ThemeValidator', () => {
  let validator: ThemeValidator;

  beforeEach(() => {
    validator = new ThemeValidator();
  });

  describe('constructor', () => {
    it('should create instance with default options', () => {
      expect(validator).toBeInstanceOf(ThemeValidator);
    });

    it('should accept custom options', () => {
      const customValidator = new ThemeValidator({
        checkContrast: true,
        checkSemantic: true,
        warnUnknown: false,
        minScore: 80,
      });
      expect(customValidator).toBeInstanceOf(ThemeValidator);
    });
  });

  describe('validate', () => {
    it('should return valid result for complete theme', () => {
      const result = validator.validate(DEFAULT_LIGHT_THEME);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return comprehensive result structure', () => {
      const result = validator.validate(DEFAULT_LIGHT_THEME);
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('issues');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('info');
      expect(result).toHaveProperty('summary');
    });

    it('should have issues array combining all issue types', () => {
      const result = validator.validate(DEFAULT_LIGHT_THEME);
      expect(Array.isArray(result.issues)).toBe(true);
      expect(result.issues.length).toBe(
        result.errors.length + result.warnings.length + result.info.length
      );
    });

    it('should return score between 0 and 100', () => {
      const result = validator.validate(DEFAULT_LIGHT_THEME);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });

  describe('validateRequiredProperties', () => {
    it('should detect missing required properties', () => {
      const incompleteTheme = { windowBg: 'ffffff' };
      const result = validator.validate(incompleteTheme);
      
      const missingRequired = result.errors.filter(
        (e) => e.code === 'MISSING_REQUIRED'
      );
      expect(missingRequired.length).toBeGreaterThan(0);
    });

    it('should pass when all required properties are present', () => {
      const result = validator.validate(DEFAULT_LIGHT_THEME);
      const missingRequired = result.errors.filter(
        (e) => e.code === 'MISSING_REQUIRED'
      );
      expect(missingRequired).toHaveLength(0);
    });

    it('should include property name in error', () => {
      const result = validator.validate({});
      const error = result.errors.find((e) => e.code === 'MISSING_REQUIRED');
      expect(error?.property).toBeDefined();
      expect(REQUIRED_PROPERTIES).toContain(error?.property);
    });

    it('should include suggestion in error', () => {
      const result = validator.validate({});
      const error = result.errors.find((e) => e.code === 'MISSING_REQUIRED');
      expect(error?.suggestion).toBeDefined();
    });
  });

  describe('validateColorFormats', () => {
    it('should accept valid 6-digit hex colors', () => {
      const theme = { ...DEFAULT_LIGHT_THEME, windowBg: 'ffffff' };
      const result = validator.validate(theme);
      const formatErrors = result.errors.filter(
        (e) => e.code === 'INVALID_FORMAT' && e.property === 'windowBg'
      );
      expect(formatErrors).toHaveLength(0);
    });

    it('should accept valid 8-digit hex colors with alpha', () => {
      const theme = { ...DEFAULT_LIGHT_THEME, windowBg: 'ffffff80' };
      const result = validator.validate(theme);
      const formatErrors = result.errors.filter(
        (e) => e.code === 'INVALID_FORMAT' && e.property === 'windowBg'
      );
      expect(formatErrors).toHaveLength(0);
    });

    it('should reject colors with # prefix', () => {
      const theme = { ...DEFAULT_LIGHT_THEME, windowBg: '#ffffff' };
      const result = validator.validate(theme);
      const formatErrors = result.errors.filter(
        (e) => e.code === 'INVALID_FORMAT' && e.property === 'windowBg'
      );
      expect(formatErrors).toHaveLength(1);
    });

    it('should reject invalid hex values', () => {
      const theme = { ...DEFAULT_LIGHT_THEME, windowBg: 'gggggg' };
      const result = validator.validate(theme);
      const formatErrors = result.errors.filter(
        (e) => e.code === 'INVALID_FORMAT' && e.property === 'windowBg'
      );
      expect(formatErrors).toHaveLength(1);
    });

    it('should reject colors with wrong length', () => {
      const theme = { ...DEFAULT_LIGHT_THEME, windowBg: 'fff' };
      const result = validator.validate(theme);
      const formatErrors = result.errors.filter(
        (e) => e.code === 'INVALID_FORMAT' && e.property === 'windowBg'
      );
      expect(formatErrors).toHaveLength(1);
    });
  });

  describe('validateOptionalProperties', () => {
    it('should warn about missing optional properties', () => {
      const minimalTheme: Record<string, string> = {};
      for (const key of REQUIRED_PROPERTIES) {
        minimalTheme[key] = 'ffffff';
      }
      
      const result = validator.validate(minimalTheme);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should mark missing optional properties as warnings not errors', () => {
      const minimalTheme: Record<string, string> = {};
      for (const key of REQUIRED_PROPERTIES) {
        minimalTheme[key] = 'ffffff';
      }
      
      const result = validator.validate(minimalTheme);
      const optionalIssues = result.warnings.filter(
        (w) => w.code === 'MISSING_OPTIONAL'
      );
      expect(optionalIssues.every((i) => i.severity === 'warning')).toBe(true);
    });
  });

  describe('validateUnknownProperties', () => {
    it('should warn about unknown properties when enabled', () => {
      const theme = { ...DEFAULT_LIGHT_THEME, unknownProperty: 'ffffff' };
      const result = validator.validate(theme);
      const unknownInfo = result.info.filter((i) => i.code === 'UNKNOWN_PROPERTY');
      expect(unknownInfo.length).toBeGreaterThan(0);
    });

    it('should not warn about unknown properties when disabled', () => {
      const customValidator = new ThemeValidator({ warnUnknown: false });
      const theme = { ...DEFAULT_LIGHT_THEME, unknownProperty: 'ffffff' };
      const result = customValidator.validate(theme);
      const unknownInfo = result.info.filter((i) => i.code === 'UNKNOWN_PROPERTY');
      expect(unknownInfo).toHaveLength(0);
    });

    it('should classify unknown property issues as info', () => {
      const theme = { ...DEFAULT_LIGHT_THEME, customProp: 'ffffff' };
      const result = validator.validate(theme);
      const unknownInfo = result.info.find(
        (i) => i.code === 'UNKNOWN_PROPERTY' && i.property === 'customProp'
      );
      expect(unknownInfo?.severity).toBe('info');
    });
  });

  describe('calculateScore', () => {
    it('should give high score for complete valid theme', () => {
      const result = validator.validate(DEFAULT_LIGHT_THEME);
      expect(result.score).toBeGreaterThanOrEqual(80);
    });

    it('should reduce score for errors', () => {
      const incompleteTheme = { windowBg: 'ffffff' };
      const result = validator.validate(incompleteTheme);
      expect(result.score).toBeLessThan(80);
    });

    it('should reduce score for invalid formats', () => {
      const theme = { ...DEFAULT_LIGHT_THEME, windowBg: 'invalid' };
      const result = validator.validate(theme);
      expect(result.score).toBeLessThan(100);
    });
  });

  describe('summary', () => {
    it('should include total properties count', () => {
      const result = validator.validate(DEFAULT_LIGHT_THEME);
      expect(result.summary.totalProperties).toBe(THEME_PROPERTIES.length);
    });

    it('should count present properties', () => {
      const result = validator.validate(DEFAULT_LIGHT_THEME);
      expect(result.summary.presentProperties).toBeGreaterThan(0);
    });

    it('should calculate coverage percentage', () => {
      const result = validator.validate(DEFAULT_LIGHT_THEME);
      expect(result.summary.coverage).toBeGreaterThan(0);
      expect(result.summary.coverage).toBeLessThanOrEqual(100);
    });

    it('should include category coverage', () => {
      const result = validator.validate(DEFAULT_LIGHT_THEME);
      expect(result.summary.categoryCoverage).toHaveProperty('window');
      expect(result.summary.categoryCoverage).toHaveProperty('chat');
      expect(result.summary.categoryCoverage).toHaveProperty('dialogs');
    });
  });

  describe('custom rules', () => {
    it('should apply custom validation rules', () => {
      const customRule: ValidationRule = {
        name: 'testRule',
        description: 'Test custom rule',
        validate: () => [
          {
            severity: 'warning',
            property: 'testProp',
            message: 'Custom warning',
            code: 'SEMANTIC_MISMATCH',
          },
        ],
      };

      const customValidator = new ThemeValidator({
        customRules: [customRule],
      });

      const result = customValidator.validate(DEFAULT_LIGHT_THEME);
      const customWarning = result.warnings.find(
        (w) => w.message === 'Custom warning'
      );
      expect(customWarning).toBeDefined();
    });

    it('should add custom rules via addRule', () => {
      const customRule: ValidationRule = {
        name: 'dynamicRule',
        description: 'Dynamically added rule',
        validate: () => [
          {
            severity: 'error',
            property: 'dynamic',
            message: 'Dynamic error',
            code: 'SEMANTIC_MISMATCH',
          },
        ],
      };

      validator.addRule(customRule);
      const result = validator.validate(DEFAULT_LIGHT_THEME);
      const dynamicError = result.errors.find(
        (e) => e.message === 'Dynamic error'
      );
      expect(dynamicError).toBeDefined();
    });

    it('should remove custom rules via removeRule', () => {
      const customRule: ValidationRule = {
        name: 'removableRule',
        description: 'Rule to be removed',
        validate: () => [
          {
            severity: 'error',
            property: 'removable',
            message: 'Should be removed',
            code: 'SEMANTIC_MISMATCH',
          },
        ],
      };

      validator.addRule(customRule);
      validator.removeRule('removableRule');
      const result = validator.validate(DEFAULT_LIGHT_THEME);
      const removedError = result.errors.find(
        (e) => e.message === 'Should be removed'
      );
      expect(removedError).toBeUndefined();
    });

    it('should categorize custom rule issues by severity', () => {
      const customRule: ValidationRule = {
        name: 'multiSeverityRule',
        description: 'Rule with multiple severities',
        validate: (): ValidationIssue[] => [
          {
            severity: 'error',
            property: 'err',
            message: 'Error issue',
            code: 'SEMANTIC_MISMATCH',
          },
          {
            severity: 'warning',
            property: 'warn',
            message: 'Warning issue',
            code: 'SEMANTIC_MISMATCH',
          },
          {
            severity: 'info',
            property: 'info',
            message: 'Info issue',
            code: 'SEMANTIC_MISMATCH',
          },
        ],
      };

      const customValidator = new ThemeValidator({
        customRules: [customRule],
      });

      const result = customValidator.validate(DEFAULT_LIGHT_THEME);
      expect(result.errors.find((e) => e.message === 'Error issue')).toBeDefined();
      expect(result.warnings.find((w) => w.message === 'Warning issue')).toBeDefined();
      expect(result.info.find((i) => i.message === 'Info issue')).toBeDefined();
    });
  });

  describe('helper methods', () => {
    it('should get property definition', () => {
      const prop = validator.getPropertyDefinition('windowBg');
      expect(prop).toBeDefined();
      expect(prop?.key).toBe('windowBg');
      expect(prop?.description).toBeDefined();
    });

    it('should return undefined for unknown property', () => {
      const prop = validator.getPropertyDefinition('unknownProperty');
      expect(prop).toBeUndefined();
    });

    it('should check if property is required', () => {
      expect(validator.isRequired('windowBg')).toBe(true);
      expect(validator.isRequired('someOptionalProp')).toBe(false);
    });

    it('should get properties by category', () => {
      const windowProps = validator.getPropertiesByCategory('window');
      expect(windowProps.length).toBeGreaterThan(0);
      expect(windowProps.every((p) => p.category === 'window')).toBe(true);
    });
  });

  describe('toSimpleResult', () => {
    it('should convert to simple validation result', () => {
      const result = validator.validate(DEFAULT_LIGHT_THEME);
      const simple = validator.toSimpleResult(result);

      expect(simple).toHaveProperty('valid');
      expect(simple).toHaveProperty('errors');
      expect(simple).toHaveProperty('warnings');
      expect(simple).toHaveProperty('missingProperties');
      expect(Array.isArray(simple.errors)).toBe(true);
      expect(Array.isArray(simple.warnings)).toBe(true);
      expect(Array.isArray(simple.missingProperties)).toBe(true);
    });

    it('should extract error messages as strings', () => {
      const result = validator.validate({});
      const simple = validator.toSimpleResult(result);

      expect(simple.errors.length).toBeGreaterThan(0);
      expect(typeof simple.errors[0]).toBe('string');
    });

    it('should extract missing required property names', () => {
      const result = validator.validate({});
      const simple = validator.toSimpleResult(result);

      expect(simple.missingProperties.length).toBeGreaterThan(0);
      expect(REQUIRED_PROPERTIES).toContain(simple.missingProperties[0]);
    });
  });

  describe('minScore option', () => {
    it('should mark theme invalid if score below minScore', () => {
      const strictValidator = new ThemeValidator({ minScore: 100 });
      const result = strictValidator.validate({ windowBg: 'ffffff' });
      expect(result.valid).toBe(false);
    });

    it('should mark theme valid if score meets minScore', () => {
      const lenientValidator = new ThemeValidator({ minScore: 0 });
      const minimalTheme: Record<string, string> = {};
      for (const key of REQUIRED_PROPERTIES) {
        minimalTheme[key] = 'ffffff';
      }
      const result = lenientValidator.validate(minimalTheme);
      // Should be valid if no errors and score >= 0
      expect(result.errors).toHaveLength(0);
      expect(result.valid).toBe(true);
    });
  });

  describe('ValidationIssue structure', () => {
    it('should have correct issue structure', () => {
      const result = validator.validate({});
      const issue = result.errors[0];

      expect(issue).toHaveProperty('severity');
      expect(issue).toHaveProperty('property');
      expect(issue).toHaveProperty('message');
      expect(issue).toHaveProperty('code');
      expect(['error', 'warning', 'info']).toContain(issue.severity);
    });
  });
});
