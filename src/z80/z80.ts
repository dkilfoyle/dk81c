// heavily based off https://github.com/lkesteloot/trs80

import { Alu, Flag } from "./Alu";
import type { Hal } from "./Hal";
import { RegisterSet } from "./Registers";
import utils from "./utils";
import { opcodes } from "./decode";

// interface Operation {
//   name: string;
//   bytes: string;
//   doc?: string;
//   group?: string;
//   fn: (z80: Z80) => void;
// }

export class Z80 {
  public regs = new RegisterSet();
  public alu = new Alu(this);
  public hal: Hal;
  public abus: number;
  public dbus: number;
  public pins: number;
  public PINS = { RETI: 0 }; // TODO

  constructor(hal: Hal) {
    this.hal = hal;
    this.abus = 0;
    this.dbus = 0;
    this.pins = 0;
  }

  reset(registers?: RegisterSet) {
    if (registers) this.regs.clone(registers);
    else this.regs = new RegisterSet();
    this.abus = 0;
    this.dbus = 0;
    this.pins = 0;
  }

  step() {
    this.fetchAndExecuteInstruction();
  }

  incTStateCount(count: number) {
    this.hal.tStateCount += count;
  }

  readByte(address: number) {
    this.incTStateCount(3);
    return this.readByteInternal(address);
  }

  readWord(address: number) {
    // in ram ..... lo hi
    const lowByte = this.readByte(address);
    const highByte = this.readByte(address + 1);
    return utils.word(highByte, lowByte);
  }

  readByteInternal(address: number) {
    return this.hal.readMemory(address);
  }

  writeByte(address: number, value: number) {
    this.incTStateCount(3);
    this.writeByteInternal(address, value);
  }

  writeByteInternal(address: number, value: number) {
    this.hal.writeMemory(address, value);
  }

  readPort(address: number): number {
    this.incTStateCount(1);
    const value = this.hal.readPort(address);
    this.incTStateCount(3);
    return value;
  }

  writePort(address: number, value: number): void {
    this.incTStateCount(1);
    this.hal.writePort(address, value);
    this.incTStateCount(3);
  }

  pushWord(value: number) {
    // stack will become [lo] hi ...... StackBase
    this.pushByte(utils.hi(value));
    this.pushByte(utils.lo(value));
  }

  pushByte(value: number) {
    this.regs.sp = (this.regs.sp - 1) & 0xffff;
    this.writeByte(this.regs.sp, value);
  }

  popWord(): number {
    const lowByte = this.popByte();
    const highByte = this.popByte();
    return utils.word(highByte, lowByte);
  }

  popByte(): number {
    const value = this.readByte(this.regs.sp);
    this.regs.sp = utils.inc16(this.regs.sp);
    return value;
  }

  maskableInterrupt() {
    // inhibit interrupts when iff1 is set (=1)
    if (this.regs.iff1 !== 0) this.interrupt(true);
  }

  nonMaskableInterrupt() {
    // always accept nonmaskable interrupts
    this.interrupt(false);
  }

  private interrupt(maskable: boolean) {
    if (this.regs.halted) {
      this.regs.pc++;
      this.regs.pc &= 0xffff;
      this.regs.halted = 0;
    }

    this.regs.iff1 = 0;

    if (maskable) {
      this.regs.iff2 = 0;
      this.regs.r = (this.regs.r + 1) & 0x7f;
    }

    // push PC onto stack
    this.regs.sp = (this.regs.sp - 1) & 0xffff;
    this.writeByteInternal(this.regs.sp, this.regs.pc >> 8);
    this.regs.sp = (this.regs.sp - 1) & 0xffff;
    this.writeByteInternal(this.regs.sp, this.regs.pc & 0xff);

    if (maskable) {
      switch (this.regs.im) {
        case 0:
        case 1:
          this.regs.pc = 0x0038;
          this.incTStateCount(13);
          break;
        case 2: {
          const address = utils.word(this.regs.i, 0xff);
          this.regs.pc = this.readWord(address);
          break;
        }
        default:
          throw Error("Unknown im mode " + this.regs.im);
      }
    } else {
      // Non-Maskable Interrupt
      // Triggered by NMI pin low
      // Cannot be disabled by programmer
      // Z80 responds by finishing current instruction and then executing restart at $0066
      this.regs.pc = 0x0066;
      this.incTStateCount(11);
    }
  }

  fetchInstruction() {
    this.incTStateCount(4);
    const inst = this.readByteInternal(this.regs.pc);
    this.regs.pc = (this.regs.pc + 1) & 0xffff;
    // if (inst == 0 && this.regs.r == 0b1100111) debugger;
    this.regs.r = (this.regs.r + 1) & 0xff;
    // would be 0x7f for zx81 which increments only the low 7 bits of r
    // however not important for software emulation which doesn't have to refresh ram
    return inst;
  }

  executeInstruction(opcode: number) {
    const op = opcodes.get(opcode);
    if (op == undefined) throw Error(`decodeBASE instruction unknown instruction ${opcode}`);
    op.fn(this);
  }

  fetchAndExecuteInstruction() {
    const inst = this.fetchInstruction();
    this.executeInstruction(inst);
  }

  decodeCB() {
    const inst = this.fetchInstruction();
    const op = opcodes.get((0xcb << 8) | inst);
    if (op == undefined) throw Error(`decodeCB instruction unknown instruction ${inst}`);
    op.fn(this);
  }

