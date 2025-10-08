/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-debugger */
// import { printf } from "fast-printf";
import type { Hal } from "../z80/Hal";
import { Z80 } from "../z80/z80";
import { rom } from "./rom";
import { scanCodes } from "./keyboard";
import { symbols } from "./romsymbols";
import { opcodes } from "@/z80/decode";
import { ULA } from "./ula";
import { _b, debugMsg, startTracing } from "./utils";

// Acknowledgements
// jszeddy https://weggetjes.nl/jszeddy/jszeddy.html

// z80 = 0.5 MIPS
// at 50 fps = 500000 / 50 = 10000

// 0        | 0       |
// 0x1fff   | 8192    | ROM
// -------------------------------
// 0x2000   | 8193    |
// 0x3fff   | 16383   | Mirrored ROM
// -------------------------------
// 0x4000   | 16384   | Sys vars
// 0x400c   | 16396   | D_FILE - 16bit address of display file start
//          | 16398   | DF_CC - 16bit address of print position in display file
//          | 16400   | VARS - 16bit address of user variables
// -------------------------------
// 0x407d   | 16509   | Program start
// -------------------------------
//          | D_FILE  | Display file
// -------------------------------
//          | VARS    | User variables
// -------------------------------

const SysVarAddress = {
  D_FILE: 0x400c,
  DF_CC: 16398,
  VARS: 16400,
};

export class ZX81 implements Hal {
  trace = 0;
  traceRuns = 0;
  z80: Z80;
  memory: Uint8Array;
  ula: ULA;
  tStateCount: number;
  tStateMax = 64163;
  pcAtFetch = 0;
  fcounter = 5;
  // screen: ImageData;
  keyboard: Record<number, number> = {
    0xfe: 255,
    0xfd: 255,
    0xfb: 255,
    0xf7: 255,
    0xef: 255,
    0xdf: 255,
    0xbf: 255,
    0x7f: 255,
  };

  NMI_generator: boolean = false;
  int_pending = 0;
  nmi_pending = 0;
  SYNC_signal = 0;
  radj = 0;

  constructor() {
    this.memory = new Uint8Array(65536);
    this.memory.set(rom, 0);
    this.memory.set(rom, 0x2000);
    // patch don't call slow/fast from initialise
    // prevents slow/fast from emitting OUT($FE),A which turns on the NMI
    // zx81 will remain in FAST mode rather than usual DEFAULT SLOW
    this.memory[0x416] = 0;
    this.memory[0x417] = 0;
    this.memory[0x418] = 0;
    /* patch DISPLAY-5 to a return */
    // this.memory[0x02b5 + 0x0000] = 0xc9;
    // this.memory[0x02b5 + 0x2000] = 0xc9;

    /* patch load routine */
    // NEXT-PROG 0x347
    this.memory[0x347] = 0xeb; // ex de,hl
    this.memory[0x348] = 0xed; // ed prefix
    this.memory[0x349] = 0xfc; // edfc unsupported
    this.memory[0x34a] = 0xc3; // jp 0207 = SLOW/FAST
    this.memory[0x34b] = 0x07;
    this.memory[0x34c] = 0x02;

    this.z80 = new Z80(this);
    this.tStateCount = 0;
    this.ula = new ULA(this);
  }

  getSysVar16(name: "D_FILE" | "DF_CC" | "VARS") {
    return this.readMemory(SysVarAddress[name]) | (this.readMemory(SysVarAddress[name] + 1) << 8);
  }

  keydown(key: string) {
    if (key == "BACKSPACE") {
      const shiftCode = scanCodes["SHIFT"];
      const zeroCode = scanCodes["0"];
      this.keyboard[shiftCode.row] &= shiftCode.code;
      this.keyboard[zeroCode.row] &= zeroCode.code;
    } else {
      if (scanCodes[key]) {
        const code = scanCodes[key];
        this.keyboard[code.row] &= code.code;
      }
    }
  }

