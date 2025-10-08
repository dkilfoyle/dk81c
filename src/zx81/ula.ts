import type { ZX81 } from "./zx81";

const HSYNC_MINLEN = 8;
const HSYNC_MAXLEN = 32;
const HSYNC_TOLERANCEMIN = 414 - 30;
const HSYNC_TOLERANCEMAX = 414 + 30;
const VSYNC_MINLEN = 170;
const VSYNC_TOLERANCEMIN = 310 - 100;
const VSYNC_TOLERANCEMAX = 310 + 100;

const MRGX1 = 74 - (320 - 256) / 2; // 42
const MRGX2 = MRGX1 + 320; // 362
const MRGY1 = 56 - (240 - 192) / 2; // 32
const MRGY2 = MRGY1 + 240; // 272

export class ULA {
  rasterX = 0;
  rasterY = 0;
  hsync_counter = 0;
  hsync_pending = 0;
  hsync_state = 0;
  vsync_state = 0;
  ulacharline = 0;
  sync_signal = 0;
  sync_last = 0;
  sync_len = 0;
  frameEnd = false;
  tStateCountLast = 0;
  rgb = { pixels: 0, fc: 0, bc: 0 };
  imageData = new ImageData(320, 240); //ImageData(32 * 8, 24 * 8);
  zx81: ZX81;
  trace = 0;

  constructor(zx81: ZX81) {
    this.zx81 = zx81;
  }

  reset() {
    this.rasterX = 0;
    this.rasterY = 0;
    this.hsync_counter = 0;
    this.hsync_pending = 0;
    this.hsync_state = 0;
    this.vsync_state = 0;
    this.ulacharline = 0;
    this.sync_signal = 0;
    this.sync_last = 0;
    this.sync_len = 0;
    this.frameEnd = false;
    this.tStateCountLast = 0;
    this.imageData.data.fill(0);
    this.rgb = { pixels: 0, fc: 0, bc: 0 };
  }

  newFrame() {
    this.tStateCountLast = 0;
    this.frameEnd = false;
  }

  clearCharPixels() {
    this.rgb.pixels = 0;
    this.rgb.fc = 0;
    this.rgb.bc = 255;
  }

  loadCharPixels(code: number) {
    if (code & 0x80) {
      this.rgb.fc = 255;
      this.rgb.bc = 0;
    } else {
      this.rgb.fc = 0;
      this.rgb.bc = 255;
    }

    // read font[char][ulacharline] = 1 byte of 8 pixels of 1 row for font char
    const byteAddress = ((this.zx81.z80.regs.i & 0xfe) << 8) | ((code & 63) << 3) | this.ulacharline % 8;
    this.rgb.pixels = this.zx81.readMemory(byteAddress);

    if (code == 176) this.trace = 2000;
  }

  advanceCycles() {
    let tsWait = 0;
    let tsDelta = this.zx81.tStateCount - this.tStateCountLast;
    this.tStateCountLast = this.zx81.tStateCount;

    let pixelMask = 0x80; // 0b10000000
    for (let istate = 0, ipixel = 0; istate < tsDelta; istate++) {
      // zx81 can shift 2 pixels per cycle

      // if (this.rgb.pixels !== 0)
      //   console.log(
      //     `${_d(this.rgb.pixels)} | ${_d(this.ulacharline)} | ${_d(this.hsync_counter)} | ${_d(this.rasterX)}, ${_d(this.rasterY)} |  ${_d(this.rasterX - MRGX1)}, ${_d(this.rasterY - MRGY1)}`
      //   );

      for (let i = 0; i < 2; i++, ipixel++) {
        // if (this.rgb.pixels != 0) debugger;
        if (this.rgb.pixels & pixelMask) this.plot(this.rgb.fc, this.rgb.fc, this.rgb.fc);
        else this.plot(this.rgb.bc, this.rgb.bc, this.rgb.bc);
        pixelMask >>= 1;
      }

      // Vertical timings
      //                    scanlines    charlines     cycles
      // Upper blanking            56            7      11592
      // Display                  192           24      39744
      // Lower blanking            56            7      11592
      // v Retrace                  6                    1235
      //                                                -----
      //                                                64163 @ 3.25Mhz = 50Hz

      // TV                    | hsync |
      // hsync_counter  0 -----16-----31--------------------------------------160---------------192------207 = 64us
      // hsync_pending  1111111222222222                                                                   1
      // hsync_state           111111111
      // vsync_state                    0
      // ulachar               ++&7

      //                                | blank  | 32p bord |    live picture 256 pixels       | 32p bord
      // rasterX         bord|          0--------42---------74----------------------------------330-------348
      // rasterX        ---362-382------412

      this.hsync_counter++;
      if (this.hsync_counter >= 207) {
        this.hsync_counter = 0;
        this.hsync_pending = 1;
      }
      if (this.hsync_pending == 1 && this.hsync_counter >= 16) {
        this.hsync_pending = 2;
        this.hsync_state = 1;
        if (this.zx81.NMI_generator) {
          this.zx81.nmi_pending = 1;
          if (tsDelta == 4) tsWait = 14 + istate;
          else tsWait = 14;
          tsDelta += tsWait;
          this.zx81.tStateCount += tsWait;
        }
        if (this.vsync_state) {
          this.ulacharline = 0;
        } else {
          this.ulacharline++;
          this.ulacharline &= 7;
        }
      }
      if (this.hsync_pending == 2 && this.hsync_counter >= 32) {
        if (this.vsync_state == 2) this.vsync_state = 0;
        this.hsync_state = 0;
        this.hsync_pending = 0;
      }
      this.sync_signal = this.vsync_state || this.hsync_state ? 0 : 1;
      this.checksync();
    }
  }

