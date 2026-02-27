# Telegram Theme Generator

[![CI](https://github.com/Hypovolemic/telegram-theme-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/Hypovolemic/telegram-theme-generator/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Hypovolemic/telegram-theme-generator/branch/main/graph/badge.svg)](https://codecov.io/gh/Hypovolemic/telegram-theme-generator)

Generate custom Telegram themes from any image. Upload a photo, wallpaper, or artwork, and get a perfectly color-matched `.attheme` file for Telegram Android.

## Features

- **🎨 Automatic Color Extraction** - Extracts dominant colors from your images
- **☀️ Light & Dark Modes** - Generate themes for both light and dark preferences
- **👁️ Live Preview** - See how your theme looks before downloading
- **✨ Contrast Optimization** - Ensures readable text with proper contrast ratios
- **📱 One-Click Download** - Export ready-to-use `.attheme` files

## Privacy & Security

**🔒 100% Private - Your images never leave your device.**

This application uses **client-side processing** exclusively:

- ✅ **No Server Uploads** - All image processing happens in your browser
- ✅ **No Data Collection** - We don't collect, store, or transmit any user data
- ✅ **No Cookies** - No tracking cookies or analytics
- ✅ **No External Requests** - Your images stay on your device at all times
- ✅ **Open Source** - Verify our privacy claims by reviewing the [source code](https://github.com/Hypovolemic/telegram-theme-generator)

### How It Works

1. You select an image from your device
2. The image loads into your browser's memory (not uploaded anywhere)
3. JavaScript analyzes the image pixels using the HTML5 Canvas API
4. A theme file is generated locally and downloaded directly to your device

No internet connection is required after the initial page load.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Hypovolemic/telegram-theme-generator.git
cd telegram-theme-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Vitest** - Testing

## Usage

1. Visit the application
2. Upload an image (JPG, PNG, or WebP up to 10MB)
3. Wait for color extraction and theme generation
4. Toggle between light/dark mode to preview both versions
5. Click "Download Theme" to get your `.attheme` file
6. Import the theme in Telegram Android → Settings → Chat Settings → Change Chat Background → Pick Color → three-dot menu → Import theme

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
