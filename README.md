# image-palette-extractor

**A simple, client-side, dependency-free tool to extract color palettes from images!**

---

## Overview

The `image-palette-extractor` library allows you to extract dominant colors from an image using vanilla JavaScript. This utility is designed to work **exclusively in browser environments**, making it perfect for client-side applications.

The library leverages the Canvas API to process images and generate color palettes in hexadecimal format. With no external dependencies, it's lightweight and efficient!

---

## Installation

### Using npm

Install the library via npm:

```bash
npm install image-palette-extractor
```

Then, import it into your project:

```javascript
import { ColorPalette } from 'image-palette-extractor';
```

### Using a Standalone File

You can also include it in your project using a `<script>` tag:

```html
<script src="path/to/index.js"></script>
```

For ES Modules or bundlers like Webpack/Vite, simply import it as shown above.

---

## Usage

### Extract Colors from an Image

You can extract a specified number of dominant colors from an image by providing its URL or base64 string.

#### Example

```javascript
import { ColorPalette } from 'image-palette-extractor';

const imageUrl = 'https://images.pexels.com/photos/29879483/pexels-photo-29879483/free-photo-of-karussell-aus-holz-weihnachtsdekoration.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

ColorPalette.getColors(imageUrl, 5)
    .then((palette) => console.log('Extracted Color Palette:', palette))
    .catch((error) => console.error('Error:', error));
```

**Output:**

```javascript
[
  '#9c6158', // Dominant color
  '#594d46',
  '#332c29',
  '#a47968',
  '#786e66'
]
```

---

## API

### `ColorPalette.getColors(imgSrc: string, colorsFromPalette?: number): Promise<string[]>`

#### Parameters

- **`imgSrc`**: The path to the image (supports URLs and base64 strings).
- **`colorsFromPalette`**: _(Optional)_ Number of colors to extract. Defaults to 2.

#### Returns

A `Promise` that resolves to an array of hexadecimal color strings, sorted by prominence.

---

## Key Features

1. **Available via npm**: Install easily in any Node.js environment.
2. **Browser-Only**: Built exclusively for client-side environments.
3. **Dependency-Free**: No external libraries required.
4. **Efficient**: Minimal processing with clear and concise color extraction logic.
5. **Customizable Palettes**: Select the number of colors to extract.

---

## Development

To modify or extend the library, see the main file. Utilities for color conversion can also be accessed through these functions:

### Additional Utilities

- `rgbaToHex(r, g, b, a)`: Converts RGBA values to a hexadecimal string.
- `rgbToHex(r, g, b)`: Converts RGB values to a hexadecimal string.

Example usage:

```javascript
import { rgbaToHex, rgbToHex } from 'image-palette-extractor';

console.log(rgbToHex(255, 165, 0)); // Output: #ffa500
console.log(rgbaToHex(255, 165, 0, 0.5)); // Output: #ffa50080
```

---

## Browser Compatibility

This library is compatible with modern browsers that support the **Canvas API** and **ES6 modules**. Older browsers may require polyfills or transpiling.

---

Enjoy creating stunning palettes! 🌈