  checksync() {
    const startSync = this.sync_signal == 0 && this.sync_last == 1;
    const inSync = this.sync_signal == 0;
    const endSync = this.sync_signal == 1 && this.sync_last == 0;

    if (startSync) this.sync_len = 0;

    if (inSync) {
      this.sync_len++;
      if (this.rasterX >= HSYNC_TOLERANCEMAX) {
        // inSync && rasterX >= 444
        // debugMsg("RasterX=0", `inSync x(${this.rasterX})>TOLMAX(${HSYNC_TOLERANCEMAX})`);
        this.rasterX = 0;
        this.rasterY++;
      }
      if (this.rasterY >= VSYNC_TOLERANCEMAX) {
        // inSync and rasterY >= 410
        // debugMsg("RasterY=0", `inSync y(${this.rasterY})>TOLMAX(${VSYNC_TOLERANCEMAX})`);
        this.rasterY = 0;
        this.frameEnd = true;
      }
    }

    if (endSync) {
      if (this.sync_len >= HSYNC_MINLEN && this.sync_len <= HSYNC_MAXLEN && this.rasterX >= HSYNC_TOLERANCEMIN) {
        // endSync and sync_len between 8 and 32
        // debugMsg(
        //   "RasterX=0",
        //   `endSync ${HSYNC_MINLEN} <= sync_len(${this.sync_len}) <= ${HSYNC_MAXLEN}) && rasterX(${this.rasterX})>=${HSYNC_TOLERANCEMIN}`
        // );
        this.rasterX = 0;
        this.rasterY++;
      }
      if (this.sync_len >= VSYNC_MINLEN && this.rasterY >= VSYNC_TOLERANCEMIN) {
        // endSync and sync_len > 170 && rasterY >= 210
        // debugMsg("RasterY=0", `endSync sync_len(${this.sync_len} >= ${VSYNC_MINLEN}) && rasterY(${this.rasterY}) >= ${VSYNC_TOLERANCEMIN}`);
        this.rasterY = 0;
        this.frameEnd = true;
      }
    }
    this.sync_last = this.sync_signal;
  }

  plot(r: number, g: number, b: number) {
    if (this.rasterX < MRGX1 || this.rasterX >= MRGX2 || this.rasterY < MRGY1 || this.rasterY >= MRGY2) {
      this.rasterX++;
      return;
    }

    // draw character grid
    // if (
    //   (this.rasterX - MRGX1) % 8 == 0 ||
    //   (this.rasterY - MRGY1) % 8 == 0 ||
    //   this.rasterX == MRGX1 ||
    //   this.rasterX == MRGX2 - 1 ||
    //   this.rasterY == MRGY1 ||
    //   this.rasterY == MRGY2 - 1
    // ) {
    //   let k = (this.rasterY - MRGY1) * 320 + (this.rasterX - MRGX1);
    //   k *= 4;
    //   this.imageData.data[k++] = 255;
    //   this.imageData.data[k++] = 0;
    //   this.imageData.data[k++] = 0;
    //   this.imageData.data[k++] = 55;
    //   this.rasterX++;
    //   return;
    // }

    let k = (this.rasterY - MRGY1) * 320 + (this.rasterX - MRGX1);
    k *= 4;
    // if (this.trace > 0) {
    //   console.log(this.trace, this.hsync_counter, k, this.rasterX, this.rasterY);
    //   this.trace--;

    //   // if (this.trace == 0) debugger;
    // }
    // if (this.trace > 0 && r == 0) debugger;
    this.imageData.data[k++] = r;
    this.imageData.data[k++] = g;
    this.imageData.data[k++] = b;
    this.imageData.data[k++] = 255;

    this.rasterX++;
  }

  maskableInterrupt() {
    this.hsync_counter = -2;
    this.hsync_pending = 1;
  }
}