  keyup(key: string) {
    if (key == "BACKSPACE") {
      const shiftCode = scanCodes["SHIFT"];
      const zeroCode = scanCodes["0"];
      this.keyboard[shiftCode.row] |= ~shiftCode.code;
      this.keyboard[zeroCode.row] |= ~zeroCode.code;
    } else {
      if (scanCodes[key]) {
        const code = scanCodes[key];
        this.keyboard[code.row] |= ~code.code;
      }
    }
  }

  // PAL  = 625 interleaved lines @ 25Hz
  //      = 625 * 25 = 15625 lines/sec
  //      = 64us/line
  // zx81 = 3.25 MHz
  //      = 3,250,000 cycles/sec
  //      / 15625 lines/sec
  //      = 208 cycles/line

  disassemble(pc: number) {
    const mem = this.memory.slice(pc, pc + 5);
    const match = Array.from(opcodes.values()).find((definition) => {
      if (definition.group == "Prefix") return false;
      const bytes = definition.bytes.split(" ");
      for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] != "XX") {
          if (bytes[i] != mem[i].toString(16).padStart(2, "0")) return false;
        }
      }
      return true;
    });
    if (match) {
      let dis = match.name;
      if (dis.includes("$nn")) {
        const firstXX = match.bytes.split(" ").indexOf("XX");
        dis = dis.replace("$nn", "$" + ((mem[firstXX + 1] << 8) + mem[firstXX]).toString(16).padStart(4, "0"));
      }
      if (dis.includes("$n")) {
        const firstXX = match.bytes.split(" ").indexOf("XX");
        if (firstXX == -1) debugger;
        dis = dis.replace("$n", "$" + mem[firstXX].toString(16).padStart(2, "0"));
      }
      return dis;
    }
    debugger;
    return "disassembleNA";
  }

  zx81Fetch(addr: number) {
    this.z80.incTStateCount(4);
    const inst = this.z80.readByteInternal(addr);
    this.z80.regs.pc = (this.z80.regs.pc + 1) & 0xffff;
    this.z80.regs.r = (this.z80.regs.r + 1) & 0x7f;
    return inst;
  }

  frame() {
    this.fcounter--;
    do {
      this.tStateCount = 0;
      this.ula.newFrame();
      this.runUntilFrameEnd();
      // console.log("Frame", this.tStateCount);
    } while (!this.ula.frameEnd);
    if (this.fcounter == 0) {
      self.postMessage({ msg: "screen", msgData: this.ula.imageData });
      this.fcounter = 5;
    }
  }

  runUntilFrameEnd() {
    while ((this.tStateCount == 0 || this.tStateCount < this.tStateMax) && !this.ula.frameEnd) {
      this.pcAtFetch = this.z80.regs.pc;
      const pcSymbol = symbols[this.pcAtFetch.toString(16).padStart(4, "0")];

      // if (this.z80.regs.pc == 0x229) {
      //   // 0x229=DISPLAY-1  0x281=R-IX-1
      //   startTracing(1000, "Start tracing at " + pcSymbol);
      // }

      // if (traceLabels.includes(pcSymbol)) debugMsg(pcSymbol);
      // if (pcSymbol) debugMsg(pcSymbol);

      this.ula.clearCharPixels();

      if (!this.int_pending && !this.nmi_pending) {
        // zx81 custom fetch without increment PC or R yet
        this.tStateCount += 4;
        let opcode = this.readMemory(this.z80.regs.pc & 0x7fff);
        // if reading from DFILE with Bit 15=1 (ie > 49192) then opcode = screen char code
        //  mirror addresses >= 49192 into RAM
        this.radj = this.z80.regs.rCombined;

        // is this a DFILE access
        if (this.z80.regs.pc >= 0xc000) {
          if (!(opcode & 0x40)) {
            // if bit 6 of opcode is 0 then opcode is a charcode
            this.ula.loadCharPixels(opcode);
            // debugMsg(`  charCode ${opcode}`, ` | pixels=${_b(this.ula.rgb.pixels)}`);
            opcode = 0; // mutate opcode to 0 (NOP)
          } else {
            // else it's probably at HLT=118
            // debugMsg(`  Hit HLT`);
            // if so then pc will remain stuck until sync_counter > 207 => interrupt
          }
        }

        // now increment PC and R -> execute instruction
        this.z80.regs.pc++;
        this.z80.regs.pc &= 0xffff;
        this.z80.regs.r = (this.z80.regs.r + 1) & 0x7f;
        this.z80.executeInstruction(opcode);
      } else {
        if (this.int_pending && !this.nmi_pending) {
          this.z80.maskableInterrupt();
          // push pc, jmp 0x38
          // INTERRUPT will jmp to echo display @ 0xc0a7
          // b will be row number (24..1) (0x18..1)
          // c will current scanline 8..1
          // hl will be popped from stack = address of start of row in DFILE with bit15=1 (in DISPLAY-2)
          // r will be 0xde 11011110
          // jmp (hl)
          // if (this.trace) console.log("post interrupt", this.z80.regs.r, this.ula.hsync_counter);
          this.ula.maskableInterrupt();
        }
        if (this.nmi_pending) {
          debugMsg("NMI");
          this.z80.nonMaskableInterrupt(); // push pc, jmp 0x66
        }
      }

      this.int_pending = this.nmi_pending = 0;
      if (!(this.radj & 0x40) && this.z80.regs.iff1) {
        // 0x40 = 01000000
        // Maskable interrupt is triggered when bit 6 of the R register changes from set to reset.
        this.int_pending = 1;
      }

      this.ula.advanceCycles();
      // debugMsg(this.disassemble(pcAtFetch), "  " + (pcSymbol || ""));
      // debugMsg(pcSymbol || "");
    }
  }

  readMemory(address: number) {
    // ram is mirrored at 49k = 49152 = 0xc000
    const a = address < 49152 ? address : address & 0x7fff;
    const value = this.memory[a];
    if (value == undefined) {
      console.error(`Undefined memory at ${address}`);
      return 0;
    }
    return value;
  }

  writeMemory(address: number, value: number) {
    if (address < 0x4000) {
      // console.error(`Attempting to write @${address} which is in ROM, pc=0x${this.z80.regs.pc.toString(16)}`);
      return;
    }
    this.memory[address] = value;
  }

  readPort(address: number): number {
    // console.log(`readPort 0x${address.toString(16)}`);

    if (address == 0x7fef) {
      return ~0x20;
    }

    const loAddress = address & 0xff;
    const hiAddress = address >> 8;

    switch (loAddress) {
      case 0x0f:
      case 0x1f:
        return 0xff;
      case 0x7b:
        console.error("readPort: Attempting to read VDrive", address);
        return hiAddress;
      case 0x5f:
        console.error("readPort: mtmode", address);
        return hiAddress;
      case 0xf5:
        console.error("readPort: beep", address);
        return hiAddress;
      case 0xfb:
        return 0xff;
      case 0xf3:
        console.error("readPort: taperead", address);
        return hiAddress;
      case 0xfe:
        if (!this.NMI_generator) {
          if (this.ula.vsync_state == 0) {
            this.ula.vsync_state = 1;
            this.ula.ulacharline = 0;
          }
        }
        switch (hiAddress) {
          case 0xfe:
          case 0xfd:
          case 0xfb:
          case 0xf7:
          case 0xef:
          case 0xdf:
          case 0xbf:
          case 0x7f:
            return this.keyboard[hiAddress];
          default:
            console.error("readPort: Unknown read keyboard", address);
            return hiAddress;
        }
      default:
        console.error("readPort: Unknown", address);
        return hiAddress;
    }
  }

  writePort(address: number, value: number): void {
    // console.error(`write port [${address}]=${value} not implemented`);
    this.ula.vsync_state = 0;
    if (address == 0x7fef) {
      console.error("writePort: Chroma", address, value);
      return;
    }
    const loAddress = address & 0xff;
    switch (loAddress) {
      case 0x0f:
      case 0x1f:
        console.error("writePort: hand z on x", address, value);
        return;
      case 0xcf:
      case 0xdf:
        console.error("writePort: zxrega", address, value);
        return;
      case 0xf3:
        console.error("writePort: tapewrite", address, value);
        return;
      case 0xfd:
        // console.info(`writePort 0x${address.toString(16).padStart(4, "0")} - NMI_generator <- false`);
        this.NMI_generator = false;
        return;
      case 0xfe:
        // console.info(`writePort 0x${address.toString(16).padStart(4, "0")} - NMI_generator <- true`);
        this.NMI_generator = true;
        return;
      case 0xff:
      case 0x07:
        // do nothing in zx81
        break;
      case 0x27:
      case 0x2f:
      case 0x37:
      case 0x3f:
        console.error("writePort w_ah", address, value);
        return;
    }
  }

  // updateScreen(canvas: CanvasRenderingContext2D) {
  //   // Display File
  //   // CHR$118 (CR)
  //   // 24 rows of 32*(CHR$(0-63|128-191) CHR$118)
  //   // console.log("Drawing screen");

  //   let addr = this.getSysVar16("D_FILE");
  //   // screen is 24 rows of 32 cols
  //   for (let row = 0; row < 24; row++) {
  //     for (let col = 0; col < 32; col++) {
  //       const char = this.readMemory(++addr);
  //       canvas.putImageData(font.get(char)!, col * 8, row * 8);
  //     }
  //     /* skip the 0x76 at the end of the line */
  //     addr++;
  //   }
  // }

  // getScreenImageData() {
  //   let addr = this.getSysVar16("D_FILE");
  //   // screen is 24 rows of 32 cols
  //   const rowstride = 32 * 8 * 4;
  //   for (let row = 0; row < 24; row++) {
  //     for (let col = 0; col < 32; col++) {
  //       let screenOffset = row * rowstride * 8 + col * 8 * 4;
  //       const char = this.readMemory(++addr);
  //       const charImage = font.get(char)!;
  //       for (let fontrow = 0; fontrow < 8; fontrow++) {
  //         const fontoffset = fontrow * 8 * 4;
  //         this.screen.data.set(charImage.data.slice(fontoffset, fontoffset + 8 * 4), screenOffset);
  //         screenOffset += rowstride;
  //       }
  //     }
  //     /* skip the 0x76 at the end of the line */
  //     addr++;
  //   }
  //   return this.screen;
  // }

  loadp(pbytes: Uint8Array) {
    this.memory.set(pbytes, 0x4009);
    const ramtop = (this.memory[0x4005] << 8) | this.memory[0x4004];
    this.z80.regs.sp = ramtop - 4;
    this.memory[0x4002] = this.z80.regs.sp & 0x00ff;
    this.memory[0x4003] = (this.z80.regs.sp & 0xff00) >> 8;
    this.memory[0x4000] = 0xff; // ERR-NR
    this.memory[0x4001] = 0x80; // FLAGS
    this.memory[0x4006] = 0x00; // MODE
    this.memory[0x4007] = 0xfe; //
    this.memory[0x4008] = 0xff; // PPC = 0xfffe
    console.log("Setting pc = 0x207");
    this.z80.regs.pc = 0x0207; // jmp to FAST/SLOW
    this.memory[this.z80.regs.sp] = 0x76; //
    this.memory[this.z80.regs.sp + 1] = 0x06;
    this.memory[this.z80.regs.sp + 2] = 0x00;
    this.memory[this.z80.regs.sp + 3] = 0x3e;
    // stack will be 0x0676 0x3e00
    this.z80.regs.ixh = 0x02;
    this.z80.regs.ixl = 0x81;
    this.z80.regs.iyh = 0x40;
    this.z80.regs.iyl = 0x00;
    this.z80.regs.r = 0xca; // 11001010
  }
}

export const zx81 = new ZX81();
