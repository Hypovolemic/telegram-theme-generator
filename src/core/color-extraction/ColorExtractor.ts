import ColorThief from 'colorthief';

export type RGB = [number, number, number];

export interface ExtractedColor {
  rgb: RGB;
  hex: string;
  vibrancy: number;
  brightness: number;
}

export interface ColorExtractionOptions {
  colorCount?: number;
  quality?: number;
  maxSize?: number;
}

const DEFAULT_OPTIONS: Required<ColorExtractionOptions> = {
  colorCount: 6,
  quality: 10,
  maxSize: 400,
};

/**
 * ColorExtractor class for extracting dominant colors from images
 * using the color-thief library with preprocessing and vibrancy sorting.
 */
export class ColorExtractor {
  private colorThief: ColorThief;
  private options: Required<ColorExtractionOptions>;

  constructor(options: ColorExtractionOptions = {}) {
    this.colorThief = new ColorThief();
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Extracts dominant colors from an image source.
   * @param source - HTMLImageElement, HTMLCanvasElement, or image URL
   * @returns Promise resolving to array of extracted colors sorted by vibrancy
   */
  async getDominantColors(
    source: HTMLImageElement | HTMLCanvasElement | string
  ): Promise<ExtractedColor[]> {
    const canvas = await this.preprocessImage(source);
    const palette = await this.extractPalette(canvas);

    const colors: ExtractedColor[] = palette.map((rgb) => ({
      rgb,
      hex: this.rgbToHex(rgb),
      vibrancy: this.calculateVibrancy(rgb),
      brightness: this.calculateBrightness(rgb),
    }));

    return this.sortByVibrancy(colors);
  }

  /**
   * Calculates the average brightness of an image.
   * @param source - HTMLImageElement, HTMLCanvasElement, or image URL
   * @returns Promise resolving to brightness value (0-255)
   */
  async getAverageBrightness(
    source: HTMLImageElement | HTMLCanvasElement | string
  ): Promise<number> {
    const canvas = await this.preprocessImage(source);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let totalBrightness = 0;
    let pixelCount = 0;

    // Sample every 4th pixel for performance
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Skip transparent pixels
      if (a < 128) continue;

      totalBrightness += this.calculateBrightness([r, g, b]);
      pixelCount++;
    }

    return pixelCount > 0 ? totalBrightness / pixelCount : 0;
  }

  /**
   * Preprocesses an image by resizing it to the maximum size while maintaining aspect ratio.
   * @param source - Image source
   * @returns Promise resolving to preprocessed canvas
   */
  private async preprocessImage(
    source: HTMLImageElement | HTMLCanvasElement | string
  ): Promise<HTMLCanvasElement> {
    let image: HTMLImageElement;

    if (typeof source === 'string') {
      image = await this.loadImage(source);
    } else if (source instanceof HTMLCanvasElement) {
      return this.resizeCanvas(source);
    } else {
      image = source;
      if (!image.complete) {
        await this.waitForImageLoad(image);
      }
    }

    return this.imageToCanvas(image);
  }

