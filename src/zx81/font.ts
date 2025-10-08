// 64 glyphs
// each character 8x8 pixels
// each row is 1 byte of 8bits with 1=black
// each character therefore is 8 bytes
// font begins at 0x1e00

// character set
// 0-63 (0x3f) black on white, 0 = 0x1c, A = 0x26
// MSB=1 for inverse (white on black) = 128-191

import { rom } from "./rom";

let addr = 0x1e00;

// DEFB % 11110000;
// DEFB % 11110000;
// DEFB % 11110000;
// DEFB % 11110000;
// DEFB % 00000000;
// DEFB % 00000000;
// DEFB % 00000000;
// DEFB % 00000000;

export const font: Map<number, ImageData> = new Map();

for (let i = 0; i < 64; i++) {
  const pixels1 = new Uint8ClampedArray(8 * 8 * 4);
  const pixels2 = new Uint8ClampedArray(8 * 8 * 4);
  let pixel1 = 0;
  let pixel2 = 0;

  for (let row = 0; row < 8; row++) {
    let b = rom[addr++];
    for (let col = 0; col < 8; col++) {
      pixels1[pixel1++] = b & 128 ? 0 : 255;
      pixels1[pixel1++] = b & 128 ? 0 : 255;
      pixels1[pixel1++] = b & 128 ? 0 : 255;
      pixels1[pixel1++] = 255;
      pixels2[pixel2++] = b & 128 ? 255 : 0;
      pixels2[pixel2++] = b & 128 ? 255 : 0;
      pixels2[pixel2++] = b & 128 ? 255 : 0;
      pixels2[pixel2++] = 255;
      b <<= 1;
    }
  }

  font.set(i, new ImageData(pixels1, 8));
  font.set(0x80 + i, new ImageData(pixels2, 8));
}

// for (let i = 0; i < 64; i++) {
//   const charRow = Math.floor(i / 16);
//   const charCol = i % 16;

//   for (let row = 0; row < 8; row++) {
//     let b = rom[addr++];
//     // calculate top left pixel offset
//     let pixel1 = charRow * pitch * 8 + row * pitch + charCol * 8 * 4;
//     let pixel2 = (charRow + 4) * pitch * 8 + row * pitch + charCol * 8 * 4;
//     for (let col = 0; col < 8; col++) {
//       pixels[pixel1++] = b & 128 ? 0 : 255;
//       pixels[pixel1++] = b & 128 ? 0 : 255;
//       pixels[pixel1++] = b & 128 ? 0 : 255;
//       pixels[pixel1++] = 255;
//       pixels[pixel2++] = b & 128 ? 255 : 0;
//       pixels[pixel2++] = b & 128 ? 255 : 0;
//       pixels[pixel2++] = b & 128 ? 255 : 0;
//       pixels[pixel2++] = 255;
//       b <<= 1;
//     }
//   }
// }

// export const font = new ImageData(pixels, 16 * 8, 8 * 8);
