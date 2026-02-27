# Telegram Theme Generator – Architecture

## Overview
The Telegram Theme Generator is a client-side web application built with React, TypeScript, and Vite. It processes images locally to generate Telegram Desktop `.attheme` files, ensuring privacy and performance.

## Main Components
- **ImageUploader:** Handles file selection, drag-and-drop, and validation.
- **ColorExtractor:** Uses the HTML5 Canvas API to extract dominant colours from images.
- **ThemePreview:** Renders a live Telegram chat preview using the generated theme colours.
- **ChatBubble/MessageList:** Simulate Telegram chat UI for accurate previews.
- **ThemeBuilder:** Generates the `.attheme` file from extracted colours.
- **ContrastOptimizer:** Ensures all text meets accessibility contrast standards.
- **ErrorBoundary/Toast:** User-friendly error handling and notifications.

## Data Flow
1. **User uploads image** →
2. **ColorExtractor** processes image →
3. **ThemeBuilder** creates theme object →
4. **ThemePreview** updates UI →
5. **User downloads `.attheme`**

## Privacy & Security
- All processing is done in-browser; no images or data are sent to any server.
- No cookies, analytics, or external requests.

## Project Structure
- `src/components/` – UI components (uploader, preview, chat, etc.)
- `src/core/` – Colour extraction, theme generation, contrast logic
- `src/utils/` – Utility functions and error handling
- `public/` – Static assets and sample images

## Extensibility
- Modular React components for easy feature addition
- TypeScript types for safety and maintainability
- Easily add new preview layouts or export formats

For more details, see inline code comments and the [CONTRIBUTING.md](../CONTRIBUTING.md) guide.
