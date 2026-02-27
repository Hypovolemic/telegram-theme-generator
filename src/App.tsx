import { ThemeGeneratorProvider, useThemeGenerator } from './context';
import {
  ImageUploader,
  DownloadButton,
  ThemePreview,
  ProcessingSteps,
  ErrorBoundary,
  ErrorState,
  ToastProvider,
  useToast,
  Spinner,
  PrivacyPolicy,
  type ProcessingStep,
} from './components';
import { useMemo, useCallback, useState, createContext, useContext } from 'react';

// Privacy Modal Context
const PrivacyModalContext = createContext<{ openPrivacyModal: () => void } | null>(null);

function usePrivacyModal() {
  const context = useContext(PrivacyModalContext);
  if (!context) {
    throw new Error('usePrivacyModal must be used within PrivacyModalContext');
  }
  return context;
}


/**
 * Color Palette Display Component
 */
function ColorPalette() {
  const { extractedColors } = useThemeGenerator();
  
  if (extractedColors.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
      {extractedColors.slice(0, 6).map((color, index) => (
        <div
          key={index}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shadow-md border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
          style={{ backgroundColor: color.hex }}
          title={color.hex}
        />
      ))}
    </div>
  );
}

/**
 * Theme Mode Toggle Component
 */
function ThemeModeToggle() {
  const { themeMode, setThemeMode, isProcessing } = useThemeGenerator();
  
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs sm:text-sm ${themeMode === 'light' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
        ☀️
      </span>
      <button
        onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
        disabled={isProcessing}
        className={`relative w-11 h-6 sm:w-14 sm:h-7 rounded-full transition-colors ${
          themeMode === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
      >
        <span
          className={`absolute top-0.5 sm:top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            themeMode === 'dark' ? 'translate-x-5 sm:translate-x-8' : 'translate-x-0.5 sm:translate-x-1'
          }`}
        />
      </button>
      <span className={`text-xs sm:text-sm ${themeMode === 'dark' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
        🌙
      </span>
    </div>
  );
}

/**
 * Processing Status Component
 */
function ProcessingStatus() {
  const { stage, isProcessing } = useThemeGenerator();
  
  const steps: ProcessingStep[] = useMemo(() => [
    {
      id: 'upload',
      label: 'Upload Image',
      description: 'Select a wallpaper or image',
      status: stage === 'upload' ? 'active' : 'completed',
    },
    {
      id: 'extract',
      label: 'Extract Colors',
      description: 'Analyzing dominant colors',
      status: stage === 'extracting' ? 'active' : 
              stage === 'upload' ? 'pending' : 'completed',
    },
    {
      id: 'generate',
      label: 'Generate Theme',
      description: 'Creating Telegram theme',
      status: stage === 'generating' ? 'active' :
              ['upload', 'extracting'].includes(stage) ? 'pending' : 'completed',
    },
    {
      id: 'preview',
      label: 'Preview & Download',
      description: 'Review and export theme',
      status: stage === 'preview' ? 'active' :
              stage === 'error' ? 'error' : 'pending',
    },
  ], [stage]);
  
  if (stage === 'upload') return null;
  
  return (
    <div className="mb-6">
      <ProcessingSteps
        steps={steps}
        orientation="horizontal"
        showProgress={isProcessing}
      />
    </div>
  );
}

/**
 * Privacy Notice Component
 * Displays privacy information near the upload area with tooltip explanation
 */
function PrivacyNotice() {
  const [showTooltip, setShowTooltip] = useState(false);
  const { openPrivacyModal } = usePrivacyModal();
  
  return (
    <div className="relative flex flex-col items-center gap-2">
      <div 
        className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        tabIndex={0}
        role="button"
        aria-describedby="privacy-tooltip"
      >
        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span className="text-sm text-green-700 font-medium">
          100% Private – Images never leave your device
        </span>
        <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div 
          id="privacy-tooltip"
          role="tooltip"
          className="absolute top-full mt-2 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10"
        >
          <p className="font-medium mb-1">Client-Side Processing</p>
          <p className="text-gray-300 leading-relaxed">
            All image analysis and theme generation happens directly in your browser using JavaScript. 
            Your images are never uploaded to any server – they stay completely on your device.
          </p>
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45" />
        </div>
      )}
      
      <button 
        onClick={openPrivacyModal}
        className="text-xs text-green-600 hover:text-green-700 hover:underline transition-colors"
      >
        Learn more about our privacy commitment →
      </button>
    </div>
  );
}

