// Various utility functions.

/**
 * Convert a number to hex and zero-pad to the specified number of hex digits.
 */
function toHex(value: number, digits: number): string {
  return value.toString(16).toUpperCase().padStart(digits, "0");
}

/**
 * Convert a byte to hex.
 */
function toHexByte(value: number): string {
  return toHex(value, 2);
}

/**
 * Convert a word to hex.
 */
function toHexWord(value: number): string {
  return toHex(value, 4);
}

/**
 * Convert a long (32-bit value) to hex.
 */
function toHexLong(value: number): string {
  value &= 0xffffffff;

  // Convert two's complement negative numbers to positive numbers.
  if (value < 0) {
    value += 0x100000000;
  }

  return value.toString(16).toUpperCase().padStart(8, "0");
}

/**
 * Return the high byte of a word.
 */
function hi(value: number): number {
  return (value >> 8) & 0xff;
}

/**
 * Return the low byte of a word.
 */
function lo(value: number): number {
  return value & 0xff;
}

/**
 * Create a word from a high and low byte.
 */
function word(highByte: number, lowByte: number): number {
  return ((highByte & 0xff) << 8) | (lowByte & 0xff);
}

/**
 * Increment a byte.
 */
function inc8(value: number): number {
  return add8(value, 1);
}

/**
 * Increment a word.
 */
function inc16(value: number): number {
  return add16(value, 1);
}

/**
 * Decrement a byte.
 */
function dec8(value: number): number {
  return sub8(value, 1);
}

/**
 * Decrement a word.
 */
function dec16(value: number): number {
  return sub16(value, 1);
}

/**
 * Add two bytes together.
 */
function add8(a: number, b: number): number {
  return (a + b) & 0xff;
}

/**
 * Add two words together.
 */
function add16(a: number, b: number): number {
  return (a + b) & 0xffff;
}

/**
 * Subtract two bytes.
 */
function sub8(a: number, b: number): number {
  return (a - b) & 0xff;
}

/**
 * Subtract two words.
 */
function sub16(a: number, b: number): number {
  return (a - b) & 0xffff;
}

/**
 * Convert a byte to a signed number (e.g., 0xff to -1).
 */
function signedByte(value: number): number {
  return value >= 128 ? value - 256 : value;
}

export default { add16, sub16, inc16, dec16, inc8, dec8, add8, sub8, hi, lo, word, signedByte, toHex, toHexByte, toHexLong, toHexWord };