  /**
   * Loads an image from a URL.
   * @param url - Image URL or data URL
   * @returns Promise resolving to loaded HTMLImageElement
   */
  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));

      img.src = url;
    });
  }

  /**
   * Waits for an image to finish loading.
   */
  private waitForImageLoad(image: HTMLImageElement): Promise<void> {
    return new Promise((resolve, reject) => {
      if (image.complete) {
        resolve();
        return;
      }

      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Image failed to load'));
    });
  }

  /**
   * Converts an image to a resized canvas.
   */
  private imageToCanvas(image: HTMLImageElement): HTMLCanvasElement {
    const { width, height } = this.calculateResizedDimensions(
      image.naturalWidth || image.width,
      image.naturalHeight || image.height
    );

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    ctx.drawImage(image, 0, 0, width, height);
    return canvas;
  }

  /**
   * Resizes a canvas to the maximum size.
   */
  private resizeCanvas(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
    const { width, height } = this.calculateResizedDimensions(
      sourceCanvas.width,
      sourceCanvas.height
    );

    if (width === sourceCanvas.width && height === sourceCanvas.height) {
      return sourceCanvas;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    ctx.drawImage(sourceCanvas, 0, 0, width, height);
    return canvas;
  }

  /**
   * Calculates resized dimensions while maintaining aspect ratio.
   */
  private calculateResizedDimensions(
    originalWidth: number,
    originalHeight: number
  ): { width: number; height: number } {
    const maxSize = this.options.maxSize;

    if (originalWidth <= maxSize && originalHeight <= maxSize) {
      return { width: originalWidth, height: originalHeight };
    }

    const aspectRatio = originalWidth / originalHeight;

    if (originalWidth > originalHeight) {
      return {
        width: maxSize,
        height: Math.round(maxSize / aspectRatio),
      };
    }

    return {
      width: Math.round(maxSize * aspectRatio),
      height: maxSize,
    };
  }

  /**
   * Extracts color palette from a canvas using ColorThief.
   */
  private async extractPalette(canvas: HTMLCanvasElement): Promise<RGB[]> {
    // Convert canvas to image for ColorThief
    const dataUrl = canvas.toDataURL('image/png');
    const img = await this.loadImage(dataUrl);

    try {
      const palette = this.colorThief.getPalette(
        img,
        this.options.colorCount,
        this.options.quality
      );

      if (!palette || palette.length === 0) {
        // Fallback: get single dominant color
        const dominant = this.colorThief.getColor(img, this.options.quality);
        return dominant ? [dominant] : [[128, 128, 128]];
      }

      return palette;
    } catch {
      // Handle edge cases like single-color or grayscale images
      return this.extractFallbackPalette(canvas);
    }
  }

  /**
   * Fallback palette extraction for edge cases.
   */
  private extractFallbackPalette(canvas: HTMLCanvasElement): RGB[] {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return [[128, 128, 128]];
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Sample colors from the image
    const colors: RGB[] = [];
    const step = Math.max(1, Math.floor(data.length / (this.options.colorCount * 4 * 100)));

    for (let i = 0; i < data.length && colors.length < this.options.colorCount; i += step * 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a >= 128) {
        const color: RGB = [r, g, b];
        // Avoid duplicates
        if (!colors.some((c) => this.colorDistance(c, color) < 30)) {
          colors.push(color);
        }
      }
    }

    return colors.length > 0 ? colors : [[128, 128, 128]];
  }

  /**
   * Calculates the Euclidean distance between two colors.
   */
  private colorDistance(c1: RGB, c2: RGB): number {
    return Math.sqrt(
      Math.pow(c1[0] - c2[0], 2) +
        Math.pow(c1[1] - c2[1], 2) +
        Math.pow(c1[2] - c2[2], 2)
    );
  }

  /**
   * Converts RGB to hex color string.
   */
  private rgbToHex(rgb: RGB): string {
    return (
      '#' +
      rgb
        .map((c) => {
          const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }

  /**
   * Calculates the vibrancy (saturation * brightness) of a color.
   * Higher values indicate more vibrant colors.
   */
  private calculateVibrancy(rgb: RGB): number {
    const [r, g, b] = rgb.map((c) => c / 255);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    // Saturation (HSL)
    const lightness = (max + min) / 2;
    const saturation =
      delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

    // Vibrancy = saturation * adjusted brightness
    // Prefer colors that are neither too dark nor too light
    const brightnessScore = 1 - Math.abs(lightness - 0.5) * 2;

    return saturation * brightnessScore;
  }

  /**
   * Calculates the perceived brightness of a color using luminance formula.
   * @returns Brightness value from 0 (dark) to 255 (light)
   */
  private calculateBrightness(rgb: RGB): number {
    // Using the luminance formula for perceived brightness
    return 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
  }

  /**
   * Sorts colors by vibrancy in descending order.
   */
  private sortByVibrancy(colors: ExtractedColor[]): ExtractedColor[] {
    return [...colors].sort((a, b) => b.vibrancy - a.vibrancy);
  }

  /**
   * Determines if an image is predominantly grayscale.
   */
  async isGrayscale(
    source: HTMLImageElement | HTMLCanvasElement | string
  ): Promise<boolean> {
    const colors = await this.getDominantColors(source);

    return colors.every((color) => {
      const [r, g, b] = color.rgb;
      const maxDiff = Math.max(
        Math.abs(r - g),
        Math.abs(g - b),
        Math.abs(r - b)
      );
      return maxDiff < 20; // Allow small variance for slight color casts
    });
  }

  /**
   * Determines if an image is predominantly a single color.
   */
  async isSingleColor(
    source: HTMLImageElement | HTMLCanvasElement | string
  ): Promise<boolean> {
    const colors = await this.getDominantColors(source);

    if (colors.length <= 1) return true;

    // Check if all colors are very similar
    const firstColor = colors[0].rgb;
    return colors.every(
      (color) => this.colorDistance(firstColor, color.rgb) < 50
    );
  }
}

export default ColorExtractor;
