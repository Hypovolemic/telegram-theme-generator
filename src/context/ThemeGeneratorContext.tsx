import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { ColorExtractor, type ExtractedColor } from '../core/color-extraction';
import { TelegramThemeBuilder, type GeneratedTheme, type ThemeColors, type ThemeMode } from '../core/theme-generation';
import { ContrastOptimizer } from '../core/contrast';
import type { PreviewThemeColors } from '../components/preview/types';

/**
 * Workflow stages for theme generation
 */
export type WorkflowStage = 'upload' | 'extracting' | 'generating' | 'preview' | 'error';

/**
 * Theme generator state
 */
export interface ThemeGeneratorState {
  stage: WorkflowStage;
  imageFile: File | null;
  imagePreviewUrl: string | null;
  extractedColors: ExtractedColor[];
  generatedTheme: GeneratedTheme | null;
  previewColors: PreviewThemeColors | null;
  themeMode: ThemeMode;
  error: string | null;
  isProcessing: boolean;
}

/**
 * Theme generator context value
 */
export interface ThemeGeneratorContextValue extends ThemeGeneratorState {
  /** Upload an image and start processing */
  uploadImage: (file: File, previewUrl: string) => Promise<void>;
  /** Clear current state and start over */
  reset: () => void;
  /** Set theme mode (light/dark) */
  setThemeMode: (mode: ThemeMode) => void;
  /** Regenerate theme with current settings */
  regenerateTheme: () => Promise<void>;
}

const initialState: ThemeGeneratorState = {
  stage: 'upload',
  imageFile: null,
  imagePreviewUrl: null,
  extractedColors: [],
  generatedTheme: null,
  previewColors: null,
  themeMode: 'light',
  error: null,
  isProcessing: false,
};

const ThemeGeneratorContext = createContext<ThemeGeneratorContextValue | null>(null);

/**
 * Convert extracted colors to ThemeColors format
 */
function mapExtractedColorsToThemeColors(
  colors: ExtractedColor[],
  mode: ThemeMode
): ThemeColors {
  // Sort by vibrancy to get the most vibrant colors first
  const sorted = [...colors].sort((a, b) => b.vibrancy - a.vibrancy);
  
  // Get base colors
  const primary = sorted[0]?.hex || '#40a7e3';
  const accent = sorted[1]?.hex || '#5dc452';
  
  // Calculate light/dark variants
  const isLightMode = mode === 'light';
  
  // Background based on mode
  const background = isLightMode ? '#ffffff' : '#17212b';
  const backgroundSecondary = isLightMode ? '#f5f5f5' : '#232e3c';
  const backgroundTertiary = isLightMode ? '#eeeeee' : '#2b3945';
  
  // Text colors based on mode
  const textPrimary = isLightMode ? '#000000' : '#ffffff';
  const textSecondary = isLightMode ? '#707070' : '#8b9aab';
  const textMuted = isLightMode ? '#a0a0a0' : '#6c7883';
  const textOnPrimary = '#ffffff';
  
  // Adjust primary variants
  const primaryLight = adjustBrightness(primary, isLightMode ? 20 : 10);
  const primaryDark = adjustBrightness(primary, isLightMode ? -20 : -10);
  const accentLight = adjustBrightness(accent, 15);
  
  return {
    primary,
    primaryLight,
    primaryDark,
    accent,
    accentLight,
    background,
    backgroundSecondary,
    backgroundTertiary,
    textPrimary,
    textSecondary,
    textMuted,
    textOnPrimary,
    online: '#4fae4e',
    offline: '#8b9aab',
    // Map additional extracted colors
    color1: sorted[0]?.hex || primary,
    color2: sorted[1]?.hex || accent,
    color3: sorted[2]?.hex || primaryLight,
    color4: sorted[3]?.hex || accentLight,
    color5: sorted[4]?.hex || backgroundSecondary,
    color6: sorted[5]?.hex || backgroundTertiary,
  };
}

/**
 * Adjust color brightness
 */
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

/**
 * Convert generated theme properties to PreviewThemeColors
 */
