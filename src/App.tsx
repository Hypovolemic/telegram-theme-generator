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
  type ProcessingStep,
} from './components';
import { useMemo, useCallback } from 'react';


/**
 * Color Palette Display Component
 */
function ColorPalette() {
  const { extractedColors } = useThemeGenerator();
  
  if (extractedColors.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {extractedColors.slice(0, 6).map((color, index) => (
        <div
          key={index}
          className="w-10 h-10 rounded-lg shadow-md border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
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
    <div className="flex items-center justify-center gap-3">
      <span className={`text-sm ${themeMode === 'light' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
        Light
      </span>
      <button
        onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
        disabled={isProcessing}
        className={`relative w-14 h-7 rounded-full transition-colors ${
          themeMode === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
      >
        <span
          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            themeMode === 'dark' ? 'translate-x-8' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-sm ${themeMode === 'dark' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
        Dark
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
      <div className="max-w-lg mx-auto">
        <ImageUploader
          onImageUpload={handleImageUpload}
          onError={handleError}
        />
        <p className="text-center text-gray-500 text-sm mt-4">
          Your image is processed locally. Nothing is uploaded to any server.
        </p>
      </div>
    );
  }
  
  // Processing stages
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner size="large" className="mb-4" />
        <p className="text-gray-600">
          {stage === 'extracting' ? 'Extracting colors from your image...' : 'Generating your theme...'}
        </p>
        {imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt="Uploaded preview"
            className="mt-6 max-w-xs rounded-lg shadow-lg"
          />
        )}
      </div>
    );
  }
  
  // Preview stage
  if (stage === 'preview' && previewColors && generatedTheme) {
    return (
      <div className="space-y-6">
        {/* Image and Colors */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
          {imagePreviewUrl && (
            <div className="flex-shrink-0">
              <img
                src={imagePreviewUrl}
                alt="Source image"
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Extracted Colors</h3>
            <ColorPalette />
          </div>
        </div>
        
        {/* Theme Mode Toggle */}
        <ThemeModeToggle />
        
        {/* Theme Preview */}
        <div className="max-w-2xl mx-auto">
          <ThemePreview
            theme={previewColors}
            showSidebar={true}
            responsive={true}
          />
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <DownloadButton
            content={generatedTheme.content}
            filename={generatedTheme.name.replace(/\s+/g, '_')}
            onSuccess={handleDownloadSuccess}
            onError={handleDownloadError}
            variant="primary"
            size="large"
          >
            Download Theme
          </DownloadButton>
          
          <button
            onClick={reset}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
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
 * App Header Component
 */
function AppHeader() {
  const { stage, reset } = useThemeGenerator();
  
  return (
    <header className="text-center mb-8">
      <h1 
        className="text-4xl font-bold text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
        onClick={stage !== 'upload' ? reset : undefined}
      >
        🎨 Telegram Theme Generator
      </h1>
      <p className="text-gray-600">
        Create beautiful Telegram themes from your favorite images
      </p>
    </header>
  );
}

/**
 * App Footer Component
 */
function AppFooter() {
  return (
    <footer className="text-center mt-12 text-gray-500 text-sm">
      <p>
        All processing happens locally in your browser. Your images are never uploaded.
      </p>
      <p className="mt-2">
        <a 
          href="https://github.com/Hypovolemic/telegram-theme-generator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View on GitHub
        </a>
      </p>
    </footer>
  );
}

/**
 * Main App wrapper with providers
 */
function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <AppHeader />
        <ProcessingStatus />
        <main className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <MainContent />
        </main>
        <AppFooter />
      </div>
    </div>
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