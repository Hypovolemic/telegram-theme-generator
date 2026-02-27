/**
 * Privacy Policy Page Component
 * Explains client-side processing and data handling
 */

interface PrivacyPolicyProps {
  onClose: () => void;
}

export function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Privacy Policy</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close privacy policy"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Summary Box */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              TL;DR: Your Privacy is Guaranteed
            </h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Your images <strong>never leave your device</strong></li>
              <li>• No server uploads – all processing happens in your browser</li>
              <li>• No data collection, tracking, or analytics</li>
              <li>• No cookies or local storage of your images</li>
            </ul>
          </div>
          
          {/* How It Works */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How It Works</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Telegram Theme Generator uses <strong>client-side processing</strong> exclusively. 
              When you upload an image, it is processed entirely within your web browser using JavaScript. 
              The image data never leaves your device and is never transmitted to any server.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2 text-sm">Processing Flow:</h4>
              <ol className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">1</span>
                  <span>You select an image from your device</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">2</span>
                  <span>The image loads into your browser's memory (not uploaded anywhere)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">3</span>
                  <span>JavaScript analyzes the image pixels to extract dominant colors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">4</span>
                  <span>A theme file is generated locally and downloaded to your device</span>
                </li>
              </ol>
            </div>
          </section>
          
          {/* What We Don't Do */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">What We Don't Collect</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: '🖼️', text: 'Your images or photos' },
                { icon: '📊', text: 'Usage analytics or metrics' },
                { icon: '🍪', text: 'Cookies or tracking data' },
                { icon: '👤', text: 'Personal information' },
                { icon: '📍', text: 'Location or device data' },
                { icon: '🔗', text: 'Browsing history' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </section>
          
          {/* Technical Details */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Details</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              This application is built with React and runs entirely in your browser. 
              The color extraction algorithm uses the HTML5 Canvas API to read image pixel data, 
              which is a standard browser feature that doesn't require any server communication.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              The generated <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">.attheme</code> file 
              is created in memory and offered as a direct download. At no point is any data 
              sent to external servers.
            </p>
          </section>
          
          {/* Open Source */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Open Source Transparency</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              This project is open source. You can verify our privacy claims by reviewing the source code on{' '}
              <a 
                href="https://github.com/Hypovolemic/telegram-theme-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub
              </a>.
              The entire codebase is available for public inspection.
            </p>
          </section>
          
          {/* Contact */}
          <section className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500">
              Last updated: January 2026 • Questions? Open an issue on GitHub.
            </p>
          </section>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