function mapThemeToPreviewColors(
  properties: Record<string, string>
): PreviewThemeColors {
  const toHex = (color: string) => (color.startsWith('#') ? color : `#${color}`);
  
  return {
    windowBg: toHex(properties.windowBg || 'ffffff'),
    windowFg: toHex(properties.windowFg || '000000'),
    windowBgOver: toHex(properties.windowBgOver || 'f1f1f1'),
    windowFgOver: toHex(properties.windowFgOver || '000000'),
    windowBgActive: toHex(properties.windowBgActive || '40a7e3'),
    windowFgActive: toHex(properties.windowFgActive || 'ffffff'),
    
    historyPeer1NameFg: toHex(properties.historyPeer1NameFg || 'c03d33'),
    historyPeer2NameFg: toHex(properties.historyPeer2NameFg || '4fad2d'),
    historyPeer3NameFg: toHex(properties.historyPeer3NameFg || 'd09306'),
    historyPeer4NameFg: toHex(properties.historyPeer4NameFg || '168acd'),
    
    msgInBg: toHex(properties.msgInBg || 'ffffff'),
    msgInBgSelected: toHex(properties.msgInBgSelected || 'c2dcf2'),
    msgOutBg: toHex(properties.msgOutBg || 'efffde'),
    msgOutBgSelected: toHex(properties.msgOutBgSelected || 'b7dbdb'),
    msgInShadow: toHex(properties.msgInShadow || '00000000'),
    msgOutShadow: toHex(properties.msgOutShadow || '00000000'),
    
    historyTextInFg: toHex(properties.historyTextInFg || '000000'),
    historyTextOutFg: toHex(properties.historyTextOutFg || '000000'),
    
    msgInDateFg: toHex(properties.msgInDateFg || 'a0acb6'),
    msgOutDateFg: toHex(properties.msgOutDateFg || '6cc264'),
    historyOutIconFg: toHex(properties.historyOutIconFg || '5dc452'),
    historyOutIconFgSelected: toHex(properties.historyOutIconFgSelected || '5dc452'),
    
    msgInReplyBarColor: toHex(properties.msgInReplyBarColor || '40a7e3'),
    msgOutReplyBarColor: toHex(properties.msgOutReplyBarColor || '5dc452'),
    msgInReplyBarSelColor: toHex(properties.msgInReplyBarSelColor || '40a7e3'),
    msgOutReplyBarSelColor: toHex(properties.msgOutReplyBarSelColor || '5dc452'),
    
    msgServiceBg: toHex(properties.msgServiceBg || '7fc8e580'),
    msgServiceFg: toHex(properties.msgServiceFg || 'ffffff'),
    
    dialogsBg: toHex(properties.dialogsBg || 'ffffff'),
    dialogsNameFg: toHex(properties.dialogsNameFg || '212121'),
    dialogsTextFg: toHex(properties.dialogsTextFg || '888888'),
    dialogsDateFg: toHex(properties.dialogsDateFg || 'a8a8a8'),
    dialogsBgActive: toHex(properties.dialogsBgActive || '419fd9'),
    dialogsNameFgActive: toHex(properties.dialogsNameFgActive || 'ffffff'),
    dialogsTextFgActive: toHex(properties.dialogsTextFgActive || 'd4e7f5'),
    dialogsDateFgActive: toHex(properties.dialogsDateFgActive || 'd4e7f5'),
    dialogsUnreadBg: toHex(properties.dialogsUnreadBg || '419fd9'),
    dialogsUnreadBgMuted: toHex(properties.dialogsUnreadBgMuted || 'bbbbbb'),
    dialogsUnreadFg: toHex(properties.dialogsUnreadFg || 'ffffff'),
    
    activeButtonBg: toHex(properties.activeButtonBg || '40a7e3'),
    activeButtonFg: toHex(properties.activeButtonFg || 'ffffff'),
    activeButtonBgOver: toHex(properties.activeButtonBgOver || '2095e4'),
    activeButtonBgRipple: toHex(properties.activeButtonBgRipple || '1c8dd5'),
    
    historyComposeAreaBg: toHex(properties.historyComposeAreaBg || 'ffffff'),
    historyComposeAreaFg: toHex(properties.historyComposeAreaFg || '000000'),
    historyComposeIconFg: toHex(properties.historyComposeIconFg || '999999'),
    historyComposeIconFgOver: toHex(properties.historyComposeIconFgOver || '40a7e3'),
    
    scrollBg: toHex(properties.scrollBg || '00000000'),
    scrollBgOver: toHex(properties.scrollBgOver || '00000000'),
    scrollBarBg: toHex(properties.scrollBarBg || 'c8c8c880'),
    scrollBarBgOver: toHex(properties.scrollBarBgOver || '9e9e9e80'),
    
    menuBg: toHex(properties.menuBg || 'ffffff'),
    menuBgOver: toHex(properties.menuBgOver || 'f1f1f1'),
    menuIconFg: toHex(properties.menuIconFg || '40a7e3'),
    menuFgDisabled: toHex(properties.menuFgDisabled || 'a8a8a8'),
    menuSeparatorFg: toHex(properties.menuSeparatorFg || 'e8e8e8'),
    
    tooltipBg: toHex(properties.tooltipBg || 'e5f0f6'),
    tooltipFg: toHex(properties.tooltipFg || '547085'),
    tooltipBorderFg: toHex(properties.tooltipBorderFg || 'c9d9e3'),
    
    titleBg: toHex(properties.titleBg || 'ffffff'),
    titleFg: toHex(properties.titleFg || 'acacac'),
    titleBgActive: toHex(properties.titleBgActive || 'ffffff'),
    titleFgActive: toHex(properties.titleFgActive || '3e3c3e'),
    titleButtonBg: toHex(properties.titleButtonBg || 'ffffff00'),
    titleButtonFg: toHex(properties.titleButtonFg || 'acacac'),
    titleButtonBgOver: toHex(properties.titleButtonBgOver || 'e5e5e5'),
    titleButtonFgOver: toHex(properties.titleButtonFgOver || '9a9a9a'),
    titleButtonBgActive: toHex(properties.titleButtonBgActive || 'e5e5e5'),
    titleButtonFgActive: toHex(properties.titleButtonFgActive || '9a9a9a'),
    titleButtonCloseBg: toHex(properties.titleButtonCloseBg || 'e5e5e5'),
    titleButtonCloseFg: toHex(properties.titleButtonCloseFg || 'd92626'),
    titleButtonCloseBgOver: toHex(properties.titleButtonCloseBgOver || 'e81123'),
    titleButtonCloseFgOver: toHex(properties.titleButtonCloseFgOver || 'ffffff'),
  };
}

