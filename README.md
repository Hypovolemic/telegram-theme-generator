
# Telegram Theme Generator

[![CI](https://github.com/Hypovolemic/telegram-theme-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/Hypovolemic/telegram-theme-generator/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Hypovolemic/telegram-theme-generator/branch/main/graph/badge.svg)](https://codecov.io/gh/Hypovolemic/telegram-theme-generator)

Generate custom Telegram Desktop themes from any image. Upload a photo, wallpaper, or artwork, and get a perfectly colour-matched `.attheme` file for Telegram Desktop.

---

## Features

- 🎨 **Automatic Colour Extraction** – Extracts dominant colours from your images
- 👁️ **Live Preview** – See how your theme looks before downloading
- ✨ **Contrast Optimization** – Ensures readable text with proper contrast ratios
- 📱 **One-Click Download** – Export ready-to-use `.attheme` files
- 🖼️ **Sample Images** – Try with built-in images for inspiration
- 🔒 **100% Private** – All processing is local, no uploads or tracking

---

## Screenshots

![App Screenshot 1](docs/screenshots/theme-preview-light.png)
![App Screenshot 2](docs/screenshots/theme-preview-upload.png)

---

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
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
| Script                | Description                  |
|-----------------------|------------------------------|
| `npm run dev`         | Start development server     |
| `npm run build`       | Build for production         |
| `npm run preview`     | Preview production build     |
| `npm run test`        | Run tests                    |
| `npm run test:coverage`| Run tests with coverage     |
| `npm run lint`        | Run ESLint                   |
| `npm run format`      | Format code with Prettier    |

---

## Usage

1. Open the app in your browser or run locally.
2. Upload an image using the upload button or try a sample image.
3. Preview your theme in the live Telegram chat preview.
4. Download your `.attheme` file and import it in Telegram Desktop.

For a detailed guide, see [User Guide](docs/USER_GUIDE.md).

---

## Architecture

- **React 19** – UI framework
- **TypeScript** – Type safety
- **Vite** – Build tool
- **Tailwind CSS** – Styling
- **Vitest** – Testing

See [Architecture Documentation](docs/ARCHITECTURE.md) for more details.

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Troubleshooting

- **Theme looks odd?** Try a different image or adjust the crop.
- **File won’t import?** Make sure you’re using Telegram Desktop and importing a `.attheme` file.
- **Preview not updating?** Refresh the page or clear your browser cache.

See [User Guide](docs/USER_GUIDE.md#troubleshooting) for more help.

---

## Known Issues

- Some images may produce low-contrast themes; try another image for best results.
- Only Telegram Desktop `.attheme` files are supported (not Android/iOS).
- Large images may take longer to process in-browser.

---

## License

MIT. See [LICENSE](LICENSE).
