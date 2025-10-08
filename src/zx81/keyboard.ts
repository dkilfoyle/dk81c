// Row selector     |  Result Bits (0=pressed)
//                  |  0    1    2    3    4
// ----------------------------------------
// 0  %11111110  fe |  SH   Z    X    C    V
// 1  %11111101  fd |  A    S    D    F    G
// 2  %11111011  fb |  Q    W    E    R    T
// 3  %11110111  f7 |  1    2    3    4    5
// 4  %11101111  ef |  0    9    8    7    6
// 5  %11011111  df |  P    O    I    U    Y
// 6  %10111111  bf |  EN   L    K    J    H
// 7  %01111111  7f |  SP   .    M    N    B

// eg if R is pressed then
// read IO port 0xfbfe
// result = ???_10111

export const keyboard = {
  0xfe: 255,
  0xfd: 255,
  0xfb: 255,
  0xf7: 255,
  0xef: 255,
  0xdf: 255,
  0xbf: 255,
  0x7f: 255,
};

export const scanCodes: Record<string, { code: number; row: number }> = {
  SHIFT: { code: ~(1 << 0) & 0xff, row: 0xfe },
  Z: { code: ~(1 << 1) & 0xff, row: 0xfe },
  X: { code: ~(1 << 2) & 0xff, row: 0xfe },
  C: { code: ~(1 << 3) & 0xff, row: 0xfe },
  V: { code: ~(1 << 4) & 0xff, row: 0xfe },

  A: { code: ~(1 << 0) & 0xff, row: 0xfd },
  S: { code: ~(1 << 1) & 0xff, row: 0xfd },
  D: { code: ~(1 << 2) & 0xff, row: 0xfd },
  F: { code: ~(1 << 3) & 0xff, row: 0xfd },
  G: { code: ~(1 << 4) & 0xff, row: 0xfd },

  Q: { code: ~(1 << 0) & 0xff, row: 0xfb },
  W: { code: ~(1 << 1) & 0xff, row: 0xfb },
  E: { code: ~(1 << 2) & 0xff, row: 0xfb },
  R: { code: ~(1 << 3) & 0xff, row: 0xfb },
  T: { code: ~(1 << 4) & 0xff, row: 0xfb },

  "1": { code: ~(1 << 0) & 0xff, row: 0xf7 },
  "2": { code: ~(1 << 1) & 0xff, row: 0xf7 },
  "3": { code: ~(1 << 2) & 0xff, row: 0xf7 },
  "4": { code: ~(1 << 3) & 0xff, row: 0xf7 },
  "5": { code: ~(1 << 4) & 0xff, row: 0xf7 },

  "0": { code: ~(1 << 0) & 0xff, row: 0xef },
  "9": { code: ~(1 << 1) & 0xff, row: 0xef },
  "8": { code: ~(1 << 2) & 0xff, row: 0xef },
  "7": { code: ~(1 << 3) & 0xff, row: 0xef },
  "6": { code: ~(1 << 4) & 0xff, row: 0xef },

  P: { code: ~(1 << 0) & 0xff, row: 0xdf },
  O: { code: ~(1 << 1) & 0xff, row: 0xdf },
  I: { code: ~(1 << 2) & 0xff, row: 0xdf },
  U: { code: ~(1 << 3) & 0xff, row: 0xdf },
  Y: { code: ~(1 << 4) & 0xff, row: 0xdf },

  ENTER: { code: ~(1 << 0) & 0xff, row: 0xbf },
  L: { code: ~(1 << 1) & 0xff, row: 0xbf },
  K: { code: ~(1 << 2) & 0xff, row: 0xbf },
  J: { code: ~(1 << 3) & 0xff, row: 0xbf },
  H: { code: ~(1 << 4) & 0xff, row: 0xbf },

  " ": { code: ~(1 << 0) & 0xff, row: 0x7f },
  ".": { code: ~(1 << 1) & 0xff, row: 0x7f },
  M: { code: ~(1 << 2) & 0xff, row: 0x7f },
  N: { code: ~(1 << 3) & 0xff, row: 0x7f },
  B: { code: ~(1 << 4) & 0xff, row: 0x7f },
};
