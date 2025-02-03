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
 * _rgbToLab
 *
 * Converts RGB color to Lab color space.
 *
 * @see https://zschuessler.github.io/DeltaE/learn/
 *
 * @param r - The red color value (0-255).
 *
 * @param g - The green color value (0-255).
 *
 * @param b - The blue color value (0-255).
 */
export const rgbToLab = (r: number, g: number, b: number): [number, number, number] => {
  // Convert RGB to XYZ
  let _r = r / 255;
  let _g = g / 255;
  let _b = b / 255;

  _r = _r > 0.04045 ? Math.pow((_r + 0.055) / 1.055, 2.4) : _r / 12.92;
  _g = _g > 0.04045 ? Math.pow((_g + 0.055) / 1.055, 2.4) : _g / 12.92;
  _b = _b > 0.04045 ? Math.pow((_b + 0.055) / 1.055, 2.4) : _b / 12.92;

  _r *= 100;
  _g *= 100;
  _b *= 100;

  const x = _r * 0.4124564 + _g * 0.3575761 + _b * 0.1804375;
  const y = _r * 0.2126729 + _g * 0.7151522 + _b * 0.072175;
  const z = _r * 0.0193339 + _g * 0.119192 + _b * 0.9503041;

  // Convert XYZ to Lab
  const xRef = 95.047;
  const yRef = 100.0;
  const zRef = 108.883;

  let _x = x / xRef;
  let _y = y / yRef;
  let _z = z / zRef;

  _x = _x > 0.008856 ? Math.pow(_x, 1 / 3) : 7.787 * _x + 16 / 116;
  _y = _y > 0.008856 ? Math.pow(_y, 1 / 3) : 7.787 * _y + 16 / 116;
  _z = _z > 0.008856 ? Math.pow(_z, 1 / 3) : 7.787 * _z + 16 / 116;

  const l = 116 * _y - 16;
  const a = 500 * (_x - _y);
  const bLab = 200 * (_y - _z);

  return [l, a, bLab];
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
 * getLuminanceFromHex
 *
 * Calculates the luminance of a color from its hexadecimal representation.
 *
 * @remarks
 *
 * If the luminance is greater than 0.5, the background is
 * considered light, so you should use a dark text color.
 * If the luminance is less than or equal to 0.5, the
 * background is considered dark, so you should use a light text color.
 *
 * @param hex - The hexadecimal color string.
 *
 * @returns The luminance of the color.
 */
export const getLuminanceFromHex = (hex: string): number => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // Calculate luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance;
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
