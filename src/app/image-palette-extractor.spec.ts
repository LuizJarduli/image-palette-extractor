import { ColorPalette, TRgba } from './image-palette-extractor';

const mockImage = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 150;
  const ctx = canvas.getContext('2d');
  const colors = ['red', 'green', 'blue'];

  colors.forEach((_color, index, list) => {
    const { width: canvasWidth, height: canvasHeight } = canvas;
    const width = canvasWidth / list.length;
    const height = canvasHeight;
    const x = index * width;
    const y = 0;

    ctx!.fillStyle = colors[index];
    ctx!.fillRect(x, y, width, height);
  });

  return canvas.toDataURL();
};

describe('ColorPalette - Unit tests', () => {
  // Mocks
  const mockedImage: HTMLImageElement = new Image();
  mockedImage.src = mockImage();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getColors', () => {
    it('should extract a color palette with two colors by default', async () => {
      // Arrange
      const expectedResult = [
        '#ff0000ff', // Vermelho
        '#008000ff', // Verde
      ];

      // Act
      const resultPalette: string[] = await ColorPalette.getColors(mockedImage.src);

      // Assert
      expect(resultPalette.length).toBe(2);
      expect(resultPalette).toEqual(expectedResult);
    });

    it('should extract a color palette with the specified number of colors', async () => {
      // Arrange
      const expectedResult = [
        '#ff0000ff', // Vermelho
        '#008000ff', // Verde
        '#0000ffff', // Azul
      ];
      const numOfColorsToExtract = 3;

      // Act
      const resultPalette: string[] = await ColorPalette.getColors(
        mockedImage.src,
        numOfColorsToExtract
      );

      // Assert
      expect(resultPalette.length).toBe(numOfColorsToExtract);
      expect(resultPalette).toEqual(expectedResult);
    });

    it('should reject the promise if the image fails to load', async () => {
      /** Act */
      const promise: Promise<string[]> = ColorPalette.getColors('');

      /** Assert */
      await expect(promise).rejects.toEqual(jasmine.any(String));
    });
  });

  describe('_countPixelColors', () => {
    it('should count colors excluding white and transparent', () => {
      const pixelData = new Uint8ClampedArray([
        255,
        255,
        255,
        255, // White pixel (excluded)
        255,
        0,
        0,
        255, // Red pixel
        0,
        0,
        0,
        0, // Transparent pixel (excluded)
        255,
        0,
        0,
        255, // Red pixel
      ]);

      const result = ColorPalette['_countPixelColors'](pixelData);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result['255,0,0,255']).toBe(2);
    });
  });

  describe('_sortColorsByCount', () => {
    it('should sort colors by count in descending order', () => {
      const colorCounts = {
        '255,0,0,255': 3,
        '0,255,0,255': 1,
        '0,0,255,255': 2,
      };

      const result = ColorPalette['_sortColorsByCount'](colorCounts);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual([255, 0, 0, 255]);
      expect(result[1]).toEqual([0, 0, 255, 255]);
      expect(result[2]).toEqual([0, 255, 0, 255]);
    });
  });

  describe('_getRgbaColorString', () => {
    it('should convert RGBA array to CSS string format', () => {
      const rgba: TRgba = [255, 128, 0, 255];
      const result = ColorPalette['_getRgbaColorString'](rgba);
      expect(result).toBe('rgba(255, 128, 0, 1)');
    });

    it('should handle alpha channel conversion', () => {
      const rgba: TRgba = [255, 128, 0, 128];
      const result = ColorPalette['_getRgbaColorString'](rgba);
      expect(result).toBe('rgba(255, 128, 0, 0.5019607843137255)');
    });
  });
});
