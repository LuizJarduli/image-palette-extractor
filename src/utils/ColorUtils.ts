// Models
import { type TRgba } from '../app/image-palette-extractor';

/**
 * rgbToHex
 *
 * Converts RGB color values to a hexadecimal color string.
 *
 * @param r - The red color value (0-255).
 *
 * @param g - The green color value (0-255).
 *
 * @param b - The blue color value (0-255).
 *
 * @returns The hexadecimal color string in the format `#RRGGBB`.
 *
 * @throws Will throw an error if any RGB value is out of range (0-255).
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  if (!isValidRgbValue(r) || !isValidRgbValue(g) || !isValidRgbValue(b)) {
    throw new Error('Invalid RGB value. Values must be between 0 and 255.');
  }

  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
};

/**
 * rgbaToHex
 *
 * Converts RGBA color values to a hexadecimal color string.
 *
 * @param r - The red color value (0-255).
 *
 * @param g - The green color value (0-255).
 *
 * @param b - The blue color value (0-255).
 *
 * @param a - The alpha value (0-1).
 *
 * @returns The hexadecimal color string in the format `#RRGGBBAA`.
 *
 * @throws Will throw an error if any RGB value is out of range (0-255), or if alpha is out of range (0-1).
 */
export const rgbaToHex = (r: number, g: number, b: number, a: number): string => {
  if (!isValidRgbValue(r) || !isValidRgbValue(g) || !isValidRgbValue(b) || !isValidAlphaValue(a)) {
    throw new Error(
      'Invalid RGBA value. RGB values must be between 0 and 255, and alpha must be between 0 and 1.'
    );
  }

  const alphaHex = Math.round(a * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}${alphaHex}`;
};

/**
 * extractRgbAsTuple
 *
 * Extract the numbers of the provided rgba string and return the tuple containing the values and the alpha.
 *
 * @param rbgaString - The Rgba string value (rgba(0,0,0,0)).
 *
 * @returns A tuple of type `TRgba`
 */
export const extractRgbAsTuple = (rbgaString: string): TRgba => {
  const extractRegex = /^rgba?\((\d{1,3}),\s(\d{1,3}),\s(\d{1,3})(?:,\s(\d{1,3}))?\);?$/g;

  return rbgaString.replace(extractRegex, '$1,$2,$3,$4').split(',').map(Number) as TRgba;
};

/**
 * componentToHex
 *
 * Converts an RGB component value to a two-digit hexadecimal string.
 *
 * @param component - The RGB component value (0-255).
 *
 * @returns A two-digit hexadecimal string.
 */
const componentToHex = (component: number): string => {
  const hex = component.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};

/**
 * isValidRgbValue
 *
 * Validates whether a value is within the acceptable range for RGB components.
 *
 * @param value - The RGB component value to validate.
 *
 * @returns `true` if the value is valid (0-255), `false` otherwise.
 */
const isValidRgbValue = (value: number): boolean => {
  return value >= 0 && value <= 255;
};

/**
 * isValidAlphaValue
 *
 * Validates whether a value is within the acceptable range for the alpha channel.
 *
 * @param value - The alpha channel value to validate.
 *
 * @returns `true` if the value is valid (0-1), `false` otherwise.
 */
const isValidAlphaValue = (value: number): boolean => {
  return value >= 0 && value <= 1;
};
