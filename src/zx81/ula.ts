import type { ZX81 } from "./zx81";

const HSYNC_MINLEN = 8; // 5us pulse = 16.25 cpu cycles
const HSYNC_MAXLEN = 32;
const HSYNC_TOLERANCEMIN = 414 - 30; // 64us interval = 207 cpu cycles = 414 ula cycles
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
    let tsDelta = this.zx81.tStateCount - this.zx81.tStateCountLast;

    let pixelMask = 0x80; // 0b10000000
    for (let istate = 0, ipixel = 0; istate < tsDelta; istate++) {
      // if (this.rgb.pixels !== 0)
      //   console.log(
      //     `${_d(this.rgb.pixels)} | ${_d(this.ulacharline)} | ${_d(this.hsync_counter)} | ${_d(this.rasterX)}, ${_d(this.rasterY)} |  ${_d(this.rasterX - MRGX1)}, ${_d(this.rasterY - MRGY1)}`
      //   );

      // zx81 ula can shift 2 pixels per clock cycle
      for (let i = 0; i < 2; i++, ipixel++) {
        if (this.rgb.pixels & pixelMask) this.plot(this.rgb.fc, this.rgb.fc, this.rgb.fc);
        else this.plot(this.rgb.bc, this.rgb.bc, this.rgb.bc);
        pixelMask >>= 1;
      }

      // Vertical timings
      //                    scanlines    charlines     cycles
      // Upper blanking            56            7      11592
      // Display                  192           24      39744
      // Lower blanking            56            7      11592
      // v Retrace                                       1235 = 380us
      //                                                -----
      //                                                64163 @ 3.25Mhz = 50Hz

      // TV                    | hsync |
      // time                  |  5us  |
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
        // console.log(`hsync_counter (${this.hsync_counter}) > 207, rasterX=${this.rasterX} rasterY=${this.rasterY}`);
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
        // hsync finished
        // if (this.vsync_state == 2) this.vsync_state = 0; // only for z80
        this.hsync_state = 0;
        this.hsync_pending = 0;
      }
      this.sync_signal = this.vsync_state || this.hsync_state ? 0 : 1;
      this.checksync();
    }
  }

  // HSYNC_MINLEN = 8;
  // HSYNC_MAXLEN = 32;
  // HSYNC_TOLERANCEMIN = 414 - 30; // 384
  // HSYNC_TOLERANCEMAX = 414 + 30; // 444
  // MRGX1 = 42;
  // MRGX2 = 362;

  checkhsync(syncLo: boolean) {
    //                 | blank  | 32p bord |    live picture 256 pixels        |  32p bord   |
    // rasterX         0--------42---------74----------------------------------330---------362---384------414-------444
    // hsync_counter   32---------------------------------------------------------------------207-0--------16--------31
    // sync_signal     -------------------------------------------------------------------------------------00000000000
    // sync_len        12+++++++32                                                                          123456789++

    if (
      (!syncLo && this.sync_len >= HSYNC_MINLEN && this.sync_len <= HSYNC_MAXLEN && this.rasterX >= HSYNC_TOLERANCEMIN) ||
      (syncLo && this.rasterX >= HSYNC_TOLERANCEMAX) // hsync finished
    ) {
      this.rasterX = 0;
      this.rasterY++;
    }
  }

  // VSYNC_MINLEN = 170;
  // VSYNC_TOLERANCEMIN = 310 - 100; // 210
  // VSYNC_TOLERANCEMAX = 310 + 100; // 410
  // MRGY1 = 56 - (240 - 192) / 2; // 32
  // MRGY2 = MRGY1 + 240; // 272

  checkvsync(syncLo: boolean) {
    if ((!syncLo && this.sync_len >= VSYNC_MINLEN && this.rasterY >= VSYNC_TOLERANCEMIN) || (syncLo && this.rasterY >= VSYNC_TOLERANCEMAX)) {
      this.rasterY = 0;
      this.frameEnd = true;
    }
  }

  checksync() {
    const startSync = this.sync_signal == 0 && this.sync_last == 1; // sync has gone from high to low
    const inSync = this.sync_signal == 0;
    const endSync = this.sync_signal == 1 && this.sync_last == 0; // sync has gone from low to high

    if (startSync) this.sync_len = 0;

    if (inSync) {
      this.sync_len++;
      this.checkhsync(inSync);
      this.checkvsync(inSync);
    } else {
      if (endSync) {
        this.checkhsync(false);
        this.checkvsync(false);
      }
    }
    this.sync_last = this.sync_signal;
  }

  plot(r: number, g: number, b: number) {
    if (this.rasterX < MRGX1 || this.rasterX >= MRGX2 || this.rasterY < MRGY1 || this.rasterY >= MRGY2) {
      this.rasterX++;
      return;
    }

    let k = (this.rasterY - MRGY1) * 320 + (this.rasterX - MRGX1);
    k *= 4;
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
