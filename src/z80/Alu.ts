import type { RegisterSet } from "./Registers";
import { Z80 } from "./z80";
import utils from "./utils";

export const Flag = {
  C: 0x01, // Carry and borrow
  N: 0x02, // last operation was subtraction
  P: 0x04, // Parity, result has an even number of bits set
  V: 0x04, // Overflow, twos complement does not fit in register
  X3: 0x08, // Undocumented
  H: 0x10, // Half carry, carry from bit 3 to bit 4 during BCD
  X5: 0x20, // Undocumented
  Z: 0x40, // Zero
  S: 0x80, // Negative
};

export class Alu {
  public z80: Z80;
  public readonly sz53Table: number[] = []; // S, Z, 5 and 3 bits of index
  public readonly parityTable: number[] = []; // parity of lookup
  public readonly sz53pTable: number[] = []; // or the above two tables
  halfCarryAddTable = [0, Flag.H, Flag.H, Flag.H, 0, 0, 0, Flag.H];
  halfCarrySubTable = [0, 0, Flag.H, 0, Flag.H, 0, Flag.H, Flag.H];
  overflowAddTable = [0, 0, 0, Flag.V, Flag.V, 0, 0, 0];
  overflowSubTable = [0, Flag.V, 0, 0, 0, 0, Flag.V, 0];

  constructor(z80: Z80) {
    this.z80 = z80;
    for (let i = 0; i < 0x100; i++) {
      this.sz53Table.push(i & (Flag.X3 | Flag.X5 | Flag.S));
      let bits = i;
      let parity = 0;
      for (let bit = 0; bit < 8; bit++) {
        parity ^= bits & 1;
        bits >>= 1;
      }
      this.parityTable.push(parity ? 0 : Flag.P);
      this.sz53pTable.push(this.sz53Table[i] | this.parityTable[i]);
    }

    this.sz53Table[0] |= Flag.Z;
    this.sz53pTable[0] |= Flag.Z;
  }

  get regs(): RegisterSet {
    return this.z80.regs;
  }

  // register shifts

  // Rotate left through carry
  rlc(oldValue: number) {
    const value = ((oldValue << 1) | (oldValue >> 7)) & 0xff;
    this.regs.f = ((oldValue & 0x80) !== 0 ? Flag.C : 0) | this.sz53pTable[value];
    return value;
  }

  // Rotate right through carry
  rrc(oldValue: number) {
    const value = ((oldValue >> 1) | (oldValue << 7)) & 0xff;
    this.regs.f = ((oldValue & 0x01) !== 0 ? Flag.C : 0) | this.sz53pTable[value];
    return value;
  }

  // Rotate left from carry
  rl(oldValue: number) {
    const value = ((oldValue << 1) | ((this.regs.f & Flag.C) !== 0 ? 1 : 0)) & 0xff;
    this.regs.f = ((oldValue & 0x80) !== 0 ? Flag.C : 0) | this.sz53pTable[value];
    return value;
  }

  // Rotate right from carry
  rr(oldValue: number) {
    const value = (oldValue >> 1) | ((this.regs.f & Flag.C) !== 0 ? 0x80 : 0);
    this.regs.f = ((oldValue & 0x01) !== 0 ? Flag.C : 0) | this.sz53pTable[value];
    return value;
  }

  // Shift left arthrimetic
  // Preserves sign
  sla(oldValue: number) {
    const value = (oldValue << 1) & 0xff;
    this.regs.f = ((oldValue & 0x80) !== 0 ? Flag.C : 0) | this.sz53pTable[value];
    return value;
  }

  // Shift right arthrimetic
  sra(oldValue: number) {
    const value = (oldValue & 0x80) | (oldValue >> 1);
    this.regs.f = ((oldValue & 0x01) !== 0 ? Flag.C : 0) | this.sz53pTable[value];
    return value;
  }

  // Shift left logical
  sll(oldValue: number) {
    const value = ((oldValue << 1) | 0x01) & 0xff;
    this.regs.f = ((oldValue & 0x80) !== 0 ? Flag.C : 0) | this.sz53pTable[value];
    return value;
  }

  // Shift right logical
  srl(oldValue: number) {
    const value = oldValue >> 1;
    this.regs.f = ((oldValue & 0x01) !== 0 ? Flag.C : 0) | this.sz53pTable[value];
    return value;
  }

  // bi set

  bit(bitY: number, value: number) {
    let f = (this.regs.f & Flag.C) | Flag.H | (value & (Flag.X3 | Flag.X5));
    if ((value & bitY) === 0) {
      f |= Flag.P | Flag.Z;
    }
    if (bitY == 0x80) {
      if ((value & 0x80) !== 0) {
        f |= Flag.S;
      }
    }
    this.regs.f = f;
  }