/**
 * Provider props
 */
export interface ThemeGeneratorProviderProps {
  children: ReactNode;
}

/**
 * Theme Generator Provider
 */
export function ThemeGeneratorProvider({ children }: ThemeGeneratorProviderProps) {
  const [state, setState] = useState<ThemeGeneratorState>(initialState);
  
  const colorExtractor = useMemo(() => new ColorExtractor({ colorCount: 8 }), []);
  const contrastOptimizer = useMemo(() => new ContrastOptimizer(), []);
  
  /**
   * Process image and generate theme
   */
  const processImage = useCallback(async (
    file: File,
    previewUrl: string,
    mode: ThemeMode
  ) => {
    setState(prev => ({
      ...prev,
      stage: 'extracting',
      isProcessing: true,
      error: null,
    }));
    
    try {
      // Extract colors
      const extractedColors = await colorExtractor.getDominantColors(previewUrl);
      
      setState(prev => ({
        ...prev,
        stage: 'generating',
        extractedColors,
      }));
      
      // Map to theme colors
      const themeColors = mapExtractedColorsToThemeColors(extractedColors, mode);
      
      // Build theme
      const builder = new TelegramThemeBuilder({
        mode,
        name: `Theme from ${file.name}`,
      });
      
      const generatedTheme = builder.buildTheme(themeColors);
      
      // Optimize contrast
      const optimizedProperties = { ...generatedTheme.properties };
      
      // Apply WCAG contrast optimization for key text/background pairs
      const textBgPairs = [
        ['windowFg', 'windowBg'],
        ['historyTextInFg', 'msgInBg'],
        ['historyTextOutFg', 'msgOutBg'],
        ['dialogsNameFg', 'dialogsBg'],
      ];
      
      for (const [fgKey, bgKey] of textBgPairs) {
        const fg = optimizedProperties[fgKey];
        const bg = optimizedProperties[bgKey];
        if (fg && bg) {
          const result = contrastOptimizer.ensureContrast(
            `#${fg.replace('#', '')}`,
            `#${bg.replace('#', '')}`
          );
          if (result.wasAdjusted) {
            optimizedProperties[fgKey] = result.adjustedForeground.replace('#', '');
          }
        }
      }
      
      // Update generated theme with optimized properties
      const optimizedTheme: GeneratedTheme = {
        ...generatedTheme,
        properties: optimizedProperties,
      };
      
      // Convert to preview colors
      const previewColors = mapThemeToPreviewColors(optimizedProperties);
      
      setState(prev => ({
        ...prev,
        stage: 'preview',
        generatedTheme: optimizedTheme,
        previewColors,
        isProcessing: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        stage: 'error',
        error: err instanceof Error ? err.message : 'Failed to process image',
        isProcessing: false,
      }));
    }
  }, [colorExtractor, contrastOptimizer]);
  
  /**
   * Upload image handler
   */
  const uploadImage = useCallback(async (file: File, previewUrl: string) => {
    setState(prev => ({
      ...prev,
      imageFile: file,
      imagePreviewUrl: previewUrl,
    }));
    
    await processImage(file, previewUrl, state.themeMode);
  }, [processImage, state.themeMode]);
  
  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState(initialState);
  }, []);
  
  /**
   * Set theme mode
   */
  const setThemeMode = useCallback((mode: ThemeMode) => {
    setState(prev => ({ ...prev, themeMode: mode }));
    
    // Regenerate if we have an image
    if (state.imageFile && state.imagePreviewUrl) {
      processImage(state.imageFile, state.imagePreviewUrl, mode);
    }
  }, [processImage, state.imageFile, state.imagePreviewUrl]);
  
  /**
   * Regenerate theme
   */
  const regenerateTheme = useCallback(async () => {
    if (state.imageFile && state.imagePreviewUrl) {
      await processImage(state.imageFile, state.imagePreviewUrl, state.themeMode);
    }
  }, [processImage, state.imageFile, state.imagePreviewUrl, state.themeMode]);
  
  const value: ThemeGeneratorContextValue = {
    ...state,
    uploadImage,
    reset,
    setThemeMode,
    regenerateTheme,
  };
  
  return (
    <ThemeGeneratorContext.Provider value={value}>
      {children}
    </ThemeGeneratorContext.Provider>
  );
}

/**
 * Hook to use theme generator context
 */
export function useThemeGenerator(): ThemeGeneratorContextValue {
  const context = useContext(ThemeGeneratorContext);
  if (!context) {
    throw new Error('useThemeGenerator must be used within a ThemeGeneratorProvider');
  }
  return context;
}
