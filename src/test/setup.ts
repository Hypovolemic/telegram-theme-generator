import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock HTMLCanvasElement for jsdom
class MockCanvasRenderingContext2D {
  canvas = { width: 100, height: 100 };
  fillStyle = '';
  
  fillRect() {}
  
  drawImage() {}
  
  getImageData(x: number, y: number, width: number, height: number) {
    // Return mock image data with some color variation
    const data = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < data.length; i += 4) {
      // Create variation in colors
      data[i] = (i * 3) % 256;     // R
      data[i + 1] = (i * 5) % 256;  // G
      data[i + 2] = (i * 7) % 256;  // B
      data[i + 3] = 255;            // A
    }
    return { data, width, height };
  }
  
  putImageData() {}
}

// Mock canvas getContext
HTMLCanvasElement.prototype.getContext = vi.fn(function(
  this: HTMLCanvasElement,
  contextType: string
) {
  if (contextType === '2d') {
    const ctx = new MockCanvasRenderingContext2D();
    ctx.canvas = { width: this.width, height: this.height } as HTMLCanvasElement;
    return ctx as unknown as CanvasRenderingContext2D;
  }
  return null;
}) as typeof HTMLCanvasElement.prototype.getContext;

// Mock canvas toDataURL
HTMLCanvasElement.prototype.toDataURL = vi.fn(() => {
  // Return a minimal valid data URL for a 1x1 red pixel PNG
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
});

// Mock Image loading behavior
const originalImage = global.Image;
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  crossOrigin = '';
  src = '';
  complete = false;
  naturalWidth = 100;
  naturalHeight = 100;
  width = 100;
  height = 100;

  constructor() {
    setTimeout(() => {
      this.complete = true;
      this.onload?.();
    }, 0);
  }
}

global.Image = MockImage as unknown as typeof Image;

// Cleanup after tests
afterAll(() => {
  global.Image = originalImage;
});