  bitHL(bitY: number, value: number) {
    const hiddenValue = utils.hi(this.regs.wz);
    let f = (this.regs.f & Flag.C) | Flag.H | (hiddenValue & (Flag.X3 | Flag.X5));
    if ((value & bitY) === 0) {
      f |= Flag.P | Flag.Z;
    }
    if (bitY == 0x80) {
      if ((value & 0x80) !== 0) {
        f |= Flag.S;
      }
    }
    this.regs.f = f;
  }

  res(y: number, value: number) {
    const mask = 1 << y;
    return value & (~mask & 0xff);
  }

  set(y: number, value: number) {
    return value | (1 << y);
  }

  //

  rlca() {
    const oldA = this.regs.a;
    this.regs.a = ((this.regs.a >> 7) | (this.regs.a << 1)) & 0xff;
    this.regs.f = (this.regs.f & (Flag.P | Flag.Z | Flag.S)) | (this.regs.a & (Flag.X3 | Flag.X5)) | ((oldA & 0x80) !== 0 ? Flag.C : 0);
  }

  rrca() {
    const oldA = this.regs.a;
    this.regs.a = ((this.regs.a >> 1) | (this.regs.a << 7)) & 0xff;
    this.regs.f = (this.regs.f & (Flag.P | Flag.Z | Flag.S)) | (this.regs.a & (Flag.X3 | Flag.X5)) | ((oldA & 0x01) !== 0 ? Flag.C : 0);
  }

  rla() {
    const oldA = this.regs.a;
    this.regs.a = ((this.regs.a << 1) | ((this.regs.f & Flag.C) !== 0 ? 0x01 : 0)) & 0xff;
    this.regs.f = (this.regs.f & (Flag.P | Flag.Z | Flag.S)) | (this.regs.a & (Flag.X3 | Flag.X5)) | ((oldA & 0x80) !== 0 ? Flag.C : 0);
  }

  rra() {
    const oldA = this.regs.a;
    this.regs.a = (this.regs.a >> 1) | ((this.regs.f & Flag.C) !== 0 ? 0x80 : 0);
    this.regs.f = (this.regs.f & (Flag.P | Flag.Z | Flag.S)) | (this.regs.a & (Flag.X3 | Flag.X5)) | ((oldA & 0x01) !== 0 ? Flag.C : 0);
  }

  daa() {
    let value = 0;
    let carry = this.regs.f & Flag.C;
    if ((this.regs.f & Flag.H) !== 0 || (this.regs.a & 0x0f) > 9) {
      value = 6; // Skip over hex digits in lower nybble.
    }
    if (carry !== 0 || this.regs.a > 0x99) {
      value |= 0x60; // Skip over hex digits in upper nybble.
    }
    if (this.regs.a > 0x99) {
      carry = Flag.C;
    }
    if ((this.regs.f & Flag.N) !== 0) {
      const result = utils.sub16(this.regs.a, value);
      const lookup = (((this.regs.a & 0x88) >> 3) | ((value & 0x88) >> 2) | ((result & 0x88) >> 1)) & 0xff;
      this.regs.a = result & 0xff;
      this.regs.f =
        ((result & 0x100) !== 0 ? Flag.C : 0) |
        Flag.N |
        this.halfCarrySubTable[lookup & 0x07] |
        this.overflowSubTable[lookup >> 4] |
        this.sz53Table[this.regs.a];
    } else {
      const result = utils.add16(this.regs.a, value);
      const lookup = (((this.regs.a & 0x88) >> 3) | ((value & 0x88) >> 2) | ((result & 0x88) >> 1)) & 0xff;
      this.regs.a = result & 0xff;
      this.regs.f =
        ((result & 0x100) !== 0 ? Flag.C : 0) |
        this.halfCarryAddTable[lookup & 0x07] |
        this.overflowAddTable[lookup >> 4] |
        this.sz53Table[this.regs.a];
    }
    this.regs.f = (this.regs.f & ~(Flag.C | Flag.P)) | carry | this.parityTable[this.regs.a];
  }

  cpl() {
    this.regs.a ^= 0xff;
    this.regs.f = (this.regs.f & (Flag.C | Flag.P | Flag.Z | Flag.S)) | (this.regs.a & (Flag.X3 | Flag.X5)) | Flag.N | Flag.H;
  }