/**
 * Main Content Component
 */
function MainContent() {
  const {
    stage,
    imagePreviewUrl,
    generatedTheme,
    previewColors,
    uploadImage,
    reset,
    error,
    isProcessing,
  } = useThemeGenerator();
  
  const toast = useToast();
  
  const handleImageUpload = useCallback((file: File, previewUrl: string) => {
    uploadImage(file, previewUrl);
    toast.info('Extracting colors from your image...', { title: 'Processing Image', duration: 3000 });
  }, [uploadImage, toast]);
  
  const handleDownloadSuccess = useCallback(() => {
    toast.success('Your theme file has been downloaded!', { title: 'Download Complete', duration: 4000 });
  }, [toast]);
  
  const handleDownloadError = useCallback((err: Error) => {
    toast.error(err.message, { title: 'Download Failed' });
  }, [toast]);
  
  const handleError = useCallback((_errorType: string, message: string) => {
    toast.error(message, { title: 'Upload Error' });
  }, [toast]);
  
  // Error state
  if (stage === 'error') {
    return (
      <ErrorState
        title="Processing Failed"
        description={error || 'An error occurred while processing your image.'}
        action={{ label: 'Try Again', onClick: reset }}
      />
    );
  }
  
  // Upload stage
  if (stage === 'upload') {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            Upload Your Image
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Drop any wallpaper, photo, or artwork to create a matching Telegram theme
          </p>
        </div>
        
        <ImageUploader
          onImageUpload={handleImageUpload}
          onError={handleError}
        />
        
        {/* Supported formats */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
          <span>Supports:</span>
          <span className="px-2 py-0.5 bg-gray-100 rounded">JPG</span>
          <span className="px-2 py-0.5 bg-gray-100 rounded">PNG</span>
          <span className="px-2 py-0.5 bg-gray-100 rounded">WebP</span>
          <span className="text-gray-300">•</span>
          <span>Max 10MB</span>
        </div>
        
        {/* Privacy Notice */}
        <PrivacyNotice />
      </div>
    );
  }
  
  // Processing stages
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12">
        <Spinner size="large" className="mb-4" />
        <p className="text-gray-600 text-center">
          {stage === 'extracting' ? 'Extracting colors from your image...' : 'Generating your theme...'}
        </p>
        {imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt="Uploaded preview"
            className="mt-6 w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-xl shadow-lg"
          />
        )}
      </div>
    );
  }
  
  // Preview stage
  if (stage === 'preview' && previewColors && generatedTheme) {
    return (
      <div className="space-y-6">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
            Your Theme is Ready!
          </h2>
          <p className="text-sm text-gray-500">
            Preview below and download when you're happy
          </p>
        </div>
        
        {/* Image and Colors */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center p-4 bg-gray-50 rounded-xl">
          {imagePreviewUrl && (
            <div className="flex-shrink-0">
              <img
                src={imagePreviewUrl}
                alt="Source image"
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
          <div className="text-center sm:text-left">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Extracted Colors
            </h3>
            <ColorPalette />
          </div>
        </div>
        
        {/* Theme Mode Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <span className="text-xs text-gray-500">Theme Mode:</span>
            <ThemeModeToggle />
          </div>
        </div>
        
        {/* Theme Preview */}
        <div className="max-w-2xl mx-auto">
          <ThemePreview
            theme={previewColors}
            showSidebar={true}
            responsive={true}
          />
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
          <DownloadButton
            content={generatedTheme.content}
            filename={generatedTheme.name.replace(/\s+/g, '_')}
            onSuccess={handleDownloadSuccess}
            onError={handleDownloadError}
            variant="primary"
            size="large"
          >
            Download Theme (.attheme)
          </DownloadButton>
          
          <button
            onClick={reset}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
          >
            Create Another Theme
          </button>
        </div>
        
        {/* Validation warnings */}
        {generatedTheme.validation.warnings.length > 0 && (
          <div className="max-w-lg mx-auto p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">
              Theme Warnings
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {generatedTheme.validation.warnings.slice(0, 3).map((warning, i) => (
                <li key={i}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  
  return null;
}

/**
 * Feature Card Component
 */
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm">
      <span className="text-3xl mb-2">{icon}</span>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

/**
 * Hero Section Component - shown on upload stage
 */
function HeroSection() {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <FeatureCard
          icon="🖼️"
          title="Upload Any Image"
          description="Drag & drop your favorite wallpaper or photo"
        />
        <FeatureCard
          icon="🎨"
          title="Smart Colors"
          description="AI extracts the perfect color palette"
        />
        <FeatureCard
          icon="📱"
          title="Instant Preview"
          description="See your theme before downloading"
        />
      </div>
    </div>
  );
}

/**
 * App Header Component
 */
function AppHeader() {
  const { stage, reset } = useThemeGenerator();
  
  return (
    <header className="text-center mb-6 md:mb-8">
      {/* Logo and Title */}
      <div 
        className={`inline-flex items-center gap-3 ${stage !== 'upload' ? 'cursor-pointer' : ''}`}
        onClick={stage !== 'upload' ? reset : undefined}
      >
        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-2xl md:text-3xl">🎨</span>
        </div>
        <div className="text-left">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Telegram Theme Generator
          </h1>
          <p className="text-xs md:text-sm text-gray-500 hidden sm:block">
            Create beautiful themes from your images
          </p>
        </div>
      </div>
      
      {/* Subtitle for mobile */}
      <p className="text-sm text-gray-600 mt-2 sm:hidden">
        Create beautiful themes from your images
      </p>
    </header>
  );
}

/**
 * App Footer Component
 */
function AppFooter() {
  return (
    <footer className="mt-8 md:mt-12 pt-6 border-t border-gray-200/50">
      <div className="max-w-2xl mx-auto">
        {/* Privacy Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            100% Private - All processing happens locally
          </div>
        </div>
        
        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-gray-500">
          <a 
            href="https://github.com/Hypovolemic/telegram-theme-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 transition-colors inline-flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <span className="text-gray-300 hidden sm:inline">•</span>
          <a 
            href="https://telegram.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 transition-colors"
          >
            Telegram
          </a>
          <span className="text-gray-300 hidden sm:inline">•</span>
          <span className="text-gray-400">
            Made with ❤️ for Telegram users
          </span>
        </div>
        
        {/* Copyright */}
        <p className="text-center text-xs text-gray-400 mt-4">
          © {new Date().getFullYear()} Telegram Theme Generator. Open source under MIT license.
        </p>
      </div>
    </footer>
  );
}

/**
 * Main App wrapper with providers
 */
function AppContent() {
  const { stage } = useThemeGenerator();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  const openPrivacyModal = useCallback(() => setShowPrivacyModal(true), []);
  const closePrivacyModal = useCallback(() => setShowPrivacyModal(false), []);
  
  return (
    <PrivacyModalContext.Provider value={{ openPrivacyModal }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <div className="relative py-6 px-4 sm:py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <AppHeader />
            
            {/* Hero section - only on upload stage */}
            {stage === 'upload' && <HeroSection />}
            
            {/* Processing status - shown during processing */}
            <ProcessingStatus />
            
            {/* Main content card */}
            <main className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
              <MainContent />
            </main>
            
            <AppFooter />
          </div>
        </div>
        
        {/* Privacy Policy Modal */}
        {showPrivacyModal && <PrivacyPolicy onClose={closePrivacyModal} />}
      </div>
    </PrivacyModalContext.Provider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeGeneratorProvider>
        <ToastProvider position="bottom-right">
          <AppContent />
        </ToastProvider>
      </ThemeGeneratorProvider>
    </ErrorBoundary>
  );
}

export default App;