  decodeDD() {
    // dd instructions are same as base but with
    // h => ixh
    // l => ixl
    // hl => ix
    // (hl) => (ix+dd)
    const inst = this.fetchInstruction();
    // Look for a defined ddxx instruction if not alias to unprefixed xx
    const op = opcodes.get((0xdd << 8) | inst) || opcodes.get(inst);
    if (op == undefined) throw Error(`decodeDD instruction unknown instruction ${inst}`);
    // this.regs.prefix = 0xdd;
    op.fn(this);
    // this.regs.prefix = 0;
  }

  decodeDDCB() {
    // precalculate wz=(ix+dd)
    this.incTStateCount(3);
    const offset = this.readByteInternal(this.regs.pc);
    this.regs.wz = utils.add16(this.regs.ix, utils.signedByte(offset));
    this.regs.pc = utils.inc16(this.regs.pc);

    // don't use fetchInstruction as not updating refresh register, do manual fetch instead
    // const inst = this.fetchInstruction();
    this.incTStateCount(3);
    const inst = this.readByteInternal(this.regs.pc);
    this.incTStateCount(2);
    this.regs.pc = utils.inc16(this.regs.pc);

    // Look for a defined ddcbxx instruction if not alias to unprefixed xx
    const op = opcodes.get((0xddcb << 8) | inst) || opcodes.get(inst);
    if (op == undefined) throw Error(`decodeDDCB instruction unknown instruction ${inst}`);
    // this.regs.prefix = 0xdd;
    op.fn(this);
    // this.regs.prefix = 0;
  }

  decodeFDCB() {
    // precalculate wz=(iy+dd)
    this.incTStateCount(3);
    const offset = this.readByteInternal(this.regs.pc);
    this.regs.wz = utils.add16(this.regs.iy, utils.signedByte(offset));
    this.regs.pc = utils.inc16(this.regs.pc);

    // don't use fetchInstruction as not updating refresh register, do manual fetch instead
    // const inst = this.fetchInstruction();
    this.incTStateCount(3);
    const inst = this.readByteInternal(this.regs.pc);
    this.incTStateCount(2);
    this.regs.pc = utils.inc16(this.regs.pc);

    // Look for a defined ddcbxx instruction if not alias to unprefixed xx
    const op = opcodes.get((0xfdcb << 8) | inst) || opcodes.get(inst);
    if (op == undefined) throw Error(`decodeDDCB instruction unknown instruction ${inst}`);
    // this.regs.prefix = 0xdd;
    op.fn(this);
    // this.regs.prefix = 0;
  }

  decodeED() {
    const inst = this.fetchInstruction();
    const op = opcodes.get((0xed << 8) | inst);
    if (op == undefined) throw Error(`decodeED instruction unknown instruction ${inst}`);
    op.fn(this);
  }

  decodeFD() {
    const inst = this.fetchInstruction();
    const op = opcodes.get((0xfd << 8) | inst) || opcodes.get(inst);
    if (op == undefined) throw Error(`decodeFD instruction unknown instruction ${inst}`);
    // this.regs.prefix = 0xfd;
    op.fn(this);
    // this.regs.prefix = 0;
  }

  ex_af_af2() {
    const rightValue = this.regs.afPrime;
    this.regs.afPrime = this.regs.af;
    this.regs.af = rightValue;
  }

  ex_de_hl() {
    const rightValue = this.regs.hl;
    this.regs.hl = this.regs.de;
    this.regs.de = rightValue;
  }

  exx() {
    let tmp: number;
    tmp = this.regs.bc;
    this.regs.bc = this.regs.bcPrime;
    this.regs.bcPrime = tmp;
    tmp = this.regs.de;
    this.regs.de = this.regs.dePrime;
    this.regs.dePrime = tmp;
    tmp = this.regs.hl;
    this.regs.hl = this.regs.hlPrime;
    this.regs.hlPrime = tmp;
  }

  ldi_ldd(value: number) {
    value = utils.add16(value, this.regs.a);
    this.regs.bc = utils.dec16(this.regs.bc);
    this.regs.f =
      (this.regs.f & (Flag.C | Flag.Z | Flag.S)) | (this.regs.bc !== 0 ? Flag.V : 0) | (value & Flag.X3) | ((value & 0x02) !== 0 ? Flag.X5 : 0);
    return this.regs.bc;
  }

  ini_ind(value: number, changedC: number) {
    const other = utils.add8(value, changedC);
    this.regs.f =
      (value & 0x80 ? Flag.N : 0) |
      (other < value ? Flag.H | Flag.C : 0) |
      (this.alu.parityTable[(other & 0x07) ^ this.regs.b] ? Flag.P : 0) |
      this.alu.sz53Table[this.regs.b];
    return this.regs.b > 0;
  }
  outi_outd(value: number) {
    const other = utils.add8(value, this.regs.l);
    this.regs.f =
      (value & 0x80 ? Flag.N : 0) |
      (other < value ? Flag.H | Flag.C : 0) |
      (this.alu.parityTable[(other & 0x07) ^ this.regs.b] ? Flag.P : 0) |
      this.alu.sz53Table[this.regs.b];
    return this.regs.b > 0;
  }
}
