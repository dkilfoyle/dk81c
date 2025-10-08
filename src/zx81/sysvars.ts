export interface ISYSVAR {
  address: number;
  size: number;
  def: number;
  desc: string;
}

export const SYSVARS: Record<string, ISYSVAR> = {
  VERSN: { address: 16393, size: 1, def: 0, desc: "ZX81 basic = 0" },
  E_PPC: { address: 16394, size: 2, def: 1, desc: "Number of current line" },
  D_FILE: { address: 16396, size: 2, def: 0, desc: "Pointer to start of display file" },
  DF_CC: { address: 16398, size: 2, def: 0, desc: "Address of PRINT position in display file" },
  VARS: { address: 16400, size: 2, def: 0, desc: " Pointer to start of BASIC variable table" },
  DEST: { address: 16402, size: 2, def: 0, desc: "Address of variable in assignment" },
  E_LINE: { address: 16404, size: 2, def: 1, desc: "Pointer to line currenting being entered" },
  CH_ADD: { address: 16406, size: 2, def: 0, desc: "Address of next character to be interpreted" },
  X_PTR: { address: 16408, size: 2, def: 0, desc: "Address of the character preceding the marker" },
  STKBOT: { address: 16410, size: 2, def: 2, desc: "Pointer to bottom (start) of stack" },
  STKEND: { address: 16412, size: 2, def: 2, desc: "Pointer to end (top) of stack" },
  BERG: { address: 16414, size: 1, def: 0, desc: "Calculators b register" },
  MEM: { address: 16415, size: 2, def: 0x403d, desc: "Address of area used for calculator's memory" },
  "16417": { address: 16417, size: 1, def: 0, desc: "Not used" },
  DF_SZ: { address: 16418, size: 1, def: 2, desc: "Num lines including blank in the lower part of screen" },
  S_TOP: { address: 16419, size: 2, def: 2, desc: "Num top program line in automatic listings" },
  LAST_K: { address: 16421, size: 2, def: 0xfdbf, desc: "Which keys pressed" },
  "16423": { address: 16423, size: 1, def: 0x0f, desc: "Debounce status of keyboard" },
  MARGIN: { address: 16424, size: 1, def: 0x37, desc: "Number of blank lines above or below picture" },
  NXTLIN: { address: 16425, size: 2, def: 0, desc: "Address of the next program line to be executed" },
  OLDPPC: { address: 16427, size: 2, def: 0, desc: "Line number of which CONT jumps" },
  FLAGX: { address: 16429, size: 1, def: 0, desc: "Various flags" },
  STRLEN: { address: 16430, size: 2, def: 0, desc: "Length of string type destination in assignment" },
  T_ADDR: { address: 16432, size: 2, def: 0x0c8d, desc: "Address of the next item in syntax table" },
  SEED: { address: 16434, size: 2, def: 0, desc: "Seed for RND" },
  FRAMES: { address: 16436, size: 2, def: 0xf5a3, desc: "Counts the frames, bit 15 is 1" },
  COORDS: { address: 16438, size: 2, def: 0, desc: "x then y-coord of last point PLOTed" },
  PR_CC: { address: 16440, size: 1, def: 0xbc, desc: "LSB of address of next position for LPRINT" },
  S_POSN: { address: 16441, size: 2, def: 0x1821, desc: "col and line number for PRINT position" },
  CDFLAG: { address: 16443, size: 1, def: 0x40, desc: "Flags - Bit 7 is 1 during compute and display mode" },
  PRBUFF: { address: 16444, size: 33, def: 0, desc: "Printer buffer, 33rd byte is NL" },
  MEMBOT: { address: 16477, size: 30, def: 0, desc: "Calculator memory area" },
  "16507": { address: 16507, size: 2, def: 0, desc: "Not used" },
};