  scf() {
    this.regs.f = (this.regs.f & (Flag.P | Flag.Z | Flag.S)) | Flag.C | ((this.regs.f | this.regs.a) & (Flag.X3 | Flag.X5));
  }

  ccf() {
    this.regs.f =
      (this.regs.f & (Flag.P | Flag.Z | Flag.S)) |
      ((this.regs.f & Flag.C) !== 0 ? Flag.H : Flag.C) |
      ((this.regs.f | this.regs.a) & (Flag.X3 | Flag.X5));
  }

  add(value: number, carry = false) {
    let result = (this.regs.a + value) & 0xffff;
    if (carry && (this.regs.f & Flag.C) !== 0) result = (result + 1) & 0xffff;
    const lookup = (((this.regs.a & 0x88) >> 3) | ((value & 0x88) >> 2) | ((result & 0x88) >> 1)) & 0xff;
    this.regs.a = result & 0xff;
    this.regs.f =
      ((result & 0x100) !== 0 ? Flag.C : 0) |
      this.halfCarryAddTable[lookup & 0x07] |
      this.overflowAddTable[lookup >> 4] |
      this.sz53Table[this.regs.a];
  }

  adc(value: number) {
    this.add(value, true);
  }

  sub(value: number, carry = false) {
    let result = (this.regs.a - value) & 0xffff;
    if (carry && (this.regs.f & Flag.C) !== 0) result = (result - 1) & 0xffff;
    const lookup = (((this.regs.a & 0x88) >> 3) | ((value & 0x88) >> 2) | ((result & 0x88) >> 1)) & 0xff;
    this.regs.a = result & 0xff;
    this.regs.f =
      ((result & 0x100) !== 0 ? Flag.C : 0) |
      Flag.N |
      this.halfCarrySubTable[lookup & 0x07] |
      this.overflowSubTable[lookup >> 4] |
      this.sz53Table[this.regs.a];
  }

  sbc(value: number) {
    this.sub(value, true);
  }

  and(value: number) {
    this.regs.a &= value;
    this.regs.f = this.sz53pTable[this.regs.a];
    this.regs.f |= Flag.H;
  }

  xor(value: number) {
    this.regs.a ^= value;
    this.regs.f = this.sz53pTable[this.regs.a];
  }

  or(value: number) {
    this.regs.a |= value;
    this.regs.f = this.sz53pTable[this.regs.a];
  }

  cp(value: number) {
    const diff = (this.regs.a - value) & 0xffff;
    const lookup = (((this.regs.a & 0x88) >> 3) | ((value & 0x88) >> 2) | ((diff & 0x88) >> 1)) & 0xff;
    let f = Flag.N;
    if ((diff & 0x100) != 0) f |= Flag.C;
    if (diff == 0) f |= Flag.Z;
    f |= this.halfCarrySubTable[lookup & 0x07];
    f |= this.overflowSubTable[lookup >> 4];
    f |= value & (Flag.X3 | Flag.X5);
    f |= diff & Flag.S;
    this.regs.af = utils.word(this.regs.a, f);
  }

  inc16(value: number) {
    return (value + 1) & 0xffff;
  }

  dec16(value: number) {
    return (value - 1) & 0xffff;
  }

  inc8(value: number) {
    value = (value + 1) & 0xff;
    this.regs.f = (this.regs.f & Flag.C) | (value === 0x80 ? Flag.V : 0) | ((value & 0x0f) !== 0 ? 0 : Flag.H) | this.sz53Table[value];
    return value;
  }

  dec8(value: number) {
    const oldValue = value;
    value = (value - 1) & 0xff;
    this.regs.f =
      (this.regs.f & Flag.C) | (value === 0x7f ? Flag.V : 0) | ((oldValue & 0x0f) !== 0 ? 0 : Flag.H) | Flag.N | this.sz53Table[value];
    return value;
  }

  add16(hlorixy: number, value: number) {
    const result = hlorixy + value;
    const lookup = (((hlorixy & 0x0800) >> 11) | ((value & 0x0800) >> 10) | ((result & 0x0800) >> 9)) & 0xff;
    this.regs.wz = (hlorixy + 1) & 0xffff;
    this.regs.f =
      (this.regs.f & (Flag.V | Flag.Z | Flag.S)) |
      ((result & 0x10000) !== 0 ? Flag.C : 0) |
      ((result >> 8) & (Flag.X3 | Flag.X5)) |
      this.halfCarryAddTable[lookup];
    return result & 0xffff;
  }

