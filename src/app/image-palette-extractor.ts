// Utils
import { extractRgbAsTuple, rgbaToHex, rgbToLab } from '../utils/ColorUtils';

export type TRgba = [number, number, number, number];

/**
 * ColorPalette
 *
 * Class for extracting a color palette.
 */
/**
 * A class for extracting color palettes from images.
 *
 * This class provides functionality to analyze images and extract their dominant colors,
 * taking into account color similarity and transparency.
 *
 * @remarks
 * The color similarity is calculated using the CIE76 formula, which provides a perceptual
 * difference between colors that approximates human vision.
 *
 * @example
 * ```typescript
 * const palette = await ColorPalette.getColors('path/to/image.jpg', 5, 10);
 * console.log(palette); // ['#FF0000', '#00FF00', '#0000FF', ...]
 * ```
 */
export class ColorPalette {
  /**
   * getColors
   *
   * Extracts a color palette from an image.
   *
   * @param imgSrc - The path to the image to extract the color palette from (base64 strings are also supported).
   *
   * @param colorsFromPalette - Number of colors to extract, default is 2.
   *
   * @param similarityThreshold - Threshold for color similarity based on the CIE76 formula.
   *
   * Color Similarity Reference Table:
   *
   * | Delta E Value | Perception                                |
   * |---------------|-------------------------------------------|
   * | <= 1.0        | Not perceptible to human eye              |
   * | 1.0 - 2.0     | Perceptible through close observation     |
   * | 2.0 - 10.0    | Perceptible at a glance                   |
   * | 11.0 - 49.0   | Colors are more similar than opposite     |
   * | 100           | Colors are exact opposites                |
   *
   * @returns Promise with an array of colors in hexadecimal format.
   */
  public static getColors(
    imgSrc: string,
    colorsFromPalette: number = 2,
    similarityThreshold: number = 10 // Default to "perceptible at a glance"
  ): Promise<string[]> {
    const img: HTMLImageElement = new Image();
    img.src = imgSrc;

    return new Promise<string[]>((resolve, reject) => {
      img.onload = (): void => {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const context: CanvasRenderingContext2D = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        const imageData: ImageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData: Uint8ClampedArray = imageData.data;
        const colorCounts: Record<string, number> = this._countPixelColors(pixelData);
        const sortedColors: TRgba[] = this._sortColorsByCount(colorCounts);

        // Filter out similar colors based on the threshold
        const distinctColors: TRgba[] = this._filterSimilarColors(
          sortedColors,
          similarityThreshold
        ).slice(0, colorsFromPalette);

        // Build the final palette in hexadecimal format
        const colorPalette: string[] = distinctColors.map((color) =>
          rgbaToHex(...extractRgbAsTuple(this._getRgbaColorString(color)))
        );
        resolve(colorPalette);
      };

      img.onerror = (error): void =>
        reject(`An error occurred while loading the image: Error ${error}`);
    });
  }

  /**
   * _countPixelColors
   *
   * Counts the occurrence of each color present in the pixels of an image.
   */
  private static _countPixelColors(pixelData: Uint8ClampedArray): Record<string, number> {
    const colorCounts: Record<string, number> = {};
    for (let i = 0; i < pixelData.length; i += 4) {
      const r: number = pixelData[i];
      const g: number = pixelData[i + 1];
      const b: number = pixelData[i + 2];
      const a: number = pixelData[i + 3];
      const colorKey: string = [r, g, b, a].join(',');

      // Excludes white and possible transparent pixels from extraction
      if (a === 0 || [r, g, b].every((value) => value === 255)) {
        continue;
      }

      if (colorKey in colorCounts) {
        colorCounts[colorKey]++;
      } else {
        colorCounts[colorKey] = 1;
      }
    }

    return colorCounts;
  }

  /**
   * _sortColorsByCount
   *
   * Sorts the colors from an object containing color counts.
   */
  private static _sortColorsByCount(colorCounts: Record<string, number>): TRgba[] {
    const sortedColors = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
    return sortedColors.map((colorKey) => colorKey.split(',').map((c) => parseInt(c)) as TRgba);
  }

  /**
   * _filterSimilarColors
   *
   * Filters out colors that are too similar to those already in the palette.
   */
  private static _filterSimilarColors(colors: TRgba[], threshold: number): TRgba[] {
    const distinctColors: TRgba[] = [];

    for (const color of colors) {
      const shouldPushColor =
        distinctColors.length === 0 ||
        !distinctColors.some(
          (existingColor) => this._colorDifference(color, existingColor) < threshold
        );

      if (shouldPushColor) {
        distinctColors.push(color);
      }
    }

    return distinctColors;
  }

  /**
   * _colorDifference
   *
   * Calculates the difference between two colors using the CIE76 formula.
   */
  private static _colorDifference(color1: TRgba, color2: TRgba): number {
    const [r1, g1, b1] = color1;
    const [r2, g2, b2] = color2;

    // Convert RGB to Lab color space
    const lab1 = rgbToLab(r1, g1, b1);
    const lab2 = rgbToLab(r2, g2, b2);

    // Calculate CIE76 color difference
    const deltaL = lab1[0] - lab2[0];
    const deltaA = lab1[1] - lab2[1];
    const deltaB = lab1[2] - lab2[2];

    return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
  }

  /**
   * _getRgbaColorString
   *
   * Returns a string representing the RGBA color.
   */
  private static _getRgbaColorString(rgbaArray: TRgba): string {
    const [r, g, b, a] = rgbaArray;
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  }
}
