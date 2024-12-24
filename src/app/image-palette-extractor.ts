// Utils
import { extractRgbAsTuple, rgbaToHex } from '../utils/ColorUtils';

export type TRgba = [number, number, number, number];

/**
 * ColorPalette
 *
 * Class for extracting a color palette.
 *
 * It was developed based on the study of the technologies involved in the article.
 *
 * @see https://dev.to/producthackers/creating-a-color-palette-with-javascript-44ip
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
   * @returns Promise with an array of colors in hexadecimal format.
   */
  public static getColors(imgSrc: string, colorsFromPalette: number = 2): Promise<string[]> {
    const img: HTMLImageElement = new Image();
    img.src = imgSrc;

    return new Promise<string[]>((resolve, reject) => {
      // Waits for the image to load before starting palette extraction
      img.onload = (): void => {
        // Creates a canvas and sets the loaded image
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const context: CanvasRenderingContext2D = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        // Iterates over all image pixels and builds a sorted color palette by their presence
        const imageData: ImageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData: Uint8ClampedArray = imageData.data;
        const colorCounts: Record<string, number> = this._countPixelColors(pixelData);
        const sortedColors: TRgba[] = this._sortColorsByCount(colorCounts);

        // Builds the final palette in hexadecimal format
        const colorPalette: string[] = this._getPaletteFromSortedColors(
          sortedColors.slice(0, colorsFromPalette)
        );
        resolve(colorPalette.map((color) => rgbaToHex(...extractRgbAsTuple(color))));
      };

      // Rejects the promise in case of an image load error.
      img.onerror = (error): void =>
        reject(`An error occurred while loading the image: Error ${error}`);
    });
  }

  /**
   * _countPixelColors
   *
   * Counts the occurrence of each color present in the pixels of an image.
   *
   * @param pixelData - Array of image pixels.
   *
   * @returns Object with the occurrence count of each color.
   *
   * @example
   *    {
   *        '255,255,255,255': 3,
   *        '245,0,178,0': 2,
   *    }
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
   *
   * @param colorCounts Object containing the counts of each color.
   *
   * @returns An array of RGBA colors sorted by descending count.
   */
  private static _sortColorsByCount(colorCounts: Record<string, number>): TRgba[] {
    const sortedColors = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
    return sortedColors.map((colorKey) => colorKey.split(',').map((c) => parseInt(c)) as TRgba);
  }

  /**
   * _getPaletteFromSortedColors
   *
   * Returns an array of strings representing the RGBA colors of a palette.
   *
   * @param sortedColors Array of RGBA colors sorted by descending count.
   *
   * @param colorsFromPalette Number of colors to include in the palette.
   *
   * @returns An array of strings representing the RGBA colors.
   */
  private static _getPaletteFromSortedColors(sortedColors: TRgba[]): string[] {
    return sortedColors.map((color) => this._getRgbaColorString(color));
  }

  /**
   * _getRgbaColorString
   *
   * Returns a string representing the RGBA color.
   *
   * @param rgbaArray Array of 4 numbers representing the R, G, B, and A values of the color.
   *
   * @returns A string in the format 'rgba(r, g, b, a)' representing the RGBA color in CSS.
   */
  private static _getRgbaColorString(rgbaArray: TRgba): string {
    const [r, g, b, a] = rgbaArray;
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  }
}
