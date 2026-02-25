declare module 'colorthief' {
  type RGB = [number, number, number];

  class ColorThief {
    /**
     * Get the dominant color from an image
     * @param sourceImage - Image element or URL
     * @param quality - Quality of sampling (1 is highest, 10 is default)
     */
    getColor(sourceImage: HTMLImageElement, quality?: number): RGB | null;

    /**
     * Get a palette of colors from an image
     * @param sourceImage - Image element or URL
     * @param colorCount - Number of colors to extract (default 10)
     * @param quality - Quality of sampling (1 is highest, 10 is default)
     */
    getPalette(
      sourceImage: HTMLImageElement,
      colorCount?: number,
      quality?: number
    ): RGB[] | null;
  }

  export default ColorThief;
}