  /** hl = hl - value - carry */
  sbc16(value: number) {
    let result = this.regs.hl - value;
    if ((this.regs.f & Flag.C) !== 0) {
      result -= 1;
    }
    const lookup = (((this.z80.regs.hl & 0x8800) >> 11) | ((value & 0x8800) >> 10) | ((result & 0x8800) >> 9)) & 0xff;
    this.regs.wz = utils.inc16(this.regs.hl);
    this.regs.hl = result & 0xffff;
    this.regs.f =
      ((result & 0x10000) !== 0 ? Flag.C : 0) |
      Flag.N |
      this.overflowSubTable[lookup >> 4] |
      ((result >> 8) & (Flag.X3 | Flag.X5 | Flag.S)) |
      this.halfCarrySubTable[lookup & 0x07] |
      (result !== 0 ? 0 : Flag.Z);
  }

  /** hl = hl + value + carry */
  adc16(value: number) {
    let result = this.regs.hl + value;
    if ((this.regs.f & Flag.C) !== 0) {
      result += 1;
    }
    const lookup = (((this.z80.regs.hl & 0x8800) >> 11) | ((value & 0x8800) >> 10) | ((result & 0x8800) >> 9)) & 0xff;
    this.regs.wz = utils.inc16(this.z80.regs.hl);
    this.regs.hl = result & 0xffff;
    this.regs.f =
      ((result & 0x10000) !== 0 ? Flag.C : 0) |
      this.overflowAddTable[lookup >> 4] |
      ((result >> 8) & (Flag.X3 | Flag.X5 | Flag.S)) |
      this.halfCarryAddTable[lookup & 0x07] |
      (result !== 0 ? 0 : Flag.Z);
  }
  in(value: number) {
    this.regs.f = (this.regs.f & Flag.C) | this.sz53pTable[value];
    return value;
  }

  neg8() {
    const value = this.regs.a;
    this.regs.a = 0;
    const diff = utils.sub16(this.regs.a, value);
    const lookup = (((this.regs.a & 0x88) >> 3) | ((value & 0x88) >> 2) | ((diff & 0x88) >> 1)) & 0xff;
    this.regs.a = diff;
    let f = Flag.N;
    if ((diff & 0x100) != 0) f |= Flag.C;
    f |= this.halfCarrySubTable[lookup & 0x07];
    f |= this.overflowSubTable[lookup >> 4];
    f |= this.sz53Table[this.regs.a];
    this.regs.f = f;
  }

  sziff2() {
    this.regs.f = (this.regs.f & Flag.C) | this.sz53Table[this.regs.a] | (this.regs.iff2 ? Flag.V : 0);
  }

  rld(starhl: number) {
    // {A,[HL]}={A,[HL]}<-4
    const res = ((starhl << 4) | (this.regs.a & 0x0f)) & 0xff;
    this.regs.a = (this.regs.a & 0xf0) | (starhl >> 4);
    this.regs.f = (this.regs.f & Flag.C) | this.sz53pTable[this.regs.a];
    return res;
  }

  rrd(starhl: number) {
    // {A,[HL]}=4->{A,[HL]}
    const res = ((this.regs.a << 4) | (starhl >> 4)) & 0xff;
    this.regs.a = (this.regs.a & 0xf0) | (starhl & 0x0f);
    this.regs.f = (this.regs.f & Flag.C) | this.sz53pTable[this.regs.a];
    return res;
  }

  cpi_cpd(value: number) {
    let diff = (this.regs.a - value) & 0xff;
    const lookup = ((this.regs.a & 0x08) >> 3) | ((value & 0x08) >> 2) | ((diff & 0x08) >> 1);
    this.regs.bc = utils.dec16(this.regs.bc);
    this.regs.f =
      (this.regs.f & Flag.C) |
      (this.regs.bc !== 0 ? Flag.V : 0) |
      Flag.N |
      this.halfCarrySubTable[lookup] |
      (diff !== 0 ? 0 : Flag.Z) |
      (diff & Flag.S);
    if ((this.regs.f & Flag.H) !== 0) diff = utils.dec8(diff);
    this.regs.f |= (diff & Flag.X3) | ((diff & 0x02) !== 0 ? Flag.X5 : 0);
    // console.log(
    //   `Starting: a=${this.regs.a.toString(16)}, hl=${(this.regs.hl - 1).toString(16)}, [hl]=${value.toString(16)}, diff=${diff.toString(
    //     16
    //   )}, bc=${this.regs.bc.toString(16)}, cont=${(this.regs.f & (Flag.V | Flag.Z)) === Flag.V}`
    // );
    // console.log(`hl=${this.regs.hl.toString(16)}`);
    return (this.regs.f & (Flag.V | Flag.Z)) === Flag.V;
  }
}
