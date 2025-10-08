/* eslint-disable no-self-assign */
// Generated decoder

import type { Z80 } from "./z80";

interface IOpCodeDefinition {
  name: string;
  bytes: string;
  group: string;
  doc?: string;
  fn: (z80: Z80) => void;
}

export const opcodes = new Map<number, IOpCodeDefinition>();
const add16 = (x: number, y: number) => (x + y) & 0xffff;
const signedByte = (x: number) => (x >= 128 ? x - 256 : x);
const inc16 = (x: number) => (x + 1) & 0xffff;
const dec16 = (x: number) => (x - 1) & 0xffff;
const inc8 = (x: number) => (x + 1) & 0xff;
const dec8 = (x: number) => (x - 1) & 0xff;

// {n:0, x:0, y:0, z:0, p:0, q:0}
// NOP
opcodes.set(0x00, {
  name: "NOP",
  bytes: "00",
  group: "CPU Control",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fn: (z80) => {},
});

// {n:1, x:0, y:0, z:1, p:0, q:0}
// LD $RP,$nn
opcodes.set(0x01, {
  name: "LD bc,$nn",
  bytes: "01 XX XX",
  doc: "bc=nn",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RPL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.c = z80.dbus;
    // mread: {ab: $PC++, dst: $RPH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.b = z80.dbus;
  },
});

// {n:2, x:0, y:0, z:2, p:0, q:0}
// LD (BC),A
opcodes.set(0x02, {
  name: "LD (BC),A",
  bytes: "02",
  doc: "[BC]=A",
  group: "Load 8bit",
  fn: (z80) => {
    // mwrite: {ab: $BC, db: $A, action: "$WZL=$C+1;$WZH=$A;"}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.bc;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.z = inc8(z80.regs.c);
    z80.regs.w = z80.regs.a;
  },
});

// {n:3, x:0, y:0, z:3, p:0, q:0}
// INC $RP
opcodes.set(0x03, {
  name: "INC bc",
  bytes: "03",
  doc: "bc+=1",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.inc16($RP)"}
    z80.incTStateCount(2);
    z80.regs.bc = z80.alu.inc16(z80.regs.bc);
  },
});

// {n:4, x:0, y:0, z:4, p:0, q:0}
// INC $RY
opcodes.set(0x04, {
  name: "INC b",
  bytes: "04",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.b = z80.alu.inc8(z80.regs.b);
  },
});

// {n:5, x:0, y:0, z:5, p:0, q:0}
// DEC $RY
opcodes.set(0x05, {
  name: "DEC b",
  bytes: "05",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.b = z80.alu.dec8(z80.regs.b);
  },
});

// {n:6, x:0, y:0, z:6, p:0, q:0}
// LD $RY,$n
opcodes.set(0x06, {
  name: "LD b,$n",
  bytes: "06 XX",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RY}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.b = z80.dbus;
  },
});

// {n:7, x:0, y:0, z:7, p:0, q:0}
// RLCA
opcodes.set(0x07, {
  name: "RLCA",
  bytes: "07",
  doc: "Fast RLC A",
  group: "ALU Rotate/Shift",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.rlca()"}
    z80.alu.rlca();
  },
});

// {n:8, x:0, y:1, z:0, p:0, q:1}
// EX AF,AFP
opcodes.set(0x08, {
  name: "EX AF,AFP",
  bytes: "08",
  group: "Transfer",
  fn: (z80) => {
    // overlapped: {action: "z80.ex_af_af2()"}
    z80.ex_af_af2();
  },
});

// {n:9, x:0, y:1, z:1, p:0, q:1}
// ADD HL,$RP
opcodes.set(0x09, {
  name: "ADD HL,bc",
  bytes: "09",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$HL=z80.alu.add16($HL, $RP)"}
    z80.incTStateCount(7);
    z80.regs.hl = z80.alu.add16(z80.regs.hl, z80.regs.bc);
  },
});

// {n:10, x:0, y:1, z:2, p:0, q:1}
// LD A,(BC)
opcodes.set(0x0a, {
  name: "LD A,(BC)",
  bytes: "0a",
  doc: "A=[BC]",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $BC, dst: $A, action: "$WZ=$BC+1"}
    z80.abus = z80.regs.bc;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.a = z80.dbus;
    z80.regs.wz = inc16(z80.regs.bc);
  },
});

// {n:11, x:0, y:1, z:3, p:0, q:1}
// DEC $RP
opcodes.set(0x0b, {
  name: "DEC bc",
  bytes: "0b",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.dec16($RP)"}
    z80.incTStateCount(2);
    z80.regs.bc = z80.alu.dec16(z80.regs.bc);
  },
});

// {n:12, x:0, y:1, z:4, p:0, q:1}
// INC $RY
opcodes.set(0x0c, {
  name: "INC c",
  bytes: "0c",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.c = z80.alu.inc8(z80.regs.c);
  },
});

// {n:13, x:0, y:1, z:5, p:0, q:1}
// DEC $RY
opcodes.set(0x0d, {
  name: "DEC c",
  bytes: "0d",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.c = z80.alu.dec8(z80.regs.c);
  },
});

// {n:14, x:0, y:1, z:6, p:0, q:1}
// LD $RY,$n
opcodes.set(0x0e, {
  name: "LD c,$n",
  bytes: "0e XX",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RY}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.c = z80.dbus;
  },
});

// {n:15, x:0, y:1, z:7, p:0, q:1}
// RRCA
opcodes.set(0x0f, {
  name: "RRCA",
  bytes: "0f",
  doc: "Fast RRC A",
  group: "ALU Rotate/Shift",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.rrca()"}
    z80.alu.rrca();
  },
});

// {n:16, x:0, y:2, z:0, p:1, q:0}
// DJNZ $n
opcodes.set(0x10, {
  name: "DJNZ $n",
  bytes: "10 XX",
  doc: "B=B-1, if B != 0 then PC+=n",
  group: "Control flow",
  fn: (z80) => {
    // generic: {tcycles: 1, action: "$B=dec8($B)"}
    z80.incTStateCount(1);
    z80.regs.b = dec8(z80.regs.b);
    // generic: {tcycles: 0, if: "$B!==0", action: "$DLATCH=z80.readByte($PC); $T+=5; $PC=add16($PC, signedByte($DLATCH)); $PC=inc16($PC); $WZ=$PC", else: "$T+=3; $PC=inc16($PC);"}
    z80.incTStateCount(0);
    if (z80.regs.b !== 0) {
      z80.dbus = z80.readByte(z80.regs.pc);
      z80.hal.tStateCount += 5;
      z80.regs.pc = add16(z80.regs.pc, signedByte(z80.dbus));
      z80.regs.pc = inc16(z80.regs.pc);
      z80.regs.wz = z80.regs.pc;
    } else {
      z80.hal.tStateCount += 3;
      z80.regs.pc = inc16(z80.regs.pc);
    }
  },
});

// {n:17, x:0, y:2, z:1, p:1, q:0}
// LD $RP,$nn
opcodes.set(0x11, {
  name: "LD de,$nn",
  bytes: "11 XX XX",
  doc: "de=nn",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RPL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.e = z80.dbus;
    // mread: {ab: $PC++, dst: $RPH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.d = z80.dbus;
  },
});

// {n:18, x:0, y:2, z:2, p:1, q:0}
// LD (DE),A
opcodes.set(0x12, {
  name: "LD (DE),A",
  bytes: "12",
  doc: "[DE]=A",
  group: "Load 8bit",
  fn: (z80) => {
    // mwrite: {ab: $DE, db: $A, action: "$WZL=$E+1;$WZH=$A;"}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.de;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.z = z80.regs.e + 1;
    z80.regs.w = z80.regs.a;
  },
});

// {n:19, x:0, y:2, z:3, p:1, q:0}
// INC $RP
opcodes.set(0x13, {
  name: "INC de",
  bytes: "13",
  doc: "de+=1",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.inc16($RP)"}
    z80.incTStateCount(2);
    z80.regs.de = z80.alu.inc16(z80.regs.de);
  },
});

// {n:20, x:0, y:2, z:4, p:1, q:0}
// INC $RY
opcodes.set(0x14, {
  name: "INC d",
  bytes: "14",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.d = z80.alu.inc8(z80.regs.d);
  },
});

// {n:21, x:0, y:2, z:5, p:1, q:0}
// DEC $RY
opcodes.set(0x15, {
  name: "DEC d",
  bytes: "15",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.d = z80.alu.dec8(z80.regs.d);
  },
});

// {n:22, x:0, y:2, z:6, p:1, q:0}
// LD $RY,$n
opcodes.set(0x16, {
  name: "LD d,$n",
  bytes: "16 XX",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RY}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.d = z80.dbus;
  },
});

// {n:23, x:0, y:2, z:7, p:1, q:0}
// RLA
opcodes.set(0x17, {
  name: "RLA",
  bytes: "17",
  doc: "Fast RL A",
  group: "ALU Rotate/Shift",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.rla()"}
    z80.alu.rla();
  },
});

// {n:24, x:0, y:3, z:0, p:1, q:1}
// JR $n
opcodes.set(0x18, {
  name: "JR $n",
  bytes: "18 XX",
  doc: "PC=PC+n",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // generic: {tcycles: 5, action: "$PC+=$DLATCH;$WZ=$PC;"}
    z80.incTStateCount(5);
    z80.regs.pc = add16(z80.regs.pc, signedByte(z80.dbus));
    z80.regs.wz = z80.regs.pc;
  },
});

// {n:25, x:0, y:3, z:1, p:1, q:1}
// ADD HL,$RP
opcodes.set(0x19, {
  name: "ADD HL,de",
  bytes: "19",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$HL=z80.alu.add16($HL, $RP)"}
    z80.incTStateCount(7);
    z80.regs.hl = z80.alu.add16(z80.regs.hl, z80.regs.de);
  },
});

// {n:26, x:0, y:3, z:2, p:1, q:1}
// LD A,(DE)
opcodes.set(0x1a, {
  name: "LD A,(DE)",
  bytes: "1a",
  doc: "A=[DE]",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $DE, dst: $A, action: "$WZ=$DE+1"}
    z80.abus = z80.regs.de;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.a = z80.dbus;
    z80.regs.wz = z80.regs.de + 1;
  },
});

// {n:27, x:0, y:3, z:3, p:1, q:1}
// DEC $RP
opcodes.set(0x1b, {
  name: "DEC de",
  bytes: "1b",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.dec16($RP)"}
    z80.incTStateCount(2);
    z80.regs.de = z80.alu.dec16(z80.regs.de);
  },
});

// {n:28, x:0, y:3, z:4, p:1, q:1}
// INC $RY
opcodes.set(0x1c, {
  name: "INC e",
  bytes: "1c",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.e = z80.alu.inc8(z80.regs.e);
  },
});

// {n:29, x:0, y:3, z:5, p:1, q:1}
// DEC $RY
opcodes.set(0x1d, {
  name: "DEC e",
  bytes: "1d",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.e = z80.alu.dec8(z80.regs.e);
  },
});

// {n:30, x:0, y:3, z:6, p:1, q:1}
// LD $RY,$n
opcodes.set(0x1e, {
  name: "LD e,$n",
  bytes: "1e XX",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RY}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.e = z80.dbus;
  },
});

// {n:31, x:0, y:3, z:7, p:1, q:1}
// RRA
opcodes.set(0x1f, {
  name: "RRA",
  bytes: "1f",
  doc: "Fast RR A",
  group: "ALU Rotate/Shift",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.rra()"}
    z80.alu.rra();
  },
});

// {n:32, x:0, y:4, z:0, p:2, q:0}
// JR $CC-4,$n
opcodes.set(0x20, {
  name: "JR NZ,$n",
  bytes: "20 XX",
  doc: "if NZ then PC=PC+n",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH, if: "$CC-4", action: "$PC+=$DLATCH;$WZ=$PC;$T+=5"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    if (z80.regs.condNZ) {
      z80.regs.pc = add16(z80.regs.pc, signedByte(z80.dbus));
      z80.regs.wz = z80.regs.pc;
      z80.hal.tStateCount += 5;
    }
  },
});

// {n:33, x:0, y:4, z:1, p:2, q:0}
// LD $RP,$nn
opcodes.set(0x21, {
  name: "LD hl,$nn",
  bytes: "21 XX XX",
  doc: "hl=nn",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RPL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.l = z80.dbus;
    // mread: {ab: $PC++, dst: $RPH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.h = z80.dbus;
  },
});

// {n:34, x:0, y:4, z:2, p:2, q:0}
// LD ($nn),HL
opcodes.set(0x22, {
  name: "LD ($nn),HL",
  bytes: "22 XX XX",
  doc: "[nn]=HL",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mwrite: {ab: $WZ++, db: $L}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: $WZ, db: $H}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:35, x:0, y:4, z:3, p:2, q:0}
// INC $RP
opcodes.set(0x23, {
  name: "INC hl",
  bytes: "23",
  doc: "hl+=1",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.inc16($RP)"}
    z80.incTStateCount(2);
    z80.regs.hl = z80.alu.inc16(z80.regs.hl);
  },
});

// {n:36, x:0, y:4, z:4, p:2, q:0}
// INC $RY
opcodes.set(0x24, {
  name: "INC h",
  bytes: "24",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.h = z80.alu.inc8(z80.regs.h);
  },
});

// {n:37, x:0, y:4, z:5, p:2, q:0}
// DEC $RY
opcodes.set(0x25, {
  name: "DEC h",
  bytes: "25",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.h = z80.alu.dec8(z80.regs.h);
  },
});

// {n:38, x:0, y:4, z:6, p:2, q:0}
// LD $RY,$n
opcodes.set(0x26, {
  name: "LD h,$n",
  bytes: "26 XX",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RY}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.h = z80.dbus;
  },
});

// {n:39, x:0, y:4, z:7, p:2, q:0}
// DAA
opcodes.set(0x27, {
  name: "DAA",
  bytes: "27",
  doc: "Convert A to BCD",
  group: "ALU General",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.daa()"}
    z80.alu.daa();
  },
});

// {n:40, x:0, y:5, z:0, p:2, q:1}
// JR $CC-4,$n
opcodes.set(0x28, {
  name: "JR Z,$n",
  bytes: "28 XX",
  doc: "if Z then PC=PC+n",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH, if: "$CC-4", action: "$PC+=$DLATCH;$WZ=$PC;$T+=5"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    if (z80.regs.condZ) {
      z80.regs.pc = add16(z80.regs.pc, signedByte(z80.dbus));
      z80.regs.wz = z80.regs.pc;
      z80.hal.tStateCount += 5;
    }
  },
});

// {n:41, x:0, y:5, z:1, p:2, q:1}
// ADD HL,$RP
opcodes.set(0x29, {
  name: "ADD HL,hl",
  bytes: "29",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$HL=z80.alu.add16($HL, $RP)"}
    z80.incTStateCount(7);
    z80.regs.hl = z80.alu.add16(z80.regs.hl, z80.regs.hl);
  },
});

// {n:42, x:0, y:5, z:2, p:2, q:1}
// LD HL,($nn)
opcodes.set(0x2a, {
  name: "LD HL,($nn)",
  bytes: "2a XX XX",
  doc: "HL=[nn]",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mread: {ab: $WZ++, dst: $L}
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.l = z80.dbus;
    // mread: {ab: $WZ, dst: $H}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.h = z80.dbus;
  },
});

// {n:43, x:0, y:5, z:3, p:2, q:1}
// DEC $RP
opcodes.set(0x2b, {
  name: "DEC hl",
  bytes: "2b",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.dec16($RP)"}
    z80.incTStateCount(2);
    z80.regs.hl = z80.alu.dec16(z80.regs.hl);
  },
});

// {n:44, x:0, y:5, z:4, p:2, q:1}
// INC $RY
opcodes.set(0x2c, {
  name: "INC l",
  bytes: "2c",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.l = z80.alu.inc8(z80.regs.l);
  },
});

// {n:45, x:0, y:5, z:5, p:2, q:1}
// DEC $RY
opcodes.set(0x2d, {
  name: "DEC l",
  bytes: "2d",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.l = z80.alu.dec8(z80.regs.l);
  },
});

// {n:46, x:0, y:5, z:6, p:2, q:1}
// LD $RY,$n
opcodes.set(0x2e, {
  name: "LD l,$n",
  bytes: "2e XX",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RY}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.l = z80.dbus;
  },
});

// {n:47, x:0, y:5, z:7, p:2, q:1}
// CPL
opcodes.set(0x2f, {
  name: "CPL",
  bytes: "2f",
  doc: "Invert all bits of A",
  group: "ALU General",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.cpl()"}
    z80.alu.cpl();
  },
});

// {n:48, x:0, y:6, z:0, p:3, q:0}
// JR $CC-4,$n
opcodes.set(0x30, {
  name: "JR NC,$n",
  bytes: "30 XX",
  doc: "if NC then PC=PC+n",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH, if: "$CC-4", action: "$PC+=$DLATCH;$WZ=$PC;$T+=5"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    if (z80.regs.condNC) {
      z80.regs.pc = add16(z80.regs.pc, signedByte(z80.dbus));
      z80.regs.wz = z80.regs.pc;
      z80.hal.tStateCount += 5;
    }
  },
});

// {n:49, x:0, y:6, z:1, p:3, q:0}
// LD $RP,$nn
opcodes.set(0x31, {
  name: "LD sp,$nn",
  bytes: "31 XX XX",
  doc: "sp=nn",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RPL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.spl = z80.dbus;
    // mread: {ab: $PC++, dst: $RPH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.sph = z80.dbus;
  },
});

// {n:50, x:0, y:6, z:2, p:3, q:0}
// LD ($nn),A
opcodes.set(0x32, {
  name: "LD ($nn),A",
  bytes: "32 XX XX",
  doc: "[nn]=A",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mwrite: {ab: $WZ++, db: $A, action: "$WZH=$A"}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.w = z80.regs.a;
  },
});

// {n:51, x:0, y:6, z:3, p:3, q:0}
// INC $RP
opcodes.set(0x33, {
  name: "INC sp",
  bytes: "33",
  doc: "sp+=1",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.inc16($RP)"}
    z80.incTStateCount(2);
    z80.regs.sp = z80.alu.inc16(z80.regs.sp);
  },
});

// {n:52, x:0, y:6, z:4, p:3, q:0}
// INC (HL)
opcodes.set(0x34, {
  name: "INC (HL)",
  bytes: "34",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $ADDR, dst: $DLATCH, action: "$DLATCH=z80.alu.inc8($DLATCH)"}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.dbus = z80.alu.inc8(z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:53, x:0, y:6, z:5, p:3, q:0}
// DEC (HL)
opcodes.set(0x35, {
  name: "DEC (HL)",
  bytes: "35",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $ADDR, dst: $DLATCH, action: "$DLATCH=z80.alu.dec8($DLATCH)"}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.dbus = z80.alu.dec8(z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:54, x:0, y:6, z:6, p:3, q:0}
// LD (HL),$n
opcodes.set(0x36, {
  name: "LD (HL),$n",
  bytes: "36 XX",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:55, x:0, y:6, z:7, p:3, q:0}
// SCF
opcodes.set(0x37, {
  name: "SCF",
  bytes: "37",
  doc: "Set Carry, clear H and N",
  group: "ALU General",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.scf()"}
    z80.alu.scf();
  },
});

// {n:56, x:0, y:7, z:0, p:3, q:1}
// JR $CC-4,$n
opcodes.set(0x38, {
  name: "JR C,$n",
  bytes: "38 XX",
  doc: "if C then PC=PC+n",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH, if: "$CC-4", action: "$PC+=$DLATCH;$WZ=$PC;$T+=5"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    if (z80.regs.condC) {
      z80.regs.pc = add16(z80.regs.pc, signedByte(z80.dbus));
      z80.regs.wz = z80.regs.pc;
      z80.hal.tStateCount += 5;
    }
  },
});

// {n:57, x:0, y:7, z:1, p:3, q:1}
// ADD HL,$RP
opcodes.set(0x39, {
  name: "ADD HL,sp",
  bytes: "39",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$HL=z80.alu.add16($HL, $RP)"}
    z80.incTStateCount(7);
    z80.regs.hl = z80.alu.add16(z80.regs.hl, z80.regs.sp);
  },
});

// {n:58, x:0, y:7, z:2, p:3, q:1}
// LD A,($nn)
opcodes.set(0x3a, {
  name: "LD A,($nn)",
  bytes: "3a XX XX",
  doc: "A=[nn]",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mread: {ab: $WZ++, dst: $A}
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.a = z80.dbus;
  },
});

// {n:59, x:0, y:7, z:3, p:3, q:1}
// DEC $RP
opcodes.set(0x3b, {
  name: "DEC sp",
  bytes: "3b",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.dec16($RP)"}
    z80.incTStateCount(2);
    z80.regs.sp = z80.alu.dec16(z80.regs.sp);
  },
});

// {n:60, x:0, y:7, z:4, p:3, q:1}
// INC $RY
opcodes.set(0x3c, {
  name: "INC a",
  bytes: "3c",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.a = z80.alu.inc8(z80.regs.a);
  },
});

// {n:61, x:0, y:7, z:5, p:3, q:1}
// DEC $RY
opcodes.set(0x3d, {
  name: "DEC a",
  bytes: "3d",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.a = z80.alu.dec8(z80.regs.a);
  },
});

// {n:62, x:0, y:7, z:6, p:3, q:1}
// LD $RY,$n
opcodes.set(0x3e, {
  name: "LD a,$n",
  bytes: "3e XX",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RY}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.a = z80.dbus;
  },
});

// {n:63, x:0, y:7, z:7, p:3, q:1}
// CCF
opcodes.set(0x3f, {
  name: "CCF",
  bytes: "3f",
  doc: "Invert Carry, invert H, clear N",
  group: "ALU General",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.ccf()"}
    z80.alu.ccf();
  },
});

// {n:64, x:1, y:0, z:0, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0x40, {
  name: "LD b,b",
  bytes: "40",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.b;
  },
});

// {n:65, x:1, y:0, z:1, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0x41, {
  name: "LD b,c",
  bytes: "41",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.c;
  },
});

// {n:66, x:1, y:0, z:2, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0x42, {
  name: "LD b,d",
  bytes: "42",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.d;
  },
});

// {n:67, x:1, y:0, z:3, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0x43, {
  name: "LD b,e",
  bytes: "43",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.e;
  },
});

// {n:68, x:1, y:0, z:4, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0x44, {
  name: "LD b,h",
  bytes: "44",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.h;
  },
});

// {n:69, x:1, y:0, z:5, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0x45, {
  name: "LD b,l",
  bytes: "45",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.l;
  },
});

// {n:70, x:1, y:0, z:6, p:0, q:0}
// LD $RY,(HL)
opcodes.set(0x46, {
  name: "LD b,(HL)",
  bytes: "46",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $RY}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.b = z80.dbus;
  },
});

// {n:71, x:1, y:0, z:7, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0x47, {
  name: "LD b,a",
  bytes: "47",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.a;
  },
});

// {n:72, x:1, y:1, z:0, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0x48, {
  name: "LD c,b",
  bytes: "48",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.b;
  },
});

// {n:73, x:1, y:1, z:1, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0x49, {
  name: "LD c,c",
  bytes: "49",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.c;
  },
});

// {n:74, x:1, y:1, z:2, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0x4a, {
  name: "LD c,d",
  bytes: "4a",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.d;
  },
});

// {n:75, x:1, y:1, z:3, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0x4b, {
  name: "LD c,e",
  bytes: "4b",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.e;
  },
});

// {n:76, x:1, y:1, z:4, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0x4c, {
  name: "LD c,h",
  bytes: "4c",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.h;
  },
});

// {n:77, x:1, y:1, z:5, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0x4d, {
  name: "LD c,l",
  bytes: "4d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.l;
  },
});

// {n:78, x:1, y:1, z:6, p:0, q:1}
// LD $RY,(HL)
opcodes.set(0x4e, {
  name: "LD c,(HL)",
  bytes: "4e",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $RY}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.c = z80.dbus;
  },
});

// {n:79, x:1, y:1, z:7, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0x4f, {
  name: "LD c,a",
  bytes: "4f",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.a;
  },
});

// {n:80, x:1, y:2, z:0, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0x50, {
  name: "LD d,b",
  bytes: "50",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.b;
  },
});

// {n:81, x:1, y:2, z:1, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0x51, {
  name: "LD d,c",
  bytes: "51",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.c;
  },
});

// {n:82, x:1, y:2, z:2, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0x52, {
  name: "LD d,d",
  bytes: "52",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.d;
  },
});

// {n:83, x:1, y:2, z:3, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0x53, {
  name: "LD d,e",
  bytes: "53",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.e;
  },
});

// {n:84, x:1, y:2, z:4, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0x54, {
  name: "LD d,h",
  bytes: "54",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.h;
  },
});

// {n:85, x:1, y:2, z:5, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0x55, {
  name: "LD d,l",
  bytes: "55",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.l;
  },
});

// {n:86, x:1, y:2, z:6, p:1, q:0}
// LD $RY,(HL)
opcodes.set(0x56, {
  name: "LD d,(HL)",
  bytes: "56",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $RY}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.d = z80.dbus;
  },
});

// {n:87, x:1, y:2, z:7, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0x57, {
  name: "LD d,a",
  bytes: "57",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.a;
  },
});

// {n:88, x:1, y:3, z:0, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0x58, {
  name: "LD e,b",
  bytes: "58",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.b;
  },
});

// {n:89, x:1, y:3, z:1, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0x59, {
  name: "LD e,c",
  bytes: "59",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.c;
  },
});

// {n:90, x:1, y:3, z:2, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0x5a, {
  name: "LD e,d",
  bytes: "5a",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.d;
  },
});

// {n:91, x:1, y:3, z:3, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0x5b, {
  name: "LD e,e",
  bytes: "5b",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.e;
  },
});

// {n:92, x:1, y:3, z:4, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0x5c, {
  name: "LD e,h",
  bytes: "5c",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.h;
  },
});

// {n:93, x:1, y:3, z:5, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0x5d, {
  name: "LD e,l",
  bytes: "5d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.l;
  },
});

// {n:94, x:1, y:3, z:6, p:1, q:1}
// LD $RY,(HL)
opcodes.set(0x5e, {
  name: "LD e,(HL)",
  bytes: "5e",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $RY}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.e = z80.dbus;
  },
});

// {n:95, x:1, y:3, z:7, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0x5f, {
  name: "LD e,a",
  bytes: "5f",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.a;
  },
});

// {n:96, x:1, y:4, z:0, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0x60, {
  name: "LD h,b",
  bytes: "60",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.h = z80.regs.b;
  },
});

// {n:97, x:1, y:4, z:1, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0x61, {
  name: "LD h,c",
  bytes: "61",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.h = z80.regs.c;
  },
});

// {n:98, x:1, y:4, z:2, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0x62, {
  name: "LD h,d",
  bytes: "62",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.h = z80.regs.d;
  },
});

// {n:99, x:1, y:4, z:3, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0x63, {
  name: "LD h,e",
  bytes: "63",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.h = z80.regs.e;
  },
});

// {n:100, x:1, y:4, z:4, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0x64, {
  name: "LD h,h",
  bytes: "64",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.h = z80.regs.h;
  },
});

// {n:101, x:1, y:4, z:5, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0x65, {
  name: "LD h,l",
  bytes: "65",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.h = z80.regs.l;
  },
});

// {n:102, x:1, y:4, z:6, p:2, q:0}
// LD $RY,(HL)
opcodes.set(0x66, {
  name: "LD h,(HL)",
  bytes: "66",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $RY}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.h = z80.dbus;
  },
});

// {n:103, x:1, y:4, z:7, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0x67, {
  name: "LD h,a",
  bytes: "67",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.h = z80.regs.a;
  },
});

// {n:104, x:1, y:5, z:0, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0x68, {
  name: "LD l,b",
  bytes: "68",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.l = z80.regs.b;
  },
});

// {n:105, x:1, y:5, z:1, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0x69, {
  name: "LD l,c",
  bytes: "69",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.l = z80.regs.c;
  },
});

// {n:106, x:1, y:5, z:2, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0x6a, {
  name: "LD l,d",
  bytes: "6a",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.l = z80.regs.d;
  },
});

// {n:107, x:1, y:5, z:3, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0x6b, {
  name: "LD l,e",
  bytes: "6b",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.l = z80.regs.e;
  },
});

// {n:108, x:1, y:5, z:4, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0x6c, {
  name: "LD l,h",
  bytes: "6c",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.l = z80.regs.h;
  },
});

// {n:109, x:1, y:5, z:5, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0x6d, {
  name: "LD l,l",
  bytes: "6d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.l = z80.regs.l;
  },
});

// {n:110, x:1, y:5, z:6, p:2, q:1}
// LD $RY,(HL)
opcodes.set(0x6e, {
  name: "LD l,(HL)",
  bytes: "6e",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $RY}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.l = z80.dbus;
  },
});

// {n:111, x:1, y:5, z:7, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0x6f, {
  name: "LD l,a",
  bytes: "6f",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.l = z80.regs.a;
  },
});

// {n:112, x:1, y:6, z:0, p:3, q:0}
// LD (HL),$RZ
opcodes.set(0x70, {
  name: "LD (HL),b",
  bytes: "70",
  group: "Load 8bit",
  fn: (z80) => {
    // mwrite: {ab: $ADDR, db: $RZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:113, x:1, y:6, z:1, p:3, q:0}
// LD (HL),$RZ
opcodes.set(0x71, {
  name: "LD (HL),c",
  bytes: "71",
  group: "Load 8bit",
  fn: (z80) => {
    // mwrite: {ab: $ADDR, db: $RZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:114, x:1, y:6, z:2, p:3, q:0}
// LD (HL),$RZ
opcodes.set(0x72, {
  name: "LD (HL),d",
  bytes: "72",
  group: "Load 8bit",
  fn: (z80) => {
    // mwrite: {ab: $ADDR, db: $RZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:115, x:1, y:6, z:3, p:3, q:0}
// LD (HL),$RZ
opcodes.set(0x73, {
  name: "LD (HL),e",
  bytes: "73",
  group: "Load 8bit",
  fn: (z80) => {
    // mwrite: {ab: $ADDR, db: $RZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:116, x:1, y:6, z:4, p:3, q:0}
// LD (HL),$RZ
opcodes.set(0x74, {
  name: "LD (HL),h",
  bytes: "74",
  group: "Load 8bit",
  fn: (z80) => {
    // mwrite: {ab: $ADDR, db: $RZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:117, x:1, y:6, z:5, p:3, q:0}
// LD (HL),$RZ
opcodes.set(0x75, {
  name: "LD (HL),l",
  bytes: "75",
  group: "Load 8bit",
  fn: (z80) => {
    // mwrite: {ab: $ADDR, db: $RZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:118, x:1, y:6, z:6, p:3, q:0}
// HALT
opcodes.set(0x76, {
  name: "HALT",
  bytes: "76",
  group: "CPU Control",
  fn: (z80) => {
    // overlapped: {action: "z80.regs.halted=1;$PC--;"}
    z80.regs.halted = 1;
    z80.regs.pc--;
  },
});

// {n:119, x:1, y:6, z:7, p:3, q:0}
// LD (HL),$RZ
opcodes.set(0x77, {
  name: "LD (HL),a",
  bytes: "77",
  group: "Load 8bit",
  fn: (z80) => {
    // mwrite: {ab: $ADDR, db: $RZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:120, x:1, y:7, z:0, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0x78, {
  name: "LD a,b",
  bytes: "78",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.b;
  },
});

// {n:121, x:1, y:7, z:1, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0x79, {
  name: "LD a,c",
  bytes: "79",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.c;
  },
});

// {n:122, x:1, y:7, z:2, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0x7a, {
  name: "LD a,d",
  bytes: "7a",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.d;
  },
});

// {n:123, x:1, y:7, z:3, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0x7b, {
  name: "LD a,e",
  bytes: "7b",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.e;
  },
});

// {n:124, x:1, y:7, z:4, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0x7c, {
  name: "LD a,h",
  bytes: "7c",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.h;
  },
});

// {n:125, x:1, y:7, z:5, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0x7d, {
  name: "LD a,l",
  bytes: "7d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.l;
  },
});

// {n:126, x:1, y:7, z:6, p:3, q:1}
// LD $RY,(HL)
opcodes.set(0x7e, {
  name: "LD a,(HL)",
  bytes: "7e",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $RY}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.a = z80.dbus;
  },
});

// {n:127, x:1, y:7, z:7, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0x7f, {
  name: "LD a,a",
  bytes: "7f",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.a;
  },
});

// {n:128, x:2, y:0, z:0, p:0, q:0}
// $ALU $RZ
opcodes.set(0x80, {
  name: "add8 b",
  bytes: "80",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add8(z80.regs.b);
  },
});

// {n:129, x:2, y:0, z:1, p:0, q:0}
// $ALU $RZ
opcodes.set(0x81, {
  name: "add8 c",
  bytes: "81",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add8(z80.regs.c);
  },
});

// {n:130, x:2, y:0, z:2, p:0, q:0}
// $ALU $RZ
opcodes.set(0x82, {
  name: "add8 d",
  bytes: "82",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add8(z80.regs.d);
  },
});

// {n:131, x:2, y:0, z:3, p:0, q:0}
// $ALU $RZ
opcodes.set(0x83, {
  name: "add8 e",
  bytes: "83",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add8(z80.regs.e);
  },
});

// {n:132, x:2, y:0, z:4, p:0, q:0}
// $ALU $RZ
opcodes.set(0x84, {
  name: "add8 h",
  bytes: "84",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add8(z80.regs.h);
  },
});

// {n:133, x:2, y:0, z:5, p:0, q:0}
// $ALU $RZ
opcodes.set(0x85, {
  name: "add8 l",
  bytes: "85",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add8(z80.regs.l);
  },
});

// {n:134, x:2, y:0, z:6, p:0, q:0}
// $ALU (HL)
opcodes.set(0x86, {
  name: "add8 (HL)",
  bytes: "86",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.add8(z80.dbus);
  },
});

// {n:135, x:2, y:0, z:7, p:0, q:0}
// $ALU $RZ
opcodes.set(0x87, {
  name: "add8 a",
  bytes: "87",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add8(z80.regs.a);
  },
});

// {n:136, x:2, y:1, z:0, p:0, q:1}
// $ALU $RZ
opcodes.set(0x88, {
  name: "adc8 b",
  bytes: "88",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc8(z80.regs.b);
  },
});

// {n:137, x:2, y:1, z:1, p:0, q:1}
// $ALU $RZ
opcodes.set(0x89, {
  name: "adc8 c",
  bytes: "89",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc8(z80.regs.c);
  },
});

// {n:138, x:2, y:1, z:2, p:0, q:1}
// $ALU $RZ
opcodes.set(0x8a, {
  name: "adc8 d",
  bytes: "8a",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc8(z80.regs.d);
  },
});

// {n:139, x:2, y:1, z:3, p:0, q:1}
// $ALU $RZ
opcodes.set(0x8b, {
  name: "adc8 e",
  bytes: "8b",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc8(z80.regs.e);
  },
});

// {n:140, x:2, y:1, z:4, p:0, q:1}
// $ALU $RZ
opcodes.set(0x8c, {
  name: "adc8 h",
  bytes: "8c",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc8(z80.regs.h);
  },
});

// {n:141, x:2, y:1, z:5, p:0, q:1}
// $ALU $RZ
opcodes.set(0x8d, {
  name: "adc8 l",
  bytes: "8d",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc8(z80.regs.l);
  },
});

// {n:142, x:2, y:1, z:6, p:0, q:1}
// $ALU (HL)
opcodes.set(0x8e, {
  name: "adc8 (HL)",
  bytes: "8e",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.adc8(z80.dbus);
  },
});

// {n:143, x:2, y:1, z:7, p:0, q:1}
// $ALU $RZ
opcodes.set(0x8f, {
  name: "adc8 a",
  bytes: "8f",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc8(z80.regs.a);
  },
});

// {n:144, x:2, y:2, z:0, p:1, q:0}
// $ALU $RZ
opcodes.set(0x90, {
  name: "sub8 b",
  bytes: "90",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub8(z80.regs.b);
  },
});

// {n:145, x:2, y:2, z:1, p:1, q:0}
// $ALU $RZ
opcodes.set(0x91, {
  name: "sub8 c",
  bytes: "91",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub8(z80.regs.c);
  },
});

// {n:146, x:2, y:2, z:2, p:1, q:0}
// $ALU $RZ
opcodes.set(0x92, {
  name: "sub8 d",
  bytes: "92",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub8(z80.regs.d);
  },
});

// {n:147, x:2, y:2, z:3, p:1, q:0}
// $ALU $RZ
opcodes.set(0x93, {
  name: "sub8 e",
  bytes: "93",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub8(z80.regs.e);
  },
});

// {n:148, x:2, y:2, z:4, p:1, q:0}
// $ALU $RZ
opcodes.set(0x94, {
  name: "sub8 h",
  bytes: "94",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub8(z80.regs.h);
  },
});

// {n:149, x:2, y:2, z:5, p:1, q:0}
// $ALU $RZ
opcodes.set(0x95, {
  name: "sub8 l",
  bytes: "95",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub8(z80.regs.l);
  },
});

// {n:150, x:2, y:2, z:6, p:1, q:0}
// $ALU (HL)
opcodes.set(0x96, {
  name: "sub8 (HL)",
  bytes: "96",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.sub8(z80.dbus);
  },
});

// {n:151, x:2, y:2, z:7, p:1, q:0}
// $ALU $RZ
opcodes.set(0x97, {
  name: "sub8 a",
  bytes: "97",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub8(z80.regs.a);
  },
});

// {n:152, x:2, y:3, z:0, p:1, q:1}
// $ALU $RZ
opcodes.set(0x98, {
  name: "sbc8 b",
  bytes: "98",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc8(z80.regs.b);
  },
});

// {n:153, x:2, y:3, z:1, p:1, q:1}
// $ALU $RZ
opcodes.set(0x99, {
  name: "sbc8 c",
  bytes: "99",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc8(z80.regs.c);
  },
});

// {n:154, x:2, y:3, z:2, p:1, q:1}
// $ALU $RZ
opcodes.set(0x9a, {
  name: "sbc8 d",
  bytes: "9a",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc8(z80.regs.d);
  },
});

// {n:155, x:2, y:3, z:3, p:1, q:1}
// $ALU $RZ
opcodes.set(0x9b, {
  name: "sbc8 e",
  bytes: "9b",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc8(z80.regs.e);
  },
});

// {n:156, x:2, y:3, z:4, p:1, q:1}
// $ALU $RZ
opcodes.set(0x9c, {
  name: "sbc8 h",
  bytes: "9c",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc8(z80.regs.h);
  },
});

// {n:157, x:2, y:3, z:5, p:1, q:1}
// $ALU $RZ
opcodes.set(0x9d, {
  name: "sbc8 l",
  bytes: "9d",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc8(z80.regs.l);
  },
});

// {n:158, x:2, y:3, z:6, p:1, q:1}
// $ALU (HL)
opcodes.set(0x9e, {
  name: "sbc8 (HL)",
  bytes: "9e",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.sbc8(z80.dbus);
  },
});

// {n:159, x:2, y:3, z:7, p:1, q:1}
// $ALU $RZ
opcodes.set(0x9f, {
  name: "sbc8 a",
  bytes: "9f",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc8(z80.regs.a);
  },
});

// {n:160, x:2, y:4, z:0, p:2, q:0}
// $ALU $RZ
opcodes.set(0xa0, {
  name: "and8 b",
  bytes: "a0",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and8(z80.regs.b);
  },
});

// {n:161, x:2, y:4, z:1, p:2, q:0}
// $ALU $RZ
opcodes.set(0xa1, {
  name: "and8 c",
  bytes: "a1",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and8(z80.regs.c);
  },
});

// {n:162, x:2, y:4, z:2, p:2, q:0}
// $ALU $RZ
opcodes.set(0xa2, {
  name: "and8 d",
  bytes: "a2",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and8(z80.regs.d);
  },
});

// {n:163, x:2, y:4, z:3, p:2, q:0}
// $ALU $RZ
opcodes.set(0xa3, {
  name: "and8 e",
  bytes: "a3",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and8(z80.regs.e);
  },
});

// {n:164, x:2, y:4, z:4, p:2, q:0}
// $ALU $RZ
opcodes.set(0xa4, {
  name: "and8 h",
  bytes: "a4",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and8(z80.regs.h);
  },
});

// {n:165, x:2, y:4, z:5, p:2, q:0}
// $ALU $RZ
opcodes.set(0xa5, {
  name: "and8 l",
  bytes: "a5",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and8(z80.regs.l);
  },
});

// {n:166, x:2, y:4, z:6, p:2, q:0}
// $ALU (HL)
opcodes.set(0xa6, {
  name: "and8 (HL)",
  bytes: "a6",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.and8(z80.dbus);
  },
});

// {n:167, x:2, y:4, z:7, p:2, q:0}
// $ALU $RZ
opcodes.set(0xa7, {
  name: "and8 a",
  bytes: "a7",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and8(z80.regs.a);
  },
});

// {n:168, x:2, y:5, z:0, p:2, q:1}
// $ALU $RZ
opcodes.set(0xa8, {
  name: "xor8 b",
  bytes: "a8",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor8(z80.regs.b);
  },
});

// {n:169, x:2, y:5, z:1, p:2, q:1}
// $ALU $RZ
opcodes.set(0xa9, {
  name: "xor8 c",
  bytes: "a9",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor8(z80.regs.c);
  },
});

// {n:170, x:2, y:5, z:2, p:2, q:1}
// $ALU $RZ
opcodes.set(0xaa, {
  name: "xor8 d",
  bytes: "aa",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor8(z80.regs.d);
  },
});

// {n:171, x:2, y:5, z:3, p:2, q:1}
// $ALU $RZ
opcodes.set(0xab, {
  name: "xor8 e",
  bytes: "ab",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor8(z80.regs.e);
  },
});

// {n:172, x:2, y:5, z:4, p:2, q:1}
// $ALU $RZ
opcodes.set(0xac, {
  name: "xor8 h",
  bytes: "ac",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor8(z80.regs.h);
  },
});

// {n:173, x:2, y:5, z:5, p:2, q:1}
// $ALU $RZ
opcodes.set(0xad, {
  name: "xor8 l",
  bytes: "ad",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor8(z80.regs.l);
  },
});

// {n:174, x:2, y:5, z:6, p:2, q:1}
// $ALU (HL)
opcodes.set(0xae, {
  name: "xor8 (HL)",
  bytes: "ae",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.xor8(z80.dbus);
  },
});

// {n:175, x:2, y:5, z:7, p:2, q:1}
// $ALU $RZ
opcodes.set(0xaf, {
  name: "xor8 a",
  bytes: "af",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor8(z80.regs.a);
  },
});

// {n:176, x:2, y:6, z:0, p:3, q:0}
// $ALU $RZ
opcodes.set(0xb0, {
  name: "or8 b",
  bytes: "b0",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or8(z80.regs.b);
  },
});

// {n:177, x:2, y:6, z:1, p:3, q:0}
// $ALU $RZ
opcodes.set(0xb1, {
  name: "or8 c",
  bytes: "b1",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or8(z80.regs.c);
  },
});

// {n:178, x:2, y:6, z:2, p:3, q:0}
// $ALU $RZ
opcodes.set(0xb2, {
  name: "or8 d",
  bytes: "b2",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or8(z80.regs.d);
  },
});

// {n:179, x:2, y:6, z:3, p:3, q:0}
// $ALU $RZ
opcodes.set(0xb3, {
  name: "or8 e",
  bytes: "b3",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or8(z80.regs.e);
  },
});

// {n:180, x:2, y:6, z:4, p:3, q:0}
// $ALU $RZ
opcodes.set(0xb4, {
  name: "or8 h",
  bytes: "b4",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or8(z80.regs.h);
  },
});

// {n:181, x:2, y:6, z:5, p:3, q:0}
// $ALU $RZ
opcodes.set(0xb5, {
  name: "or8 l",
  bytes: "b5",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or8(z80.regs.l);
  },
});

// {n:182, x:2, y:6, z:6, p:3, q:0}
// $ALU (HL)
opcodes.set(0xb6, {
  name: "or8 (HL)",
  bytes: "b6",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.or8(z80.dbus);
  },
});

// {n:183, x:2, y:6, z:7, p:3, q:0}
// $ALU $RZ
opcodes.set(0xb7, {
  name: "or8 a",
  bytes: "b7",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or8(z80.regs.a);
  },
});

// {n:184, x:2, y:7, z:0, p:3, q:1}
// $ALU $RZ
opcodes.set(0xb8, {
  name: "cp8 b",
  bytes: "b8",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp8(z80.regs.b);
  },
});

// {n:185, x:2, y:7, z:1, p:3, q:1}
// $ALU $RZ
opcodes.set(0xb9, {
  name: "cp8 c",
  bytes: "b9",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp8(z80.regs.c);
  },
});

// {n:186, x:2, y:7, z:2, p:3, q:1}
// $ALU $RZ
opcodes.set(0xba, {
  name: "cp8 d",
  bytes: "ba",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp8(z80.regs.d);
  },
});

// {n:187, x:2, y:7, z:3, p:3, q:1}
// $ALU $RZ
opcodes.set(0xbb, {
  name: "cp8 e",
  bytes: "bb",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp8(z80.regs.e);
  },
});

// {n:188, x:2, y:7, z:4, p:3, q:1}
// $ALU $RZ
opcodes.set(0xbc, {
  name: "cp8 h",
  bytes: "bc",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp8(z80.regs.h);
  },
});

// {n:189, x:2, y:7, z:5, p:3, q:1}
// $ALU $RZ
opcodes.set(0xbd, {
  name: "cp8 l",
  bytes: "bd",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp8(z80.regs.l);
  },
});

// {n:190, x:2, y:7, z:6, p:3, q:1}
// $ALU (HL)
opcodes.set(0xbe, {
  name: "cp8 (HL)",
  bytes: "be",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.cp8(z80.dbus);
  },
});

// {n:191, x:2, y:7, z:7, p:3, q:1}
// $ALU $RZ
opcodes.set(0xbf, {
  name: "cp8 a",
  bytes: "bf",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp8(z80.regs.a);
  },
});

// {n:192, x:3, y:0, z:0, p:0, q:0}
// RET $CC
opcodes.set(0xc0, {
  name: "RET NZ",
  bytes: "c0",
  group: "Control flow",
  fn: (z80) => {
    // generic: {tcycles: 1, action: "if (!$CC) return;"}
    z80.incTStateCount(1);
    if (!z80.regs.condNZ) return;
    // mread: {ab: $SP++, dst: $WZL}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:193, x:3, y:0, z:1, p:0, q:0}
// POP $RP2
opcodes.set(0xc1, {
  name: "POP bc",
  bytes: "c1",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $SP++, dst: $RP2L}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.c = z80.dbus;
    // mread: {ab: $SP++, dst: $RP2H}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.b = z80.dbus;
  },
});

// {n:194, x:3, y:0, z:2, p:0, q:0}
// JP $CC,$nn
opcodes.set(0xc2, {
  name: "JP NZ,$nn",
  bytes: "c2 XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, if: "$CC", action: "$PC=$WZ"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (z80.regs.condNZ) {
      z80.regs.pc = z80.regs.wz;
    }
  },
});

// {n:195, x:3, y:0, z:3, p:0, q:0}
// JP $nn
opcodes.set(0xc3, {
  name: "JP $nn",
  bytes: "c3 XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:196, x:3, y:0, z:4, p:0, q:0}
// CALL $CC,$nn
opcodes.set(0xc4, {
  name: "CALL NZ,$nn",
  bytes: "c4 XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, action: "if (!$CC) return"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (!z80.regs.condNZ) return;
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:197, x:3, y:0, z:5, p:0, q:0}
// PUSH $RP2
opcodes.set(0xc5, {
  name: "PUSH bc",
  bytes: "c5",
  group: "Load 16bit",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $RP2H}
    z80.dbus = z80.regs.b;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $RP2L}
    z80.dbus = z80.regs.c;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:198, x:3, y:0, z:6, p:0, q:0}
// $ALU $n
opcodes.set(0xc6, {
  name: "add8 $n",
  bytes: "c6 XX",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.add8(z80.dbus);
  },
});

// {n:199, x:3, y:0, z:7, p:0, q:0}
// RST $Y*8
opcodes.set(0xc7, {
  name: "RST 0x00",
  bytes: "c7",
  doc: "push PC, PC=p",
  group: "CPU control",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$WZ=$Y*8;$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.wz = 0x00;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:200, x:3, y:1, z:0, p:0, q:1}
// RET $CC
opcodes.set(0xc8, {
  name: "RET Z",
  bytes: "c8",
  group: "Control flow",
  fn: (z80) => {
    // generic: {tcycles: 1, action: "if (!$CC) return;"}
    z80.incTStateCount(1);
    if (!z80.regs.condZ) return;
    // mread: {ab: $SP++, dst: $WZL}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:201, x:3, y:1, z:1, p:0, q:1}
// RET
opcodes.set(0xc9, {
  name: "RET",
  bytes: "c9",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $SP++, dst: $WZL}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:202, x:3, y:1, z:2, p:0, q:1}
// JP $CC,$nn
opcodes.set(0xca, {
  name: "JP Z,$nn",
  bytes: "ca XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, if: "$CC", action: "$PC=$WZ"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (z80.regs.condZ) {
      z80.regs.pc = z80.regs.wz;
    }
  },
});

// {n:203, x:3, y:1, z:3, p:0, q:1}
// CB prefix
opcodes.set(0xcb, {
  name: "CB XXX",
  bytes: "cb",
  group: "Prefix",
  fn: (z80) => {
    // overlapped: {prefix: cb}
    z80.decodeCB();
  },
});

// {n:204, x:3, y:1, z:4, p:0, q:1}
// CALL $CC,$nn
opcodes.set(0xcc, {
  name: "CALL Z,$nn",
  bytes: "cc XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, action: "if (!$CC) return"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (!z80.regs.condZ) return;
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:205, x:3, y:1, z:5, p:0, q:1}
// CALL $nn
opcodes.set(0xcd, {
  name: "CALL $nn",
  bytes: "cd XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {tcycles: 4, ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.w = z80.dbus;
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:206, x:3, y:1, z:6, p:0, q:1}
// $ALU $n
opcodes.set(0xce, {
  name: "adc8 $n",
  bytes: "ce XX",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.adc8(z80.dbus);
  },
});

// {n:207, x:3, y:1, z:7, p:0, q:1}
// RST $Y*8
opcodes.set(0xcf, {
  name: "RST 0x08",
  bytes: "cf",
  doc: "push PC, PC=p",
  group: "CPU control",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$WZ=$Y*8;$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.wz = 0x08;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:208, x:3, y:2, z:0, p:1, q:0}
// RET $CC
opcodes.set(0xd0, {
  name: "RET NC",
  bytes: "d0",
  group: "Control flow",
  fn: (z80) => {
    // generic: {tcycles: 1, action: "if (!$CC) return;"}
    z80.incTStateCount(1);
    if (!z80.regs.condNC) return;
    // mread: {ab: $SP++, dst: $WZL}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:209, x:3, y:2, z:1, p:1, q:0}
// POP $RP2
opcodes.set(0xd1, {
  name: "POP de",
  bytes: "d1",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $SP++, dst: $RP2L}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.e = z80.dbus;
    // mread: {ab: $SP++, dst: $RP2H}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.d = z80.dbus;
  },
});

// {n:210, x:3, y:2, z:2, p:1, q:0}
// JP $CC,$nn
opcodes.set(0xd2, {
  name: "JP NC,$nn",
  bytes: "d2 XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, if: "$CC", action: "$PC=$WZ"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (z80.regs.condNC) {
      z80.regs.pc = z80.regs.wz;
    }
  },
});

// {n:211, x:3, y:2, z:3, p:1, q:0}
// OUT ($n),A
opcodes.set(0xd3, {
  name: "OUT ($n),A",
  bytes: "d3 XX",
  group: "IO",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL, action: "$WZH=$A"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    z80.regs.w = z80.regs.a;
    // iowrite: {ab: $WZ, db: $A, action: "$WZL++"}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writePort(z80.abus, z80.dbus);
    z80.regs.z++;
  },
});

// {n:212, x:3, y:2, z:4, p:1, q:0}
// CALL $CC,$nn
opcodes.set(0xd4, {
  name: "CALL NC,$nn",
  bytes: "d4 XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, action: "if (!$CC) return"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (!z80.regs.condNC) return;
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:213, x:3, y:2, z:5, p:1, q:0}
// PUSH $RP2
opcodes.set(0xd5, {
  name: "PUSH de",
  bytes: "d5",
  group: "Load 16bit",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $RP2H}
    z80.dbus = z80.regs.d;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $RP2L}
    z80.dbus = z80.regs.e;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:214, x:3, y:2, z:6, p:1, q:0}
// $ALU $n
opcodes.set(0xd6, {
  name: "sub8 $n",
  bytes: "d6 XX",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.sub8(z80.dbus);
  },
});

// {n:215, x:3, y:2, z:7, p:1, q:0}
// RST $Y*8
opcodes.set(0xd7, {
  name: "RST 0x10",
  bytes: "d7",
  doc: "push PC, PC=p",
  group: "CPU control",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$WZ=$Y*8;$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.wz = 0x10;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:216, x:3, y:3, z:0, p:1, q:1}
// RET $CC
opcodes.set(0xd8, {
  name: "RET C",
  bytes: "d8",
  group: "Control flow",
  fn: (z80) => {
    // generic: {tcycles: 1, action: "if (!$CC) return;"}
    z80.incTStateCount(1);
    if (!z80.regs.condC) return;
    // mread: {ab: $SP++, dst: $WZL}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:217, x:3, y:3, z:1, p:1, q:1}
// EXX
opcodes.set(0xd9, {
  name: "EXX",
  bytes: "d9",
  doc: "Swap registers/primes",
  group: "Transfer",
  fn: (z80) => {
    // overlapped: {action: "z80.exx()"}
    z80.exx();
  },
});

// {n:218, x:3, y:3, z:2, p:1, q:1}
// JP $CC,$nn
opcodes.set(0xda, {
  name: "JP C,$nn",
  bytes: "da XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, if: "$CC", action: "$PC=$WZ"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (z80.regs.condC) {
      z80.regs.pc = z80.regs.wz;
    }
  },
});

// {n:219, x:3, y:3, z:3, p:1, q:1}
// IN A,($n)
opcodes.set(0xdb, {
  name: "IN A,($n)",
  bytes: "db XX",
  group: "IO",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL, action: "$WZH=$A"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    z80.regs.w = z80.regs.a;
    // ioread: {ab: $WZ++, dst: $A}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readPort(z80.abus);
    z80.regs.wz = z80.alu.inc16(z80.regs.wz);
    z80.regs.a = z80.dbus;
  },
});

// {n:220, x:3, y:3, z:4, p:1, q:1}
// CALL $CC,$nn
opcodes.set(0xdc, {
  name: "CALL C,$nn",
  bytes: "dc XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, action: "if (!$CC) return"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (!z80.regs.condC) return;
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:221, x:3, y:3, z:5, p:1, q:1}
// DD prefix
opcodes.set(0xdd, {
  name: "DD XXX",
  bytes: "dd",
  group: "Prefix",
  fn: (z80) => {
    // overlapped: {prefix: dd}
    z80.decodeDD();
  },
});

// {n:222, x:3, y:3, z:6, p:1, q:1}
// $ALU $n
opcodes.set(0xde, {
  name: "sbc8 $n",
  bytes: "de XX",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.sbc8(z80.dbus);
  },
});

// {n:223, x:3, y:3, z:7, p:1, q:1}
// RST $Y*8
opcodes.set(0xdf, {
  name: "RST 0x18",
  bytes: "df",
  doc: "push PC, PC=p",
  group: "CPU control",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$WZ=$Y*8;$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.wz = 0x18;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:224, x:3, y:4, z:0, p:2, q:0}
// RET $CC
opcodes.set(0xe0, {
  name: "RET PO",
  bytes: "e0",
  group: "Control flow",
  fn: (z80) => {
    // generic: {tcycles: 1, action: "if (!$CC) return;"}
    z80.incTStateCount(1);
    if (!z80.regs.condPO) return;
    // mread: {ab: $SP++, dst: $WZL}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:225, x:3, y:4, z:1, p:2, q:0}
// POP $RP2
opcodes.set(0xe1, {
  name: "POP hl",
  bytes: "e1",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $SP++, dst: $RP2L}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.l = z80.dbus;
    // mread: {ab: $SP++, dst: $RP2H}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.h = z80.dbus;
  },
});

// {n:226, x:3, y:4, z:2, p:2, q:0}
// JP $CC,$nn
opcodes.set(0xe2, {
  name: "JP PO,$nn",
  bytes: "e2 XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, if: "$CC", action: "$PC=$WZ"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (z80.regs.condPO) {
      z80.regs.pc = z80.regs.wz;
    }
  },
});

// {n:227, x:3, y:4, z:3, p:2, q:0}
// EX (SP),HL
opcodes.set(0xe3, {
  name: "EX (SP),HL",
  bytes: "e3",
  group: "Transfer",
  fn: (z80) => {
    // mread: {ab: $SP, dst: $WZL}
    z80.abus = z80.regs.sp;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {tcycles: 4, ab: $SP+1, dst: $WZH}
    z80.abus = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.w = z80.dbus;
    // mwrite: {ab: $SP+1, db: $H}
    z80.dbus = z80.regs.h;
    z80.abus = inc16(z80.regs.sp);
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {tcycles: 5, ab: $SP, db: $L, action: "$HL=$WZ"}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.incTStateCount(2);
    z80.regs.hl = z80.regs.wz;
  },
});

// {n:228, x:3, y:4, z:4, p:2, q:0}
// CALL $CC,$nn
opcodes.set(0xe4, {
  name: "CALL PO,$nn",
  bytes: "e4 XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, action: "if (!$CC) return"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (!z80.regs.condPO) return;
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:229, x:3, y:4, z:5, p:2, q:0}
// PUSH $RP2
opcodes.set(0xe5, {
  name: "PUSH hl",
  bytes: "e5",
  group: "Load 16bit",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $RP2H}
    z80.dbus = z80.regs.h;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $RP2L}
    z80.dbus = z80.regs.l;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:230, x:3, y:4, z:6, p:2, q:0}
// $ALU $n
opcodes.set(0xe6, {
  name: "and8 $n",
  bytes: "e6 XX",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.and8(z80.dbus);
  },
});

// {n:231, x:3, y:4, z:7, p:2, q:0}
// RST $Y*8
opcodes.set(0xe7, {
  name: "RST 0x20",
  bytes: "e7",
  doc: "push PC, PC=p",
  group: "CPU control",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$WZ=$Y*8;$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.wz = 0x20;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:232, x:3, y:5, z:0, p:2, q:1}
// RET $CC
opcodes.set(0xe8, {
  name: "RET PE",
  bytes: "e8",
  group: "Control flow",
  fn: (z80) => {
    // generic: {tcycles: 1, action: "if (!$CC) return;"}
    z80.incTStateCount(1);
    if (!z80.regs.condPE) return;
    // mread: {ab: $SP++, dst: $WZL}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:233, x:3, y:5, z:1, p:2, q:1}
// JP HL
opcodes.set(0xe9, {
  name: "JP HL",
  bytes: "e9",
  doc: "JMP if parity",
  group: "Control flow",
  fn: (z80) => {
    // overlapped: {action: "$PC=$HL"}
    z80.regs.pc = z80.regs.hl;
  },
});

// {n:234, x:3, y:5, z:2, p:2, q:1}
// JP $CC,$nn
opcodes.set(0xea, {
  name: "JP PE,$nn",
  bytes: "ea XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, if: "$CC", action: "$PC=$WZ"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (z80.regs.condPE) {
      z80.regs.pc = z80.regs.wz;
    }
  },
});

// {n:235, x:3, y:5, z:3, p:2, q:1}
// EX DE,HL
opcodes.set(0xeb, {
  name: "EX DE,HL",
  bytes: "eb",
  group: "Transfer",
  fn: (z80) => {
    // overlapped: {action: "z80.ex_de_hl()"}
    z80.ex_de_hl();
  },
});

// {n:236, x:3, y:5, z:4, p:2, q:1}
// CALL $CC,$nn
opcodes.set(0xec, {
  name: "CALL PE,$nn",
  bytes: "ec XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, action: "if (!$CC) return"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (!z80.regs.condPE) return;
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:237, x:3, y:5, z:5, p:2, q:1}
// ED prefix
opcodes.set(0xed, {
  name: "ED XXX",
  bytes: "ed",
  group: "Prefix",
  fn: (z80) => {
    // overlapped: {prefix: ed}
    z80.decodeED();
  },
});

// {n:238, x:3, y:5, z:6, p:2, q:1}
// $ALU $n
opcodes.set(0xee, {
  name: "xor8 $n",
  bytes: "ee XX",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.xor8(z80.dbus);
  },
});

// {n:239, x:3, y:5, z:7, p:2, q:1}
// RST $Y*8
opcodes.set(0xef, {
  name: "RST 0x28",
  bytes: "ef",
  doc: "push PC, PC=p",
  group: "CPU control",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$WZ=$Y*8;$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.wz = 0x28;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:240, x:3, y:6, z:0, p:3, q:0}
// RET $CC
opcodes.set(0xf0, {
  name: "RET P",
  bytes: "f0",
  group: "Control flow",
  fn: (z80) => {
    // generic: {tcycles: 1, action: "if (!$CC) return;"}
    z80.incTStateCount(1);
    if (!z80.regs.condP) return;
    // mread: {ab: $SP++, dst: $WZL}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:241, x:3, y:6, z:1, p:3, q:0}
// POP $RP2
opcodes.set(0xf1, {
  name: "POP af",
  bytes: "f1",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $SP++, dst: $RP2L}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.f = z80.dbus;
    // mread: {ab: $SP++, dst: $RP2H}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.a = z80.dbus;
  },
});

// {n:242, x:3, y:6, z:2, p:3, q:0}
// JP $CC,$nn
opcodes.set(0xf2, {
  name: "JP P,$nn",
  bytes: "f2 XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, if: "$CC", action: "$PC=$WZ"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (z80.regs.condP) {
      z80.regs.pc = z80.regs.wz;
    }
  },
});

// {n:243, x:3, y:6, z:3, p:3, q:0}
// DI
opcodes.set(0xf3, {
  name: "DI",
  bytes: "f3",
  doc: "Disable interrupts",
  group: "CPU Control",
  fn: (z80) => {
    // overlapped: {action: "$IFF1=0; $IFF2=0"}
    z80.regs.iff1 = 0;
    z80.regs.iff2 = 0;
  },
});

// {n:244, x:3, y:6, z:4, p:3, q:0}
// CALL $CC,$nn
opcodes.set(0xf4, {
  name: "CALL P,$nn",
  bytes: "f4 XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, action: "if (!$CC) return"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (!z80.regs.condP) return;
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:245, x:3, y:6, z:5, p:3, q:0}
// PUSH $RP2
opcodes.set(0xf5, {
  name: "PUSH af",
  bytes: "f5",
  group: "Load 16bit",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $RP2H}
    z80.dbus = z80.regs.a;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $RP2L}
    z80.dbus = z80.regs.f;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:246, x:3, y:6, z:6, p:3, q:0}
// $ALU $n
opcodes.set(0xf6, {
  name: "or8 $n",
  bytes: "f6 XX",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.or8(z80.dbus);
  },
});

// {n:247, x:3, y:6, z:7, p:3, q:0}
// RST $Y*8
opcodes.set(0xf7, {
  name: "RST 0x30",
  bytes: "f7",
  doc: "push PC, PC=p",
  group: "CPU control",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$WZ=$Y*8;$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.wz = 0x30;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:248, x:3, y:7, z:0, p:3, q:1}
// RET $CC
opcodes.set(0xf8, {
  name: "RET M",
  bytes: "f8",
  group: "Control flow",
  fn: (z80) => {
    // generic: {tcycles: 1, action: "if (!$CC) return;"}
    z80.incTStateCount(1);
    if (!z80.regs.condM) return;
    // mread: {ab: $SP++, dst: $WZL}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:249, x:3, y:7, z:1, p:3, q:1}
// LD SP,HL
opcodes.set(0xf9, {
  name: "LD SP,HL",
  bytes: "f9",
  group: "Load 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$SP=$HL"}
    z80.incTStateCount(2);
    z80.regs.sp = z80.regs.hl;
  },
});

// {n:250, x:3, y:7, z:2, p:3, q:1}
// JP $CC,$nn
opcodes.set(0xfa, {
  name: "JP M,$nn",
  bytes: "fa XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, if: "$CC", action: "$PC=$WZ"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (z80.regs.condM) {
      z80.regs.pc = z80.regs.wz;
    }
  },
});

// {n:251, x:3, y:7, z:3, p:3, q:1}
// EI
opcodes.set(0xfb, {
  name: "EI",
  bytes: "fb",
  doc: "Enable interrupts",
  group: "CPU Control",
  fn: (z80) => {
    // overlapped: {action: "$IFF1=1; $IFF2=1"}
    z80.regs.iff1 = 1;
    z80.regs.iff2 = 1;
  },
});

// {n:252, x:3, y:7, z:4, p:3, q:1}
// CALL $CC,$nn
opcodes.set(0xfc, {
  name: "CALL M,$nn",
  bytes: "fc XX XX",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH, action: "if (!$CC) return"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    if (!z80.regs.condM) return;
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:253, x:3, y:7, z:5, p:3, q:1}
// FD prefix
opcodes.set(0xfd, {
  name: "FD XXX",
  bytes: "fd",
  group: "Prefix",
  fn: (z80) => {
    // overlapped: {prefix: fd}
    z80.decodeFD();
  },
});

// {n:254, x:3, y:7, z:6, p:3, q:1}
// $ALU $n
opcodes.set(0xfe, {
  name: "cp8 $n",
  bytes: "fe XX",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.cp8(z80.dbus);
  },
});

// {n:255, x:3, y:7, z:7, p:3, q:1}
// RST $Y*8
opcodes.set(0xff, {
  name: "RST 0x38",
  bytes: "ff",
  doc: "push PC, PC=p",
  group: "CPU control",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $PCH}
    z80.dbus = z80.regs.pch;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $PCL, action: "$WZ=$Y*8;$PC=$WZ"}
    z80.dbus = z80.regs.pcl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.wz = 0x38;
    z80.regs.pc = z80.regs.wz;
  },
});

// {n:0, x:0, y:0, z:0, p:0, q:0}
// $ROT $RZ
opcodes.set(0xcb00, {
  name: "rlc b",
  bytes: "cb 00",
  doc: "Rotate left through carry b",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.rlc(z80.regs.b);
  },
});

// {n:1, x:0, y:0, z:1, p:0, q:0}
// $ROT $RZ
opcodes.set(0xcb01, {
  name: "rlc c",
  bytes: "cb 01",
  doc: "Rotate left through carry c",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.rlc(z80.regs.c);
  },
});

// {n:2, x:0, y:0, z:2, p:0, q:0}
// $ROT $RZ
opcodes.set(0xcb02, {
  name: "rlc d",
  bytes: "cb 02",
  doc: "Rotate left through carry d",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.rlc(z80.regs.d);
  },
});

// {n:3, x:0, y:0, z:3, p:0, q:0}
// $ROT $RZ
opcodes.set(0xcb03, {
  name: "rlc e",
  bytes: "cb 03",
  doc: "Rotate left through carry e",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.rlc(z80.regs.e);
  },
});

// {n:4, x:0, y:0, z:4, p:0, q:0}
// $ROT $RZ
opcodes.set(0xcb04, {
  name: "rlc h",
  bytes: "cb 04",
  doc: "Rotate left through carry h",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.rlc(z80.regs.h);
  },
});

// {n:5, x:0, y:0, z:5, p:0, q:0}
// $ROT $RZ
opcodes.set(0xcb05, {
  name: "rlc l",
  bytes: "cb 05",
  doc: "Rotate left through carry l",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.rlc(z80.regs.l);
  },
});

// {n:6, x:0, y:0, z:6, p:0, q:0}
// $ROT (HL)
opcodes.set(0xcb06, {
  name: "rlc (HL)",
  bytes: "cb 06",
  doc: "Rotate left through carry (HL)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=$ROT($DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.rlc(z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:7, x:0, y:0, z:7, p:0, q:0}
// $ROT $RZ
opcodes.set(0xcb07, {
  name: "rlc a",
  bytes: "cb 07",
  doc: "Rotate left through carry a",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.rlc(z80.regs.a);
  },
});

// {n:8, x:0, y:1, z:0, p:0, q:1}
// $ROT $RZ
opcodes.set(0xcb08, {
  name: "rrc b",
  bytes: "cb 08",
  doc: "Rotate right through carry b",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.rrc(z80.regs.b);
  },
});

// {n:9, x:0, y:1, z:1, p:0, q:1}
// $ROT $RZ
opcodes.set(0xcb09, {
  name: "rrc c",
  bytes: "cb 09",
  doc: "Rotate right through carry c",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.rrc(z80.regs.c);
  },
});

// {n:10, x:0, y:1, z:2, p:0, q:1}
// $ROT $RZ
opcodes.set(0xcb0a, {
  name: "rrc d",
  bytes: "cb 0a",
  doc: "Rotate right through carry d",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.rrc(z80.regs.d);
  },
});

// {n:11, x:0, y:1, z:3, p:0, q:1}
// $ROT $RZ
opcodes.set(0xcb0b, {
  name: "rrc e",
  bytes: "cb 0b",
  doc: "Rotate right through carry e",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.rrc(z80.regs.e);
  },
});

// {n:12, x:0, y:1, z:4, p:0, q:1}
// $ROT $RZ
opcodes.set(0xcb0c, {
  name: "rrc h",
  bytes: "cb 0c",
  doc: "Rotate right through carry h",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.rrc(z80.regs.h);
  },
});

// {n:13, x:0, y:1, z:5, p:0, q:1}
// $ROT $RZ
opcodes.set(0xcb0d, {
  name: "rrc l",
  bytes: "cb 0d",
  doc: "Rotate right through carry l",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.rrc(z80.regs.l);
  },
});

// {n:14, x:0, y:1, z:6, p:0, q:1}
// $ROT (HL)
opcodes.set(0xcb0e, {
  name: "rrc (HL)",
  bytes: "cb 0e",
  doc: "Rotate right through carry (HL)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=$ROT($DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.rrc(z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:15, x:0, y:1, z:7, p:0, q:1}
// $ROT $RZ
opcodes.set(0xcb0f, {
  name: "rrc a",
  bytes: "cb 0f",
  doc: "Rotate right through carry a",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.rrc(z80.regs.a);
  },
});

// {n:16, x:0, y:2, z:0, p:1, q:0}
// $ROT $RZ
opcodes.set(0xcb10, {
  name: "rl b",
  bytes: "cb 10",
  doc: "Rotate left from carry b",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.rl(z80.regs.b);
  },
});

// {n:17, x:0, y:2, z:1, p:1, q:0}
// $ROT $RZ
opcodes.set(0xcb11, {
  name: "rl c",
  bytes: "cb 11",
  doc: "Rotate left from carry c",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.rl(z80.regs.c);
  },
});

// {n:18, x:0, y:2, z:2, p:1, q:0}
// $ROT $RZ
opcodes.set(0xcb12, {
  name: "rl d",
  bytes: "cb 12",
  doc: "Rotate left from carry d",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.rl(z80.regs.d);
  },
});

// {n:19, x:0, y:2, z:3, p:1, q:0}
// $ROT $RZ
opcodes.set(0xcb13, {
  name: "rl e",
  bytes: "cb 13",
  doc: "Rotate left from carry e",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.rl(z80.regs.e);
  },
});

// {n:20, x:0, y:2, z:4, p:1, q:0}
// $ROT $RZ
opcodes.set(0xcb14, {
  name: "rl h",
  bytes: "cb 14",
  doc: "Rotate left from carry h",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.rl(z80.regs.h);
  },
});

// {n:21, x:0, y:2, z:5, p:1, q:0}
// $ROT $RZ
opcodes.set(0xcb15, {
  name: "rl l",
  bytes: "cb 15",
  doc: "Rotate left from carry l",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.rl(z80.regs.l);
  },
});

// {n:22, x:0, y:2, z:6, p:1, q:0}
// $ROT (HL)
opcodes.set(0xcb16, {
  name: "rl (HL)",
  bytes: "cb 16",
  doc: "Rotate left from carry (HL)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=$ROT($DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.rl(z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:23, x:0, y:2, z:7, p:1, q:0}
// $ROT $RZ
opcodes.set(0xcb17, {
  name: "rl a",
  bytes: "cb 17",
  doc: "Rotate left from carry a",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.rl(z80.regs.a);
  },
});

// {n:24, x:0, y:3, z:0, p:1, q:1}
// $ROT $RZ
opcodes.set(0xcb18, {
  name: "rr b",
  bytes: "cb 18",
  doc: "Rotate right from carry b",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.rr(z80.regs.b);
  },
});

// {n:25, x:0, y:3, z:1, p:1, q:1}
// $ROT $RZ
opcodes.set(0xcb19, {
  name: "rr c",
  bytes: "cb 19",
  doc: "Rotate right from carry c",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.rr(z80.regs.c);
  },
});

// {n:26, x:0, y:3, z:2, p:1, q:1}
// $ROT $RZ
opcodes.set(0xcb1a, {
  name: "rr d",
  bytes: "cb 1a",
  doc: "Rotate right from carry d",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.rr(z80.regs.d);
  },
});

// {n:27, x:0, y:3, z:3, p:1, q:1}
// $ROT $RZ
opcodes.set(0xcb1b, {
  name: "rr e",
  bytes: "cb 1b",
  doc: "Rotate right from carry e",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.rr(z80.regs.e);
  },
});

// {n:28, x:0, y:3, z:4, p:1, q:1}
// $ROT $RZ
opcodes.set(0xcb1c, {
  name: "rr h",
  bytes: "cb 1c",
  doc: "Rotate right from carry h",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.rr(z80.regs.h);
  },
});

// {n:29, x:0, y:3, z:5, p:1, q:1}
// $ROT $RZ
opcodes.set(0xcb1d, {
  name: "rr l",
  bytes: "cb 1d",
  doc: "Rotate right from carry l",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.rr(z80.regs.l);
  },
});

// {n:30, x:0, y:3, z:6, p:1, q:1}
// $ROT (HL)
opcodes.set(0xcb1e, {
  name: "rr (HL)",
  bytes: "cb 1e",
  doc: "Rotate right from carry (HL)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=$ROT($DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.rr(z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:31, x:0, y:3, z:7, p:1, q:1}
// $ROT $RZ
opcodes.set(0xcb1f, {
  name: "rr a",
  bytes: "cb 1f",
  doc: "Rotate right from carry a",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.rr(z80.regs.a);
  },
});

// {n:32, x:0, y:4, z:0, p:2, q:0}
// $ROT $RZ
opcodes.set(0xcb20, {
  name: "sla b",
  bytes: "cb 20",
  doc: "Shift left arithmetic b",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.sla(z80.regs.b);
  },
});

// {n:33, x:0, y:4, z:1, p:2, q:0}
// $ROT $RZ
opcodes.set(0xcb21, {
  name: "sla c",
  bytes: "cb 21",
  doc: "Shift left arithmetic c",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.sla(z80.regs.c);
  },
});

// {n:34, x:0, y:4, z:2, p:2, q:0}
// $ROT $RZ
opcodes.set(0xcb22, {
  name: "sla d",
  bytes: "cb 22",
  doc: "Shift left arithmetic d",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.sla(z80.regs.d);
  },
});

// {n:35, x:0, y:4, z:3, p:2, q:0}
// $ROT $RZ
opcodes.set(0xcb23, {
  name: "sla e",
  bytes: "cb 23",
  doc: "Shift left arithmetic e",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.sla(z80.regs.e);
  },
});

// {n:36, x:0, y:4, z:4, p:2, q:0}
// $ROT $RZ
opcodes.set(0xcb24, {
  name: "sla h",
  bytes: "cb 24",
  doc: "Shift left arithmetic h",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.sla(z80.regs.h);
  },
});

// {n:37, x:0, y:4, z:5, p:2, q:0}
// $ROT $RZ
opcodes.set(0xcb25, {
  name: "sla l",
  bytes: "cb 25",
  doc: "Shift left arithmetic l",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.sla(z80.regs.l);
  },
});

// {n:38, x:0, y:4, z:6, p:2, q:0}
// $ROT (HL)
opcodes.set(0xcb26, {
  name: "sla (HL)",
  bytes: "cb 26",
  doc: "Shift left arithmetic (HL)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=$ROT($DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.sla(z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:39, x:0, y:4, z:7, p:2, q:0}
// $ROT $RZ
opcodes.set(0xcb27, {
  name: "sla a",
  bytes: "cb 27",
  doc: "Shift left arithmetic a",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.sla(z80.regs.a);
  },
});

// {n:40, x:0, y:5, z:0, p:2, q:1}
// $ROT $RZ
opcodes.set(0xcb28, {
  name: "sra b",
  bytes: "cb 28",
  doc: "Shift right arithmetic b",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.sra(z80.regs.b);
  },
});

// {n:41, x:0, y:5, z:1, p:2, q:1}
// $ROT $RZ
opcodes.set(0xcb29, {
  name: "sra c",
  bytes: "cb 29",
  doc: "Shift right arithmetic c",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.sra(z80.regs.c);
  },
});

// {n:42, x:0, y:5, z:2, p:2, q:1}
// $ROT $RZ
opcodes.set(0xcb2a, {
  name: "sra d",
  bytes: "cb 2a",
  doc: "Shift right arithmetic d",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.sra(z80.regs.d);
  },
});

// {n:43, x:0, y:5, z:3, p:2, q:1}
// $ROT $RZ
opcodes.set(0xcb2b, {
  name: "sra e",
  bytes: "cb 2b",
  doc: "Shift right arithmetic e",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.sra(z80.regs.e);
  },
});

// {n:44, x:0, y:5, z:4, p:2, q:1}
// $ROT $RZ
opcodes.set(0xcb2c, {
  name: "sra h",
  bytes: "cb 2c",
  doc: "Shift right arithmetic h",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.sra(z80.regs.h);
  },
});

// {n:45, x:0, y:5, z:5, p:2, q:1}
// $ROT $RZ
opcodes.set(0xcb2d, {
  name: "sra l",
  bytes: "cb 2d",
  doc: "Shift right arithmetic l",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.sra(z80.regs.l);
  },
});

// {n:46, x:0, y:5, z:6, p:2, q:1}
// $ROT (HL)
opcodes.set(0xcb2e, {
  name: "sra (HL)",
  bytes: "cb 2e",
  doc: "Shift right arithmetic (HL)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=$ROT($DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.sra(z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:47, x:0, y:5, z:7, p:2, q:1}
// $ROT $RZ
opcodes.set(0xcb2f, {
  name: "sra a",
  bytes: "cb 2f",
  doc: "Shift right arithmetic a",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.sra(z80.regs.a);
  },
});

// {n:48, x:0, y:6, z:0, p:3, q:0}
// $ROT $RZ
opcodes.set(0xcb30, {
  name: "sll b",
  bytes: "cb 30",
  doc: "Shift left logical b",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.sll(z80.regs.b);
  },
});

// {n:49, x:0, y:6, z:1, p:3, q:0}
// $ROT $RZ
opcodes.set(0xcb31, {
  name: "sll c",
  bytes: "cb 31",
  doc: "Shift left logical c",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.sll(z80.regs.c);
  },
});

// {n:50, x:0, y:6, z:2, p:3, q:0}
// $ROT $RZ
opcodes.set(0xcb32, {
  name: "sll d",
  bytes: "cb 32",
  doc: "Shift left logical d",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.sll(z80.regs.d);
  },
});

// {n:51, x:0, y:6, z:3, p:3, q:0}
// $ROT $RZ
opcodes.set(0xcb33, {
  name: "sll e",
  bytes: "cb 33",
  doc: "Shift left logical e",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.sll(z80.regs.e);
  },
});

// {n:52, x:0, y:6, z:4, p:3, q:0}
// $ROT $RZ
opcodes.set(0xcb34, {
  name: "sll h",
  bytes: "cb 34",
  doc: "Shift left logical h",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.sll(z80.regs.h);
  },
});

// {n:53, x:0, y:6, z:5, p:3, q:0}
// $ROT $RZ
opcodes.set(0xcb35, {
  name: "sll l",
  bytes: "cb 35",
  doc: "Shift left logical l",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.sll(z80.regs.l);
  },
});

// {n:54, x:0, y:6, z:6, p:3, q:0}
// $ROT (HL)
opcodes.set(0xcb36, {
  name: "sll (HL)",
  bytes: "cb 36",
  doc: "Shift left logical (HL)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=$ROT($DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.sll(z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:55, x:0, y:6, z:7, p:3, q:0}
// $ROT $RZ
opcodes.set(0xcb37, {
  name: "sll a",
  bytes: "cb 37",
  doc: "Shift left logical a",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.sll(z80.regs.a);
  },
});

// {n:56, x:0, y:7, z:0, p:3, q:1}
// $ROT $RZ
opcodes.set(0xcb38, {
  name: "srl b",
  bytes: "cb 38",
  doc: "Shift right logical b",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.srl(z80.regs.b);
  },
});

// {n:57, x:0, y:7, z:1, p:3, q:1}
// $ROT $RZ
opcodes.set(0xcb39, {
  name: "srl c",
  bytes: "cb 39",
  doc: "Shift right logical c",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.srl(z80.regs.c);
  },
});

// {n:58, x:0, y:7, z:2, p:3, q:1}
// $ROT $RZ
opcodes.set(0xcb3a, {
  name: "srl d",
  bytes: "cb 3a",
  doc: "Shift right logical d",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.srl(z80.regs.d);
  },
});

// {n:59, x:0, y:7, z:3, p:3, q:1}
// $ROT $RZ
opcodes.set(0xcb3b, {
  name: "srl e",
  bytes: "cb 3b",
  doc: "Shift right logical e",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.srl(z80.regs.e);
  },
});

// {n:60, x:0, y:7, z:4, p:3, q:1}
// $ROT $RZ
opcodes.set(0xcb3c, {
  name: "srl h",
  bytes: "cb 3c",
  doc: "Shift right logical h",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.srl(z80.regs.h);
  },
});

// {n:61, x:0, y:7, z:5, p:3, q:1}
// $ROT $RZ
opcodes.set(0xcb3d, {
  name: "srl l",
  bytes: "cb 3d",
  doc: "Shift right logical l",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.srl(z80.regs.l);
  },
});

// {n:62, x:0, y:7, z:6, p:3, q:1}
// $ROT (HL)
opcodes.set(0xcb3e, {
  name: "srl (HL)",
  bytes: "cb 3e",
  doc: "Shift right logical (HL)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=$ROT($DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.srl(z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:63, x:0, y:7, z:7, p:3, q:1}
// $ROT $RZ
opcodes.set(0xcb3f, {
  name: "srl a",
  bytes: "cb 3f",
  doc: "Shift right logical a",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.srl(z80.regs.a);
  },
});

// {n:64, x:1, y:0, z:0, p:0, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb40, {
  name: "BIT 0,b",
  bytes: "cb 40",
  doc: "f.Z = bit 0 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x1, z80.regs.b);
  },
});

// {n:65, x:1, y:0, z:1, p:0, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb41, {
  name: "BIT 0,c",
  bytes: "cb 41",
  doc: "f.Z = bit 0 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x1, z80.regs.c);
  },
});

// {n:66, x:1, y:0, z:2, p:0, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb42, {
  name: "BIT 0,d",
  bytes: "cb 42",
  doc: "f.Z = bit 0 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x1, z80.regs.d);
  },
});

// {n:67, x:1, y:0, z:3, p:0, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb43, {
  name: "BIT 0,e",
  bytes: "cb 43",
  doc: "f.Z = bit 0 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x1, z80.regs.e);
  },
});

// {n:68, x:1, y:0, z:4, p:0, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb44, {
  name: "BIT 0,h",
  bytes: "cb 44",
  doc: "f.Z = bit 0 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x1, z80.regs.h);
  },
});

// {n:69, x:1, y:0, z:5, p:0, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb45, {
  name: "BIT 0,l",
  bytes: "cb 45",
  doc: "f.Z = bit 0 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x1, z80.regs.l);
  },
});

// {n:70, x:1, y:0, z:6, p:0, q:0}
// BIT $NY, (HL)
opcodes.set(0xcb46, {
  name: "BIT 0,(HL)",
  bytes: "cb 46",
  doc: "f.Z = bit 0 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;z80.alu.bitHL($BITY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.alu.bitHL(0x1, z80.dbus);
  },
});

// {n:71, x:1, y:0, z:7, p:0, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb47, {
  name: "BIT 0,a",
  bytes: "cb 47",
  doc: "f.Z = bit 0 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x1, z80.regs.a);
  },
});

// {n:72, x:1, y:1, z:0, p:0, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb48, {
  name: "BIT 1,b",
  bytes: "cb 48",
  doc: "f.Z = bit 1 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x2, z80.regs.b);
  },
});

// {n:73, x:1, y:1, z:1, p:0, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb49, {
  name: "BIT 1,c",
  bytes: "cb 49",
  doc: "f.Z = bit 1 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x2, z80.regs.c);
  },
});

// {n:74, x:1, y:1, z:2, p:0, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb4a, {
  name: "BIT 1,d",
  bytes: "cb 4a",
  doc: "f.Z = bit 1 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x2, z80.regs.d);
  },
});

// {n:75, x:1, y:1, z:3, p:0, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb4b, {
  name: "BIT 1,e",
  bytes: "cb 4b",
  doc: "f.Z = bit 1 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x2, z80.regs.e);
  },
});

// {n:76, x:1, y:1, z:4, p:0, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb4c, {
  name: "BIT 1,h",
  bytes: "cb 4c",
  doc: "f.Z = bit 1 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x2, z80.regs.h);
  },
});

// {n:77, x:1, y:1, z:5, p:0, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb4d, {
  name: "BIT 1,l",
  bytes: "cb 4d",
  doc: "f.Z = bit 1 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x2, z80.regs.l);
  },
});

// {n:78, x:1, y:1, z:6, p:0, q:1}
// BIT $NY, (HL)
opcodes.set(0xcb4e, {
  name: "BIT 1,(HL)",
  bytes: "cb 4e",
  doc: "f.Z = bit 1 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;z80.alu.bitHL($BITY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.alu.bitHL(0x2, z80.dbus);
  },
});

// {n:79, x:1, y:1, z:7, p:0, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb4f, {
  name: "BIT 1,a",
  bytes: "cb 4f",
  doc: "f.Z = bit 1 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x2, z80.regs.a);
  },
});

// {n:80, x:1, y:2, z:0, p:1, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb50, {
  name: "BIT 2,b",
  bytes: "cb 50",
  doc: "f.Z = bit 2 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x4, z80.regs.b);
  },
});

// {n:81, x:1, y:2, z:1, p:1, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb51, {
  name: "BIT 2,c",
  bytes: "cb 51",
  doc: "f.Z = bit 2 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x4, z80.regs.c);
  },
});

// {n:82, x:1, y:2, z:2, p:1, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb52, {
  name: "BIT 2,d",
  bytes: "cb 52",
  doc: "f.Z = bit 2 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x4, z80.regs.d);
  },
});

// {n:83, x:1, y:2, z:3, p:1, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb53, {
  name: "BIT 2,e",
  bytes: "cb 53",
  doc: "f.Z = bit 2 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x4, z80.regs.e);
  },
});

// {n:84, x:1, y:2, z:4, p:1, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb54, {
  name: "BIT 2,h",
  bytes: "cb 54",
  doc: "f.Z = bit 2 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x4, z80.regs.h);
  },
});

// {n:85, x:1, y:2, z:5, p:1, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb55, {
  name: "BIT 2,l",
  bytes: "cb 55",
  doc: "f.Z = bit 2 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x4, z80.regs.l);
  },
});

// {n:86, x:1, y:2, z:6, p:1, q:0}
// BIT $NY, (HL)
opcodes.set(0xcb56, {
  name: "BIT 2,(HL)",
  bytes: "cb 56",
  doc: "f.Z = bit 2 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;z80.alu.bitHL($BITY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.alu.bitHL(0x4, z80.dbus);
  },
});

// {n:87, x:1, y:2, z:7, p:1, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb57, {
  name: "BIT 2,a",
  bytes: "cb 57",
  doc: "f.Z = bit 2 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x4, z80.regs.a);
  },
});

// {n:88, x:1, y:3, z:0, p:1, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb58, {
  name: "BIT 3,b",
  bytes: "cb 58",
  doc: "f.Z = bit 3 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x8, z80.regs.b);
  },
});

// {n:89, x:1, y:3, z:1, p:1, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb59, {
  name: "BIT 3,c",
  bytes: "cb 59",
  doc: "f.Z = bit 3 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x8, z80.regs.c);
  },
});

// {n:90, x:1, y:3, z:2, p:1, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb5a, {
  name: "BIT 3,d",
  bytes: "cb 5a",
  doc: "f.Z = bit 3 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x8, z80.regs.d);
  },
});

// {n:91, x:1, y:3, z:3, p:1, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb5b, {
  name: "BIT 3,e",
  bytes: "cb 5b",
  doc: "f.Z = bit 3 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x8, z80.regs.e);
  },
});

// {n:92, x:1, y:3, z:4, p:1, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb5c, {
  name: "BIT 3,h",
  bytes: "cb 5c",
  doc: "f.Z = bit 3 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x8, z80.regs.h);
  },
});

// {n:93, x:1, y:3, z:5, p:1, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb5d, {
  name: "BIT 3,l",
  bytes: "cb 5d",
  doc: "f.Z = bit 3 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x8, z80.regs.l);
  },
});

// {n:94, x:1, y:3, z:6, p:1, q:1}
// BIT $NY, (HL)
opcodes.set(0xcb5e, {
  name: "BIT 3,(HL)",
  bytes: "cb 5e",
  doc: "f.Z = bit 3 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;z80.alu.bitHL($BITY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.alu.bitHL(0x8, z80.dbus);
  },
});

// {n:95, x:1, y:3, z:7, p:1, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb5f, {
  name: "BIT 3,a",
  bytes: "cb 5f",
  doc: "f.Z = bit 3 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x8, z80.regs.a);
  },
});

// {n:96, x:1, y:4, z:0, p:2, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb60, {
  name: "BIT 4,b",
  bytes: "cb 60",
  doc: "f.Z = bit 4 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x10, z80.regs.b);
  },
});

// {n:97, x:1, y:4, z:1, p:2, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb61, {
  name: "BIT 4,c",
  bytes: "cb 61",
  doc: "f.Z = bit 4 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x10, z80.regs.c);
  },
});

// {n:98, x:1, y:4, z:2, p:2, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb62, {
  name: "BIT 4,d",
  bytes: "cb 62",
  doc: "f.Z = bit 4 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x10, z80.regs.d);
  },
});

// {n:99, x:1, y:4, z:3, p:2, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb63, {
  name: "BIT 4,e",
  bytes: "cb 63",
  doc: "f.Z = bit 4 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x10, z80.regs.e);
  },
});

// {n:100, x:1, y:4, z:4, p:2, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb64, {
  name: "BIT 4,h",
  bytes: "cb 64",
  doc: "f.Z = bit 4 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x10, z80.regs.h);
  },
});

// {n:101, x:1, y:4, z:5, p:2, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb65, {
  name: "BIT 4,l",
  bytes: "cb 65",
  doc: "f.Z = bit 4 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x10, z80.regs.l);
  },
});

// {n:102, x:1, y:4, z:6, p:2, q:0}
// BIT $NY, (HL)
opcodes.set(0xcb66, {
  name: "BIT 4,(HL)",
  bytes: "cb 66",
  doc: "f.Z = bit 4 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;z80.alu.bitHL($BITY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.alu.bitHL(0x10, z80.dbus);
  },
});

// {n:103, x:1, y:4, z:7, p:2, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb67, {
  name: "BIT 4,a",
  bytes: "cb 67",
  doc: "f.Z = bit 4 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x10, z80.regs.a);
  },
});

// {n:104, x:1, y:5, z:0, p:2, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb68, {
  name: "BIT 5,b",
  bytes: "cb 68",
  doc: "f.Z = bit 5 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x20, z80.regs.b);
  },
});

// {n:105, x:1, y:5, z:1, p:2, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb69, {
  name: "BIT 5,c",
  bytes: "cb 69",
  doc: "f.Z = bit 5 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x20, z80.regs.c);
  },
});

// {n:106, x:1, y:5, z:2, p:2, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb6a, {
  name: "BIT 5,d",
  bytes: "cb 6a",
  doc: "f.Z = bit 5 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x20, z80.regs.d);
  },
});

// {n:107, x:1, y:5, z:3, p:2, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb6b, {
  name: "BIT 5,e",
  bytes: "cb 6b",
  doc: "f.Z = bit 5 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x20, z80.regs.e);
  },
});

// {n:108, x:1, y:5, z:4, p:2, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb6c, {
  name: "BIT 5,h",
  bytes: "cb 6c",
  doc: "f.Z = bit 5 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x20, z80.regs.h);
  },
});

// {n:109, x:1, y:5, z:5, p:2, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb6d, {
  name: "BIT 5,l",
  bytes: "cb 6d",
  doc: "f.Z = bit 5 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x20, z80.regs.l);
  },
});

// {n:110, x:1, y:5, z:6, p:2, q:1}
// BIT $NY, (HL)
opcodes.set(0xcb6e, {
  name: "BIT 5,(HL)",
  bytes: "cb 6e",
  doc: "f.Z = bit 5 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;z80.alu.bitHL($BITY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.alu.bitHL(0x20, z80.dbus);
  },
});

// {n:111, x:1, y:5, z:7, p:2, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb6f, {
  name: "BIT 5,a",
  bytes: "cb 6f",
  doc: "f.Z = bit 5 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x20, z80.regs.a);
  },
});

// {n:112, x:1, y:6, z:0, p:3, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb70, {
  name: "BIT 6,b",
  bytes: "cb 70",
  doc: "f.Z = bit 6 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x40, z80.regs.b);
  },
});

// {n:113, x:1, y:6, z:1, p:3, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb71, {
  name: "BIT 6,c",
  bytes: "cb 71",
  doc: "f.Z = bit 6 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x40, z80.regs.c);
  },
});

// {n:114, x:1, y:6, z:2, p:3, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb72, {
  name: "BIT 6,d",
  bytes: "cb 72",
  doc: "f.Z = bit 6 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x40, z80.regs.d);
  },
});

// {n:115, x:1, y:6, z:3, p:3, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb73, {
  name: "BIT 6,e",
  bytes: "cb 73",
  doc: "f.Z = bit 6 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x40, z80.regs.e);
  },
});

// {n:116, x:1, y:6, z:4, p:3, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb74, {
  name: "BIT 6,h",
  bytes: "cb 74",
  doc: "f.Z = bit 6 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x40, z80.regs.h);
  },
});

// {n:117, x:1, y:6, z:5, p:3, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb75, {
  name: "BIT 6,l",
  bytes: "cb 75",
  doc: "f.Z = bit 6 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x40, z80.regs.l);
  },
});

// {n:118, x:1, y:6, z:6, p:3, q:0}
// BIT $NY, (HL)
opcodes.set(0xcb76, {
  name: "BIT 6,(HL)",
  bytes: "cb 76",
  doc: "f.Z = bit 6 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;z80.alu.bitHL($BITY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.alu.bitHL(0x40, z80.dbus);
  },
});

// {n:119, x:1, y:6, z:7, p:3, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb77, {
  name: "BIT 6,a",
  bytes: "cb 77",
  doc: "f.Z = bit 6 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x40, z80.regs.a);
  },
});

// {n:120, x:1, y:7, z:0, p:3, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb78, {
  name: "BIT 7,b",
  bytes: "cb 78",
  doc: "f.Z = bit 7 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x80, z80.regs.b);
  },
});

// {n:121, x:1, y:7, z:1, p:3, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb79, {
  name: "BIT 7,c",
  bytes: "cb 79",
  doc: "f.Z = bit 7 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x80, z80.regs.c);
  },
});

// {n:122, x:1, y:7, z:2, p:3, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb7a, {
  name: "BIT 7,d",
  bytes: "cb 7a",
  doc: "f.Z = bit 7 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x80, z80.regs.d);
  },
});

// {n:123, x:1, y:7, z:3, p:3, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb7b, {
  name: "BIT 7,e",
  bytes: "cb 7b",
  doc: "f.Z = bit 7 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x80, z80.regs.e);
  },
});

// {n:124, x:1, y:7, z:4, p:3, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb7c, {
  name: "BIT 7,h",
  bytes: "cb 7c",
  doc: "f.Z = bit 7 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x80, z80.regs.h);
  },
});

// {n:125, x:1, y:7, z:5, p:3, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb7d, {
  name: "BIT 7,l",
  bytes: "cb 7d",
  doc: "f.Z = bit 7 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x80, z80.regs.l);
  },
});

// {n:126, x:1, y:7, z:6, p:3, q:1}
// BIT $NY, (HL)
opcodes.set(0xcb7e, {
  name: "BIT 7,(HL)",
  bytes: "cb 7e",
  doc: "f.Z = bit 7 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;z80.alu.bitHL($BITY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.alu.bitHL(0x80, z80.dbus);
  },
});

// {n:127, x:1, y:7, z:7, p:3, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb7f, {
  name: "BIT 7,a",
  bytes: "cb 7f",
  doc: "f.Z = bit 7 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x80, z80.regs.a);
  },
});

// {n:128, x:2, y:0, z:0, p:0, q:0}
// RES $NY, $RZ
opcodes.set(0xcb80, {
  name: "RES 0,b",
  bytes: "cb 80",
  doc: "Reset bit 0 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(0, z80.regs.b);
  },
});

// {n:129, x:2, y:0, z:1, p:0, q:0}
// RES $NY, $RZ
opcodes.set(0xcb81, {
  name: "RES 0,c",
  bytes: "cb 81",
  doc: "Reset bit 0 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(0, z80.regs.c);
  },
});

// {n:130, x:2, y:0, z:2, p:0, q:0}
// RES $NY, $RZ
opcodes.set(0xcb82, {
  name: "RES 0,d",
  bytes: "cb 82",
  doc: "Reset bit 0 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(0, z80.regs.d);
  },
});

// {n:131, x:2, y:0, z:3, p:0, q:0}
// RES $NY, $RZ
opcodes.set(0xcb83, {
  name: "RES 0,e",
  bytes: "cb 83",
  doc: "Reset bit 0 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(0, z80.regs.e);
  },
});

// {n:132, x:2, y:0, z:4, p:0, q:0}
// RES $NY, $RZ
opcodes.set(0xcb84, {
  name: "RES 0,h",
  bytes: "cb 84",
  doc: "Reset bit 0 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(0, z80.regs.h);
  },
});

// {n:133, x:2, y:0, z:5, p:0, q:0}
// RES $NY, $RZ
opcodes.set(0xcb85, {
  name: "RES 0,l",
  bytes: "cb 85",
  doc: "Reset bit 0 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(0, z80.regs.l);
  },
});

// {n:134, x:2, y:0, z:6, p:0, q:0}
// RES $NY, (HL)
opcodes.set(0xcb86, {
  name: "RES 0,(HL)",
  bytes: "cb 86",
  doc: "Reset bit 0 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:135, x:2, y:0, z:7, p:0, q:0}
// RES $NY, $RZ
opcodes.set(0xcb87, {
  name: "RES 0,a",
  bytes: "cb 87",
  doc: "Reset bit 0 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(0, z80.regs.a);
  },
});

// {n:136, x:2, y:1, z:0, p:0, q:1}
// RES $NY, $RZ
opcodes.set(0xcb88, {
  name: "RES 1,b",
  bytes: "cb 88",
  doc: "Reset bit 1 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(1, z80.regs.b);
  },
});

// {n:137, x:2, y:1, z:1, p:0, q:1}
// RES $NY, $RZ
opcodes.set(0xcb89, {
  name: "RES 1,c",
  bytes: "cb 89",
  doc: "Reset bit 1 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(1, z80.regs.c);
  },
});

// {n:138, x:2, y:1, z:2, p:0, q:1}
// RES $NY, $RZ
opcodes.set(0xcb8a, {
  name: "RES 1,d",
  bytes: "cb 8a",
  doc: "Reset bit 1 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(1, z80.regs.d);
  },
});

// {n:139, x:2, y:1, z:3, p:0, q:1}
// RES $NY, $RZ
opcodes.set(0xcb8b, {
  name: "RES 1,e",
  bytes: "cb 8b",
  doc: "Reset bit 1 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(1, z80.regs.e);
  },
});

// {n:140, x:2, y:1, z:4, p:0, q:1}
// RES $NY, $RZ
opcodes.set(0xcb8c, {
  name: "RES 1,h",
  bytes: "cb 8c",
  doc: "Reset bit 1 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(1, z80.regs.h);
  },
});

// {n:141, x:2, y:1, z:5, p:0, q:1}
// RES $NY, $RZ
opcodes.set(0xcb8d, {
  name: "RES 1,l",
  bytes: "cb 8d",
  doc: "Reset bit 1 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(1, z80.regs.l);
  },
});

// {n:142, x:2, y:1, z:6, p:0, q:1}
// RES $NY, (HL)
opcodes.set(0xcb8e, {
  name: "RES 1,(HL)",
  bytes: "cb 8e",
  doc: "Reset bit 1 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:143, x:2, y:1, z:7, p:0, q:1}
// RES $NY, $RZ
opcodes.set(0xcb8f, {
  name: "RES 1,a",
  bytes: "cb 8f",
  doc: "Reset bit 1 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(1, z80.regs.a);
  },
});

// {n:144, x:2, y:2, z:0, p:1, q:0}
// RES $NY, $RZ
opcodes.set(0xcb90, {
  name: "RES 2,b",
  bytes: "cb 90",
  doc: "Reset bit 2 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(2, z80.regs.b);
  },
});

// {n:145, x:2, y:2, z:1, p:1, q:0}
// RES $NY, $RZ
opcodes.set(0xcb91, {
  name: "RES 2,c",
  bytes: "cb 91",
  doc: "Reset bit 2 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(2, z80.regs.c);
  },
});

// {n:146, x:2, y:2, z:2, p:1, q:0}
// RES $NY, $RZ
opcodes.set(0xcb92, {
  name: "RES 2,d",
  bytes: "cb 92",
  doc: "Reset bit 2 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(2, z80.regs.d);
  },
});

// {n:147, x:2, y:2, z:3, p:1, q:0}
// RES $NY, $RZ
opcodes.set(0xcb93, {
  name: "RES 2,e",
  bytes: "cb 93",
  doc: "Reset bit 2 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(2, z80.regs.e);
  },
});

// {n:148, x:2, y:2, z:4, p:1, q:0}
// RES $NY, $RZ
opcodes.set(0xcb94, {
  name: "RES 2,h",
  bytes: "cb 94",
  doc: "Reset bit 2 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(2, z80.regs.h);
  },
});

// {n:149, x:2, y:2, z:5, p:1, q:0}
// RES $NY, $RZ
opcodes.set(0xcb95, {
  name: "RES 2,l",
  bytes: "cb 95",
  doc: "Reset bit 2 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(2, z80.regs.l);
  },
});

// {n:150, x:2, y:2, z:6, p:1, q:0}
// RES $NY, (HL)
opcodes.set(0xcb96, {
  name: "RES 2,(HL)",
  bytes: "cb 96",
  doc: "Reset bit 2 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:151, x:2, y:2, z:7, p:1, q:0}
// RES $NY, $RZ
opcodes.set(0xcb97, {
  name: "RES 2,a",
  bytes: "cb 97",
  doc: "Reset bit 2 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(2, z80.regs.a);
  },
});

// {n:152, x:2, y:3, z:0, p:1, q:1}
// RES $NY, $RZ
opcodes.set(0xcb98, {
  name: "RES 3,b",
  bytes: "cb 98",
  doc: "Reset bit 3 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(3, z80.regs.b);
  },
});

// {n:153, x:2, y:3, z:1, p:1, q:1}
// RES $NY, $RZ
opcodes.set(0xcb99, {
  name: "RES 3,c",
  bytes: "cb 99",
  doc: "Reset bit 3 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(3, z80.regs.c);
  },
});

// {n:154, x:2, y:3, z:2, p:1, q:1}
// RES $NY, $RZ
opcodes.set(0xcb9a, {
  name: "RES 3,d",
  bytes: "cb 9a",
  doc: "Reset bit 3 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(3, z80.regs.d);
  },
});

// {n:155, x:2, y:3, z:3, p:1, q:1}
// RES $NY, $RZ
opcodes.set(0xcb9b, {
  name: "RES 3,e",
  bytes: "cb 9b",
  doc: "Reset bit 3 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(3, z80.regs.e);
  },
});

// {n:156, x:2, y:3, z:4, p:1, q:1}
// RES $NY, $RZ
opcodes.set(0xcb9c, {
  name: "RES 3,h",
  bytes: "cb 9c",
  doc: "Reset bit 3 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(3, z80.regs.h);
  },
});

// {n:157, x:2, y:3, z:5, p:1, q:1}
// RES $NY, $RZ
opcodes.set(0xcb9d, {
  name: "RES 3,l",
  bytes: "cb 9d",
  doc: "Reset bit 3 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(3, z80.regs.l);
  },
});

// {n:158, x:2, y:3, z:6, p:1, q:1}
// RES $NY, (HL)
opcodes.set(0xcb9e, {
  name: "RES 3,(HL)",
  bytes: "cb 9e",
  doc: "Reset bit 3 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:159, x:2, y:3, z:7, p:1, q:1}
// RES $NY, $RZ
opcodes.set(0xcb9f, {
  name: "RES 3,a",
  bytes: "cb 9f",
  doc: "Reset bit 3 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(3, z80.regs.a);
  },
});

// {n:160, x:2, y:4, z:0, p:2, q:0}
// RES $NY, $RZ
opcodes.set(0xcba0, {
  name: "RES 4,b",
  bytes: "cb a0",
  doc: "Reset bit 4 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(4, z80.regs.b);
  },
});

// {n:161, x:2, y:4, z:1, p:2, q:0}
// RES $NY, $RZ
opcodes.set(0xcba1, {
  name: "RES 4,c",
  bytes: "cb a1",
  doc: "Reset bit 4 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(4, z80.regs.c);
  },
});

// {n:162, x:2, y:4, z:2, p:2, q:0}
// RES $NY, $RZ
opcodes.set(0xcba2, {
  name: "RES 4,d",
  bytes: "cb a2",
  doc: "Reset bit 4 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(4, z80.regs.d);
  },
});

// {n:163, x:2, y:4, z:3, p:2, q:0}
// RES $NY, $RZ
opcodes.set(0xcba3, {
  name: "RES 4,e",
  bytes: "cb a3",
  doc: "Reset bit 4 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(4, z80.regs.e);
  },
});

// {n:164, x:2, y:4, z:4, p:2, q:0}
// RES $NY, $RZ
opcodes.set(0xcba4, {
  name: "RES 4,h",
  bytes: "cb a4",
  doc: "Reset bit 4 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(4, z80.regs.h);
  },
});

// {n:165, x:2, y:4, z:5, p:2, q:0}
// RES $NY, $RZ
opcodes.set(0xcba5, {
  name: "RES 4,l",
  bytes: "cb a5",
  doc: "Reset bit 4 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(4, z80.regs.l);
  },
});

// {n:166, x:2, y:4, z:6, p:2, q:0}
// RES $NY, (HL)
opcodes.set(0xcba6, {
  name: "RES 4,(HL)",
  bytes: "cb a6",
  doc: "Reset bit 4 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:167, x:2, y:4, z:7, p:2, q:0}
// RES $NY, $RZ
opcodes.set(0xcba7, {
  name: "RES 4,a",
  bytes: "cb a7",
  doc: "Reset bit 4 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(4, z80.regs.a);
  },
});

// {n:168, x:2, y:5, z:0, p:2, q:1}
// RES $NY, $RZ
opcodes.set(0xcba8, {
  name: "RES 5,b",
  bytes: "cb a8",
  doc: "Reset bit 5 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(5, z80.regs.b);
  },
});

// {n:169, x:2, y:5, z:1, p:2, q:1}
// RES $NY, $RZ
opcodes.set(0xcba9, {
  name: "RES 5,c",
  bytes: "cb a9",
  doc: "Reset bit 5 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(5, z80.regs.c);
  },
});

// {n:170, x:2, y:5, z:2, p:2, q:1}
// RES $NY, $RZ
opcodes.set(0xcbaa, {
  name: "RES 5,d",
  bytes: "cb aa",
  doc: "Reset bit 5 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(5, z80.regs.d);
  },
});

// {n:171, x:2, y:5, z:3, p:2, q:1}
// RES $NY, $RZ
opcodes.set(0xcbab, {
  name: "RES 5,e",
  bytes: "cb ab",
  doc: "Reset bit 5 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(5, z80.regs.e);
  },
});

// {n:172, x:2, y:5, z:4, p:2, q:1}
// RES $NY, $RZ
opcodes.set(0xcbac, {
  name: "RES 5,h",
  bytes: "cb ac",
  doc: "Reset bit 5 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(5, z80.regs.h);
  },
});

// {n:173, x:2, y:5, z:5, p:2, q:1}
// RES $NY, $RZ
opcodes.set(0xcbad, {
  name: "RES 5,l",
  bytes: "cb ad",
  doc: "Reset bit 5 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(5, z80.regs.l);
  },
});

// {n:174, x:2, y:5, z:6, p:2, q:1}
// RES $NY, (HL)
opcodes.set(0xcbae, {
  name: "RES 5,(HL)",
  bytes: "cb ae",
  doc: "Reset bit 5 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:175, x:2, y:5, z:7, p:2, q:1}
// RES $NY, $RZ
opcodes.set(0xcbaf, {
  name: "RES 5,a",
  bytes: "cb af",
  doc: "Reset bit 5 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(5, z80.regs.a);
  },
});

// {n:176, x:2, y:6, z:0, p:3, q:0}
// RES $NY, $RZ
opcodes.set(0xcbb0, {
  name: "RES 6,b",
  bytes: "cb b0",
  doc: "Reset bit 6 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(6, z80.regs.b);
  },
});

// {n:177, x:2, y:6, z:1, p:3, q:0}
// RES $NY, $RZ
opcodes.set(0xcbb1, {
  name: "RES 6,c",
  bytes: "cb b1",
  doc: "Reset bit 6 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(6, z80.regs.c);
  },
});

// {n:178, x:2, y:6, z:2, p:3, q:0}
// RES $NY, $RZ
opcodes.set(0xcbb2, {
  name: "RES 6,d",
  bytes: "cb b2",
  doc: "Reset bit 6 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(6, z80.regs.d);
  },
});

// {n:179, x:2, y:6, z:3, p:3, q:0}
// RES $NY, $RZ
opcodes.set(0xcbb3, {
  name: "RES 6,e",
  bytes: "cb b3",
  doc: "Reset bit 6 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(6, z80.regs.e);
  },
});

// {n:180, x:2, y:6, z:4, p:3, q:0}
// RES $NY, $RZ
opcodes.set(0xcbb4, {
  name: "RES 6,h",
  bytes: "cb b4",
  doc: "Reset bit 6 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(6, z80.regs.h);
  },
});

// {n:181, x:2, y:6, z:5, p:3, q:0}
// RES $NY, $RZ
opcodes.set(0xcbb5, {
  name: "RES 6,l",
  bytes: "cb b5",
  doc: "Reset bit 6 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(6, z80.regs.l);
  },
});

// {n:182, x:2, y:6, z:6, p:3, q:0}
// RES $NY, (HL)
opcodes.set(0xcbb6, {
  name: "RES 6,(HL)",
  bytes: "cb b6",
  doc: "Reset bit 6 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:183, x:2, y:6, z:7, p:3, q:0}
// RES $NY, $RZ
opcodes.set(0xcbb7, {
  name: "RES 6,a",
  bytes: "cb b7",
  doc: "Reset bit 6 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(6, z80.regs.a);
  },
});

// {n:184, x:2, y:7, z:0, p:3, q:1}
// RES $NY, $RZ
opcodes.set(0xcbb8, {
  name: "RES 7,b",
  bytes: "cb b8",
  doc: "Reset bit 7 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(7, z80.regs.b);
  },
});

// {n:185, x:2, y:7, z:1, p:3, q:1}
// RES $NY, $RZ
opcodes.set(0xcbb9, {
  name: "RES 7,c",
  bytes: "cb b9",
  doc: "Reset bit 7 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(7, z80.regs.c);
  },
});

// {n:186, x:2, y:7, z:2, p:3, q:1}
// RES $NY, $RZ
opcodes.set(0xcbba, {
  name: "RES 7,d",
  bytes: "cb ba",
  doc: "Reset bit 7 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(7, z80.regs.d);
  },
});

// {n:187, x:2, y:7, z:3, p:3, q:1}
// RES $NY, $RZ
opcodes.set(0xcbbb, {
  name: "RES 7,e",
  bytes: "cb bb",
  doc: "Reset bit 7 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(7, z80.regs.e);
  },
});

// {n:188, x:2, y:7, z:4, p:3, q:1}
// RES $NY, $RZ
opcodes.set(0xcbbc, {
  name: "RES 7,h",
  bytes: "cb bc",
  doc: "Reset bit 7 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(7, z80.regs.h);
  },
});

// {n:189, x:2, y:7, z:5, p:3, q:1}
// RES $NY, $RZ
opcodes.set(0xcbbd, {
  name: "RES 7,l",
  bytes: "cb bd",
  doc: "Reset bit 7 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(7, z80.regs.l);
  },
});

// {n:190, x:2, y:7, z:6, p:3, q:1}
// RES $NY, (HL)
opcodes.set(0xcbbe, {
  name: "RES 7,(HL)",
  bytes: "cb be",
  doc: "Reset bit 7 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:191, x:2, y:7, z:7, p:3, q:1}
// RES $NY, $RZ
opcodes.set(0xcbbf, {
  name: "RES 7,a",
  bytes: "cb bf",
  doc: "Reset bit 7 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(7, z80.regs.a);
  },
});

// {n:192, x:3, y:0, z:0, p:0, q:0}
// SET $NY, $RZ
opcodes.set(0xcbc0, {
  name: "SET 0,b",
  bytes: "cb c0",
  doc: "Set bit 0 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(0, z80.regs.b);
  },
});

// {n:193, x:3, y:0, z:1, p:0, q:0}
// SET $NY, $RZ
opcodes.set(0xcbc1, {
  name: "SET 0,c",
  bytes: "cb c1",
  doc: "Set bit 0 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(0, z80.regs.c);
  },
});

// {n:194, x:3, y:0, z:2, p:0, q:0}
// SET $NY, $RZ
opcodes.set(0xcbc2, {
  name: "SET 0,d",
  bytes: "cb c2",
  doc: "Set bit 0 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(0, z80.regs.d);
  },
});

// {n:195, x:3, y:0, z:3, p:0, q:0}
// SET $NY, $RZ
opcodes.set(0xcbc3, {
  name: "SET 0,e",
  bytes: "cb c3",
  doc: "Set bit 0 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(0, z80.regs.e);
  },
});

// {n:196, x:3, y:0, z:4, p:0, q:0}
// SET $NY, $RZ
opcodes.set(0xcbc4, {
  name: "SET 0,h",
  bytes: "cb c4",
  doc: "Set bit 0 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(0, z80.regs.h);
  },
});

// {n:197, x:3, y:0, z:5, p:0, q:0}
// SET $NY, $RZ
opcodes.set(0xcbc5, {
  name: "SET 0,l",
  bytes: "cb c5",
  doc: "Set bit 0 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(0, z80.regs.l);
  },
});

// {n:198, x:3, y:0, z:6, p:0, q:0}
// SET $NY, (HL)
opcodes.set(0xcbc6, {
  name: "SET 0,(HL)",
  bytes: "cb c6",
  doc: "Set bit 0 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:199, x:3, y:0, z:7, p:0, q:0}
// SET $NY, $RZ
opcodes.set(0xcbc7, {
  name: "SET 0,a",
  bytes: "cb c7",
  doc: "Set bit 0 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(0, z80.regs.a);
  },
});

// {n:200, x:3, y:1, z:0, p:0, q:1}
// SET $NY, $RZ
opcodes.set(0xcbc8, {
  name: "SET 1,b",
  bytes: "cb c8",
  doc: "Set bit 1 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(1, z80.regs.b);
  },
});

// {n:201, x:3, y:1, z:1, p:0, q:1}
// SET $NY, $RZ
opcodes.set(0xcbc9, {
  name: "SET 1,c",
  bytes: "cb c9",
  doc: "Set bit 1 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(1, z80.regs.c);
  },
});

// {n:202, x:3, y:1, z:2, p:0, q:1}
// SET $NY, $RZ
opcodes.set(0xcbca, {
  name: "SET 1,d",
  bytes: "cb ca",
  doc: "Set bit 1 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(1, z80.regs.d);
  },
});

// {n:203, x:3, y:1, z:3, p:0, q:1}
// SET $NY, $RZ
opcodes.set(0xcbcb, {
  name: "SET 1,e",
  bytes: "cb cb",
  doc: "Set bit 1 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(1, z80.regs.e);
  },
});

// {n:204, x:3, y:1, z:4, p:0, q:1}
// SET $NY, $RZ
opcodes.set(0xcbcc, {
  name: "SET 1,h",
  bytes: "cb cc",
  doc: "Set bit 1 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(1, z80.regs.h);
  },
});

// {n:205, x:3, y:1, z:5, p:0, q:1}
// SET $NY, $RZ
opcodes.set(0xcbcd, {
  name: "SET 1,l",
  bytes: "cb cd",
  doc: "Set bit 1 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(1, z80.regs.l);
  },
});

// {n:206, x:3, y:1, z:6, p:0, q:1}
// SET $NY, (HL)
opcodes.set(0xcbce, {
  name: "SET 1,(HL)",
  bytes: "cb ce",
  doc: "Set bit 1 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:207, x:3, y:1, z:7, p:0, q:1}
// SET $NY, $RZ
opcodes.set(0xcbcf, {
  name: "SET 1,a",
  bytes: "cb cf",
  doc: "Set bit 1 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(1, z80.regs.a);
  },
});

// {n:208, x:3, y:2, z:0, p:1, q:0}
// SET $NY, $RZ
opcodes.set(0xcbd0, {
  name: "SET 2,b",
  bytes: "cb d0",
  doc: "Set bit 2 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(2, z80.regs.b);
  },
});

// {n:209, x:3, y:2, z:1, p:1, q:0}
// SET $NY, $RZ
opcodes.set(0xcbd1, {
  name: "SET 2,c",
  bytes: "cb d1",
  doc: "Set bit 2 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(2, z80.regs.c);
  },
});

// {n:210, x:3, y:2, z:2, p:1, q:0}
// SET $NY, $RZ
opcodes.set(0xcbd2, {
  name: "SET 2,d",
  bytes: "cb d2",
  doc: "Set bit 2 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(2, z80.regs.d);
  },
});

// {n:211, x:3, y:2, z:3, p:1, q:0}
// SET $NY, $RZ
opcodes.set(0xcbd3, {
  name: "SET 2,e",
  bytes: "cb d3",
  doc: "Set bit 2 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(2, z80.regs.e);
  },
});

// {n:212, x:3, y:2, z:4, p:1, q:0}
// SET $NY, $RZ
opcodes.set(0xcbd4, {
  name: "SET 2,h",
  bytes: "cb d4",
  doc: "Set bit 2 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(2, z80.regs.h);
  },
});

// {n:213, x:3, y:2, z:5, p:1, q:0}
// SET $NY, $RZ
opcodes.set(0xcbd5, {
  name: "SET 2,l",
  bytes: "cb d5",
  doc: "Set bit 2 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(2, z80.regs.l);
  },
});

// {n:214, x:3, y:2, z:6, p:1, q:0}
// SET $NY, (HL)
opcodes.set(0xcbd6, {
  name: "SET 2,(HL)",
  bytes: "cb d6",
  doc: "Set bit 2 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:215, x:3, y:2, z:7, p:1, q:0}
// SET $NY, $RZ
opcodes.set(0xcbd7, {
  name: "SET 2,a",
  bytes: "cb d7",
  doc: "Set bit 2 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(2, z80.regs.a);
  },
});

// {n:216, x:3, y:3, z:0, p:1, q:1}
// SET $NY, $RZ
opcodes.set(0xcbd8, {
  name: "SET 3,b",
  bytes: "cb d8",
  doc: "Set bit 3 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(3, z80.regs.b);
  },
});

// {n:217, x:3, y:3, z:1, p:1, q:1}
// SET $NY, $RZ
opcodes.set(0xcbd9, {
  name: "SET 3,c",
  bytes: "cb d9",
  doc: "Set bit 3 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(3, z80.regs.c);
  },
});

// {n:218, x:3, y:3, z:2, p:1, q:1}
// SET $NY, $RZ
opcodes.set(0xcbda, {
  name: "SET 3,d",
  bytes: "cb da",
  doc: "Set bit 3 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(3, z80.regs.d);
  },
});

// {n:219, x:3, y:3, z:3, p:1, q:1}
// SET $NY, $RZ
opcodes.set(0xcbdb, {
  name: "SET 3,e",
  bytes: "cb db",
  doc: "Set bit 3 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(3, z80.regs.e);
  },
});

// {n:220, x:3, y:3, z:4, p:1, q:1}
// SET $NY, $RZ
opcodes.set(0xcbdc, {
  name: "SET 3,h",
  bytes: "cb dc",
  doc: "Set bit 3 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(3, z80.regs.h);
  },
});

// {n:221, x:3, y:3, z:5, p:1, q:1}
// SET $NY, $RZ
opcodes.set(0xcbdd, {
  name: "SET 3,l",
  bytes: "cb dd",
  doc: "Set bit 3 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(3, z80.regs.l);
  },
});

// {n:222, x:3, y:3, z:6, p:1, q:1}
// SET $NY, (HL)
opcodes.set(0xcbde, {
  name: "SET 3,(HL)",
  bytes: "cb de",
  doc: "Set bit 3 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:223, x:3, y:3, z:7, p:1, q:1}
// SET $NY, $RZ
opcodes.set(0xcbdf, {
  name: "SET 3,a",
  bytes: "cb df",
  doc: "Set bit 3 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(3, z80.regs.a);
  },
});

// {n:224, x:3, y:4, z:0, p:2, q:0}
// SET $NY, $RZ
opcodes.set(0xcbe0, {
  name: "SET 4,b",
  bytes: "cb e0",
  doc: "Set bit 4 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(4, z80.regs.b);
  },
});

// {n:225, x:3, y:4, z:1, p:2, q:0}
// SET $NY, $RZ
opcodes.set(0xcbe1, {
  name: "SET 4,c",
  bytes: "cb e1",
  doc: "Set bit 4 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(4, z80.regs.c);
  },
});

// {n:226, x:3, y:4, z:2, p:2, q:0}
// SET $NY, $RZ
opcodes.set(0xcbe2, {
  name: "SET 4,d",
  bytes: "cb e2",
  doc: "Set bit 4 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(4, z80.regs.d);
  },
});

// {n:227, x:3, y:4, z:3, p:2, q:0}
// SET $NY, $RZ
opcodes.set(0xcbe3, {
  name: "SET 4,e",
  bytes: "cb e3",
  doc: "Set bit 4 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(4, z80.regs.e);
  },
});

// {n:228, x:3, y:4, z:4, p:2, q:0}
// SET $NY, $RZ
opcodes.set(0xcbe4, {
  name: "SET 4,h",
  bytes: "cb e4",
  doc: "Set bit 4 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(4, z80.regs.h);
  },
});

// {n:229, x:3, y:4, z:5, p:2, q:0}
// SET $NY, $RZ
opcodes.set(0xcbe5, {
  name: "SET 4,l",
  bytes: "cb e5",
  doc: "Set bit 4 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(4, z80.regs.l);
  },
});

// {n:230, x:3, y:4, z:6, p:2, q:0}
// SET $NY, (HL)
opcodes.set(0xcbe6, {
  name: "SET 4,(HL)",
  bytes: "cb e6",
  doc: "Set bit 4 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:231, x:3, y:4, z:7, p:2, q:0}
// SET $NY, $RZ
opcodes.set(0xcbe7, {
  name: "SET 4,a",
  bytes: "cb e7",
  doc: "Set bit 4 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(4, z80.regs.a);
  },
});

// {n:232, x:3, y:5, z:0, p:2, q:1}
// SET $NY, $RZ
opcodes.set(0xcbe8, {
  name: "SET 5,b",
  bytes: "cb e8",
  doc: "Set bit 5 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(5, z80.regs.b);
  },
});

// {n:233, x:3, y:5, z:1, p:2, q:1}
// SET $NY, $RZ
opcodes.set(0xcbe9, {
  name: "SET 5,c",
  bytes: "cb e9",
  doc: "Set bit 5 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(5, z80.regs.c);
  },
});

// {n:234, x:3, y:5, z:2, p:2, q:1}
// SET $NY, $RZ
opcodes.set(0xcbea, {
  name: "SET 5,d",
  bytes: "cb ea",
  doc: "Set bit 5 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(5, z80.regs.d);
  },
});

// {n:235, x:3, y:5, z:3, p:2, q:1}
// SET $NY, $RZ
opcodes.set(0xcbeb, {
  name: "SET 5,e",
  bytes: "cb eb",
  doc: "Set bit 5 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(5, z80.regs.e);
  },
});

// {n:236, x:3, y:5, z:4, p:2, q:1}
// SET $NY, $RZ
opcodes.set(0xcbec, {
  name: "SET 5,h",
  bytes: "cb ec",
  doc: "Set bit 5 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(5, z80.regs.h);
  },
});

// {n:237, x:3, y:5, z:5, p:2, q:1}
// SET $NY, $RZ
opcodes.set(0xcbed, {
  name: "SET 5,l",
  bytes: "cb ed",
  doc: "Set bit 5 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(5, z80.regs.l);
  },
});

// {n:238, x:3, y:5, z:6, p:2, q:1}
// SET $NY, (HL)
opcodes.set(0xcbee, {
  name: "SET 5,(HL)",
  bytes: "cb ee",
  doc: "Set bit 5 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:239, x:3, y:5, z:7, p:2, q:1}
// SET $NY, $RZ
opcodes.set(0xcbef, {
  name: "SET 5,a",
  bytes: "cb ef",
  doc: "Set bit 5 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(5, z80.regs.a);
  },
});

// {n:240, x:3, y:6, z:0, p:3, q:0}
// SET $NY, $RZ
opcodes.set(0xcbf0, {
  name: "SET 6,b",
  bytes: "cb f0",
  doc: "Set bit 6 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(6, z80.regs.b);
  },
});

// {n:241, x:3, y:6, z:1, p:3, q:0}
// SET $NY, $RZ
opcodes.set(0xcbf1, {
  name: "SET 6,c",
  bytes: "cb f1",
  doc: "Set bit 6 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(6, z80.regs.c);
  },
});

// {n:242, x:3, y:6, z:2, p:3, q:0}
// SET $NY, $RZ
opcodes.set(0xcbf2, {
  name: "SET 6,d",
  bytes: "cb f2",
  doc: "Set bit 6 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(6, z80.regs.d);
  },
});

// {n:243, x:3, y:6, z:3, p:3, q:0}
// SET $NY, $RZ
opcodes.set(0xcbf3, {
  name: "SET 6,e",
  bytes: "cb f3",
  doc: "Set bit 6 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(6, z80.regs.e);
  },
});

// {n:244, x:3, y:6, z:4, p:3, q:0}
// SET $NY, $RZ
opcodes.set(0xcbf4, {
  name: "SET 6,h",
  bytes: "cb f4",
  doc: "Set bit 6 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(6, z80.regs.h);
  },
});

// {n:245, x:3, y:6, z:5, p:3, q:0}
// SET $NY, $RZ
opcodes.set(0xcbf5, {
  name: "SET 6,l",
  bytes: "cb f5",
  doc: "Set bit 6 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(6, z80.regs.l);
  },
});

// {n:246, x:3, y:6, z:6, p:3, q:0}
// SET $NY, (HL)
opcodes.set(0xcbf6, {
  name: "SET 6,(HL)",
  bytes: "cb f6",
  doc: "Set bit 6 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:247, x:3, y:6, z:7, p:3, q:0}
// SET $NY, $RZ
opcodes.set(0xcbf7, {
  name: "SET 6,a",
  bytes: "cb f7",
  doc: "Set bit 6 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(6, z80.regs.a);
  },
});

// {n:248, x:3, y:7, z:0, p:3, q:1}
// SET $NY, $RZ
opcodes.set(0xcbf8, {
  name: "SET 7,b",
  bytes: "cb f8",
  doc: "Set bit 7 in register b2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(7, z80.regs.b);
  },
});

// {n:249, x:3, y:7, z:1, p:3, q:1}
// SET $NY, $RZ
opcodes.set(0xcbf9, {
  name: "SET 7,c",
  bytes: "cb f9",
  doc: "Set bit 7 in register c2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(7, z80.regs.c);
  },
});

// {n:250, x:3, y:7, z:2, p:3, q:1}
// SET $NY, $RZ
opcodes.set(0xcbfa, {
  name: "SET 7,d",
  bytes: "cb fa",
  doc: "Set bit 7 in register d2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(7, z80.regs.d);
  },
});

// {n:251, x:3, y:7, z:3, p:3, q:1}
// SET $NY, $RZ
opcodes.set(0xcbfb, {
  name: "SET 7,e",
  bytes: "cb fb",
  doc: "Set bit 7 in register e2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(7, z80.regs.e);
  },
});

// {n:252, x:3, y:7, z:4, p:3, q:1}
// SET $NY, $RZ
opcodes.set(0xcbfc, {
  name: "SET 7,h",
  bytes: "cb fc",
  doc: "Set bit 7 in register h2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(7, z80.regs.h);
  },
});

// {n:253, x:3, y:7, z:5, p:3, q:1}
// SET $NY, $RZ
opcodes.set(0xcbfd, {
  name: "SET 7,l",
  bytes: "cb fd",
  doc: "Set bit 7 in register l2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(7, z80.regs.l);
  },
});

// {n:254, x:3, y:7, z:6, p:3, q:1}
// SET $NY, (HL)
opcodes.set(0xcbfe, {
  name: "SET 7,(HL)",
  bytes: "cb fe",
  doc: "Set bit 7 of (HL)",
  group: "Set",
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$T+=1;$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.hal.tStateCount += 1;
    z80.dbus = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $ADDR, db: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:255, x:3, y:7, z:7, p:3, q:1}
// SET $NY, $RZ
opcodes.set(0xcbff, {
  name: "SET 7,a",
  bytes: "cb ff",
  doc: "Set bit 7 in register a2",
  group: "Set",
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(7, z80.regs.a);
  },
});

// {n:9, x:0, y:1, z:1, p:0, q:1}
// ADD $RI,$RP
opcodes.set(0xdd09, {
  name: "ADD ix,bc",
  bytes: "dd 09",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.ix = z80.alu.add16(z80.regs.ix, z80.regs.bc);
  },
});

// {n:25, x:0, y:3, z:1, p:1, q:1}
// ADD $RI,$RP
opcodes.set(0xdd19, {
  name: "ADD ix,de",
  bytes: "dd 19",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.ix = z80.alu.add16(z80.regs.ix, z80.regs.de);
  },
});

// {n:33, x:0, y:4, z:1, p:2, q:0}
// LD $RP,$nn
opcodes.set(0xdd21, {
  name: "LD ix,$nn",
  bytes: "dd 21 XX XX",
  doc: "ix=nn",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RPL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.ixl = z80.dbus;
    // mread: {ab: $PC++, dst: $RPH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.ixh = z80.dbus;
  },
});

// {n:34, x:0, y:4, z:2, p:2, q:0}
// LD ($nn),$RP
opcodes.set(0xdd22, {
  name: "LD ($nn),ix",
  bytes: "dd 22 XX XX",
  doc: "[nn]=ix",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mwrite: {ab: $WZ++, db: $RPL}
    z80.dbus = z80.regs.ixl;
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: $WZ, db: $RPH}
    z80.dbus = z80.regs.ixh;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:35, x:0, y:4, z:3, p:2, q:0}
// INC $RP
opcodes.set(0xdd23, {
  name: "INC ix",
  bytes: "dd 23",
  doc: "$RDDP+=1",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.inc16($RP)"}
    z80.incTStateCount(2);
    z80.regs.ix = z80.alu.inc16(z80.regs.ix);
  },
});

// {n:36, x:0, y:4, z:4, p:2, q:0}
// INC $RY
opcodes.set(0xdd24, {
  name: "INC ixh",
  bytes: "dd 24",
  doc: "ixh+=1",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.ixh = z80.alu.inc8(z80.regs.ixh);
  },
});

// {n:37, x:0, y:4, z:5, p:2, q:0}
// DEC $RY
opcodes.set(0xdd25, {
  name: "DEC ixh",
  bytes: "dd 25",
  doc: "ixh-=1",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.ixh = z80.alu.dec8(z80.regs.ixh);
  },
});

// {n:38, x:0, y:4, z:6, p:2, q:0}
// LD $RY,$n
opcodes.set(0xdd26, {
  name: "LD ixh,$n",
  bytes: "dd 26 XX",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RY}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.ixh = z80.dbus;
  },
});

// {n:41, x:0, y:5, z:1, p:2, q:1}
// ADD $RI,$RP
opcodes.set(0xdd29, {
  name: "ADD ix,ix",
  bytes: "dd 29",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.ix = z80.alu.add16(z80.regs.ix, z80.regs.ix);
  },
});

// {n:42, x:0, y:5, z:2, p:2, q:1}
// LD $RP,($nn)
opcodes.set(0xdd2a, {
  name: "LD ix,($nn)",
  bytes: "dd 2a XX XX",
  doc: "ix=($nn)",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mread: {ab: $WZ++, dst: $RPL}
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.ixl = z80.dbus;
    // mread: {ab: $WZ, dst: $RPH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.ixh = z80.dbus;
  },
});

// {n:43, x:0, y:5, z:3, p:2, q:1}
// DEC $RP
opcodes.set(0xdd2b, {
  name: "DEC ix",
  bytes: "dd 2b",
  doc: "ix-=1",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.dec16($RP)"}
    z80.incTStateCount(2);
    z80.regs.ix = z80.alu.dec16(z80.regs.ix);
  },
});

// {n:44, x:0, y:5, z:4, p:2, q:1}
// INC $RY
opcodes.set(0xdd2c, {
  name: "INC ixl",
  bytes: "dd 2c",
  doc: "ixl+=1",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.ixl = z80.alu.inc8(z80.regs.ixl);
  },
});

// {n:45, x:0, y:5, z:5, p:2, q:1}
// DEC $RY
opcodes.set(0xdd2d, {
  name: "DEC ixl",
  bytes: "dd 2d",
  doc: "ixl-=1",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.ixl = z80.alu.dec8(z80.regs.ixl);
  },
});

// {n:46, x:0, y:5, z:6, p:2, q:1}
// LD $RY,$n
opcodes.set(0xdd2e, {
  name: "LD ixl,$n",
  bytes: "dd 2e XX",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RY}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.ixl = z80.dbus;
  },
});

// {n:52, x:0, y:6, z:4, p:3, q:0}
// INC ($RI+dd)
opcodes.set(0xdd34, {
  name: "INC (ix+dd)",
  bytes: "dd 34",
  doc: "Increment (ix+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH, action: "$DLATCH=z80.alu.inc8($DLATCH)"}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.dbus = z80.alu.inc8(z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:53, x:0, y:6, z:5, p:3, q:0}
// DEC ($RI+dd)
opcodes.set(0xdd35, {
  name: "DEC (ix+dd)",
  bytes: "dd 35",
  doc: "Decrement (ix+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH, action: "$DLATCH=z80.alu.dec8($DLATCH)"}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.dbus = z80.alu.dec8(z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:54, x:0, y:6, z:6, p:3, q:0}
// LD ($RI+dd),$n
opcodes.set(0xdd36, {
  name: "LD (ix+dd),$n",
  bytes: "dd 36 XX",
  doc: "(ix+dd)=n",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {tcycles: 5, ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(2);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:57, x:0, y:7, z:1, p:3, q:1}
// ADD $RI,$RP
opcodes.set(0xdd39, {
  name: "ADD ix,sp",
  bytes: "dd 39",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.ix = z80.alu.add16(z80.regs.ix, z80.regs.sp);
  },
});

// {n:68, x:1, y:0, z:4, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0xdd44, {
  name: "LD b,ixh",
  bytes: "dd 44",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.ixh;
  },
});

// {n:69, x:1, y:0, z:5, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0xdd45, {
  name: "LD b,ixl",
  bytes: "dd 45",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.ixl;
  },
});

// {n:70, x:1, y:0, z:6, p:0, q:0}
// LD $RRY,($RI+dd)
opcodes.set(0xdd46, {
  name: "LD b,(ix+dd)",
  bytes: "dd 46",
  doc: "b=(ix+dd)",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $RRY}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.b = z80.dbus;
  },
});

// {n:76, x:1, y:1, z:4, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0xdd4c, {
  name: "LD c,ixh",
  bytes: "dd 4c",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.ixh;
  },
});

// {n:77, x:1, y:1, z:5, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0xdd4d, {
  name: "LD c,ixl",
  bytes: "dd 4d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.ixl;
  },
});

// {n:78, x:1, y:1, z:6, p:0, q:1}
// LD $RRY,($RI+dd)
opcodes.set(0xdd4e, {
  name: "LD c,(ix+dd)",
  bytes: "dd 4e",
  doc: "c=(ix+dd)",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $RRY}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.c = z80.dbus;
  },
});

// {n:84, x:1, y:2, z:4, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0xdd54, {
  name: "LD d,ixh",
  bytes: "dd 54",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.ixh;
  },
});

// {n:85, x:1, y:2, z:5, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0xdd55, {
  name: "LD d,ixl",
  bytes: "dd 55",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.ixl;
  },
});

// {n:86, x:1, y:2, z:6, p:1, q:0}
// LD $RRY,($RI+dd)
opcodes.set(0xdd56, {
  name: "LD d,(ix+dd)",
  bytes: "dd 56",
  doc: "d=(ix+dd)",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $RRY}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.d = z80.dbus;
  },
});

// {n:92, x:1, y:3, z:4, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0xdd5c, {
  name: "LD e,ixh",
  bytes: "dd 5c",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.ixh;
  },
});

// {n:93, x:1, y:3, z:5, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0xdd5d, {
  name: "LD e,ixl",
  bytes: "dd 5d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.ixl;
  },
});

// {n:94, x:1, y:3, z:6, p:1, q:1}
// LD $RRY,($RI+dd)
opcodes.set(0xdd5e, {
  name: "LD e,(ix+dd)",
  bytes: "dd 5e",
  doc: "e=(ix+dd)",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $RRY}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.e = z80.dbus;
  },
});

// {n:96, x:1, y:4, z:0, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0xdd60, {
  name: "LD ixh,b",
  bytes: "dd 60",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixh = z80.regs.b;
  },
});

// {n:97, x:1, y:4, z:1, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0xdd61, {
  name: "LD ixh,c",
  bytes: "dd 61",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixh = z80.regs.c;
  },
});

// {n:98, x:1, y:4, z:2, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0xdd62, {
  name: "LD ixh,d",
  bytes: "dd 62",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixh = z80.regs.d;
  },
});

// {n:99, x:1, y:4, z:3, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0xdd63, {
  name: "LD ixh,e",
  bytes: "dd 63",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixh = z80.regs.e;
  },
});

// {n:100, x:1, y:4, z:4, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0xdd64, {
  name: "LD ixh,ixh",
  bytes: "dd 64",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixh = z80.regs.ixh;
  },
});

// {n:101, x:1, y:4, z:5, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0xdd65, {
  name: "LD ixh,ixl",
  bytes: "dd 65",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixh = z80.regs.ixl;
  },
});

// {n:102, x:1, y:4, z:6, p:2, q:0}
// LD $RRY,($RI+dd)
opcodes.set(0xdd66, {
  name: "LD h,(ix+dd)",
  bytes: "dd 66",
  doc: "h=(ix+dd)",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $RRY}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.h = z80.dbus;
  },
});

// {n:103, x:1, y:4, z:7, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0xdd67, {
  name: "LD ixh,a",
  bytes: "dd 67",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixh = z80.regs.a;
  },
});

// {n:104, x:1, y:5, z:0, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0xdd68, {
  name: "LD ixl,b",
  bytes: "dd 68",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixl = z80.regs.b;
  },
});

// {n:105, x:1, y:5, z:1, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0xdd69, {
  name: "LD ixl,c",
  bytes: "dd 69",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixl = z80.regs.c;
  },
});

// {n:106, x:1, y:5, z:2, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0xdd6a, {
  name: "LD ixl,d",
  bytes: "dd 6a",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixl = z80.regs.d;
  },
});

// {n:107, x:1, y:5, z:3, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0xdd6b, {
  name: "LD ixl,e",
  bytes: "dd 6b",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixl = z80.regs.e;
  },
});

// {n:108, x:1, y:5, z:4, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0xdd6c, {
  name: "LD ixl,ixh",
  bytes: "dd 6c",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixl = z80.regs.ixh;
  },
});

// {n:109, x:1, y:5, z:5, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0xdd6d, {
  name: "LD ixl,ixl",
  bytes: "dd 6d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixl = z80.regs.ixl;
  },
});

// {n:110, x:1, y:5, z:6, p:2, q:1}
// LD $RRY,($RI+dd)
opcodes.set(0xdd6e, {
  name: "LD l,(ix+dd)",
  bytes: "dd 6e",
  doc: "l=(ix+dd)",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $RRY}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.l = z80.dbus;
  },
});

// {n:111, x:1, y:5, z:7, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0xdd6f, {
  name: "LD ixl,a",
  bytes: "dd 6f",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixl = z80.regs.a;
  },
});

// {n:112, x:1, y:6, z:0, p:3, q:0}
// LD ($RI+dd),$RRZ
opcodes.set(0xdd70, {
  name: "LD (ix+dd),b",
  bytes: "dd 70",
  doc: "(ix+dd) = b",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:113, x:1, y:6, z:1, p:3, q:0}
// LD ($RI+dd),$RRZ
opcodes.set(0xdd71, {
  name: "LD (ix+dd),c",
  bytes: "dd 71",
  doc: "(ix+dd) = c",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:114, x:1, y:6, z:2, p:3, q:0}
// LD ($RI+dd),$RRZ
opcodes.set(0xdd72, {
  name: "LD (ix+dd),d",
  bytes: "dd 72",
  doc: "(ix+dd) = d",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:115, x:1, y:6, z:3, p:3, q:0}
// LD ($RI+dd),$RRZ
opcodes.set(0xdd73, {
  name: "LD (ix+dd),e",
  bytes: "dd 73",
  doc: "(ix+dd) = e",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:116, x:1, y:6, z:4, p:3, q:0}
// LD ($RI+dd),$RRZ
opcodes.set(0xdd74, {
  name: "LD (ix+dd),h",
  bytes: "dd 74",
  doc: "(ix+dd) = h",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:117, x:1, y:6, z:5, p:3, q:0}
// LD ($RI+dd),$RRZ
opcodes.set(0xdd75, {
  name: "LD (ix+dd),l",
  bytes: "dd 75",
  doc: "(ix+dd) = l",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:119, x:1, y:6, z:7, p:3, q:0}
// LD ($RI+dd),$RRZ
opcodes.set(0xdd77, {
  name: "LD (ix+dd),a",
  bytes: "dd 77",
  doc: "(ix+dd) = a",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:124, x:1, y:7, z:4, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0xdd7c, {
  name: "LD a,ixh",
  bytes: "dd 7c",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.ixh;
  },
});

// {n:125, x:1, y:7, z:5, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0xdd7d, {
  name: "LD a,ixl",
  bytes: "dd 7d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.ixl;
  },
});

// {n:126, x:1, y:7, z:6, p:3, q:1}
// LD $RRY,($RI+dd)
opcodes.set(0xdd7e, {
  name: "LD a,(ix+dd)",
  bytes: "dd 7e",
  doc: "a=(ix+dd)",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $RRY}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.a = z80.dbus;
  },
});

// {n:132, x:2, y:0, z:4, p:0, q:0}
// $ALU $RZ
opcodes.set(0xdd84, {
  name: "add8 ixh",
  bytes: "dd 84",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add8(z80.regs.ixh);
  },
});

// {n:133, x:2, y:0, z:5, p:0, q:0}
// $ALU $RZ
opcodes.set(0xdd85, {
  name: "add8 ixl",
  bytes: "dd 85",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add8(z80.regs.ixl);
  },
});

// {n:134, x:2, y:0, z:6, p:0, q:0}
// $ALU ($RI+dd)
opcodes.set(0xdd86, {
  name: "add8 (ix+dd)",
  bytes: "dd 86",
  doc: "A=A $ALU (ix+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.add8(z80.dbus);
  },
});

// {n:140, x:2, y:1, z:4, p:0, q:1}
// $ALU $RZ
opcodes.set(0xdd8c, {
  name: "adc8 ixh",
  bytes: "dd 8c",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc8(z80.regs.ixh);
  },
});

// {n:141, x:2, y:1, z:5, p:0, q:1}
// $ALU $RZ
opcodes.set(0xdd8d, {
  name: "adc8 ixl",
  bytes: "dd 8d",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc8(z80.regs.ixl);
  },
});

// {n:142, x:2, y:1, z:6, p:0, q:1}
// $ALU ($RI+dd)
opcodes.set(0xdd8e, {
  name: "adc8 (ix+dd)",
  bytes: "dd 8e",
  doc: "A=A $ALU (ix+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.adc8(z80.dbus);
  },
});

// {n:148, x:2, y:2, z:4, p:1, q:0}
// $ALU $RZ
opcodes.set(0xdd94, {
  name: "sub8 ixh",
  bytes: "dd 94",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub8(z80.regs.ixh);
  },
});

// {n:149, x:2, y:2, z:5, p:1, q:0}
// $ALU $RZ
opcodes.set(0xdd95, {
  name: "sub8 ixl",
  bytes: "dd 95",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub8(z80.regs.ixl);
  },
});

// {n:150, x:2, y:2, z:6, p:1, q:0}
// $ALU ($RI+dd)
opcodes.set(0xdd96, {
  name: "sub8 (ix+dd)",
  bytes: "dd 96",
  doc: "A=A $ALU (ix+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.sub8(z80.dbus);
  },
});

// {n:156, x:2, y:3, z:4, p:1, q:1}
// $ALU $RZ
opcodes.set(0xdd9c, {
  name: "sbc8 ixh",
  bytes: "dd 9c",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc8(z80.regs.ixh);
  },
});

// {n:157, x:2, y:3, z:5, p:1, q:1}
// $ALU $RZ
opcodes.set(0xdd9d, {
  name: "sbc8 ixl",
  bytes: "dd 9d",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc8(z80.regs.ixl);
  },
});

// {n:158, x:2, y:3, z:6, p:1, q:1}
// $ALU ($RI+dd)
opcodes.set(0xdd9e, {
  name: "sbc8 (ix+dd)",
  bytes: "dd 9e",
  doc: "A=A $ALU (ix+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.sbc8(z80.dbus);
  },
});

// {n:164, x:2, y:4, z:4, p:2, q:0}
// $ALU $RZ
opcodes.set(0xdda4, {
  name: "and8 ixh",
  bytes: "dd a4",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and8(z80.regs.ixh);
  },
});

// {n:165, x:2, y:4, z:5, p:2, q:0}
// $ALU $RZ
opcodes.set(0xdda5, {
  name: "and8 ixl",
  bytes: "dd a5",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and8(z80.regs.ixl);
  },
});

// {n:166, x:2, y:4, z:6, p:2, q:0}
// $ALU ($RI+dd)
opcodes.set(0xdda6, {
  name: "and8 (ix+dd)",
  bytes: "dd a6",
  doc: "A=A $ALU (ix+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.and8(z80.dbus);
  },
});

// {n:172, x:2, y:5, z:4, p:2, q:1}
// $ALU $RZ
opcodes.set(0xddac, {
  name: "xor8 ixh",
  bytes: "dd ac",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor8(z80.regs.ixh);
  },
});

// {n:173, x:2, y:5, z:5, p:2, q:1}
// $ALU $RZ
opcodes.set(0xddad, {
  name: "xor8 ixl",
  bytes: "dd ad",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor8(z80.regs.ixl);
  },
});

// {n:174, x:2, y:5, z:6, p:2, q:1}
// $ALU ($RI+dd)
opcodes.set(0xddae, {
  name: "xor8 (ix+dd)",
  bytes: "dd ae",
  doc: "A=A $ALU (ix+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.xor8(z80.dbus);
  },
});

// {n:180, x:2, y:6, z:4, p:3, q:0}
// $ALU $RZ
opcodes.set(0xddb4, {
  name: "or8 ixh",
  bytes: "dd b4",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or8(z80.regs.ixh);
  },
});

// {n:181, x:2, y:6, z:5, p:3, q:0}
// $ALU $RZ
opcodes.set(0xddb5, {
  name: "or8 ixl",
  bytes: "dd b5",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or8(z80.regs.ixl);
  },
});

// {n:182, x:2, y:6, z:6, p:3, q:0}
// $ALU ($RI+dd)
opcodes.set(0xddb6, {
  name: "or8 (ix+dd)",
  bytes: "dd b6",
  doc: "A=A $ALU (ix+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.or8(z80.dbus);
  },
});

// {n:188, x:2, y:7, z:4, p:3, q:1}
// $ALU $RZ
opcodes.set(0xddbc, {
  name: "cp8 ixh",
  bytes: "dd bc",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp8(z80.regs.ixh);
  },
});

// {n:189, x:2, y:7, z:5, p:3, q:1}
// $ALU $RZ
opcodes.set(0xddbd, {
  name: "cp8 ixl",
  bytes: "dd bd",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp8(z80.regs.ixl);
  },
});

// {n:190, x:2, y:7, z:6, p:3, q:1}
// $ALU ($RI+dd)
opcodes.set(0xddbe, {
  name: "cp8 (ix+dd)",
  bytes: "dd be",
  doc: "A=A $ALU (ix+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.ix, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.cp8(z80.dbus);
  },
});

// {n:203, x:3, y:1, z:3, p:0, q:1}
// CB prefix
opcodes.set(0xddcb, {
  name: "CB XXX",
  bytes: "dd cb",
  group: "Prefix",
  fn: (z80) => {
    // overlapped: {prefix: ddcb}
    z80.decodeDDCB();
  },
});

// {n:225, x:3, y:4, z:1, p:2, q:0}
// POP $RP2
opcodes.set(0xdde1, {
  name: "POP ix",
  bytes: "dd e1",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $SP++, dst: $RP2L}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.ixl = z80.dbus;
    // mread: {ab: $SP++, dst: $RP2H}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.ixh = z80.dbus;
  },
});

// {n:227, x:3, y:4, z:3, p:2, q:0}
// EX (SP),$RI
opcodes.set(0xdde3, {
  name: "EX (SP),ix",
  bytes: "dd e3",
  group: "Transfer",
  fn: (z80) => {
    // mread: {ab: $SP, dst: $WZL}
    z80.abus = z80.regs.sp;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {tcycles: 4, ab: $SP+1, dst: $WZH}
    z80.abus = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.w = z80.dbus;
    // mwrite: {ab: $SP+1, db: $RPH}
    z80.dbus = z80.regs.ixh;
    z80.abus = inc16(z80.regs.sp);
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {tcycles: 5, ab: $SP, db: $RPL, action: "$RP=$WZ"}
    z80.dbus = z80.regs.ixl;
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.incTStateCount(2);
    z80.regs.ix = z80.regs.wz;
  },
});

// {n:229, x:3, y:4, z:5, p:2, q:0}
// PUSH $RP2
opcodes.set(0xdde5, {
  name: "PUSH ix",
  bytes: "dd e5",
  group: "Load 16bit",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $RP2H}
    z80.dbus = z80.regs.ixh;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $RP2L}
    z80.dbus = z80.regs.ixl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:233, x:3, y:5, z:1, p:2, q:1}
// JP $RI
opcodes.set(0xdde9, {
  name: "JP ix",
  bytes: "dd e9",
  doc: "JMP to ix",
  group: "Control flow",
  fn: (z80) => {
    // overlapped: {action: "$PC=$RP"}
    z80.regs.pc = z80.regs.ix;
  },
});

// {n:249, x:3, y:7, z:1, p:3, q:1}
// LD SP,$RI
opcodes.set(0xddf9, {
  name: "LD SP,ix",
  bytes: "dd f9",
  group: "Load 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$SP=$RI"}
    z80.incTStateCount(2);
    z80.regs.sp = z80.regs.ix;
  },
});

// {n:64, x:1, y:0, z:0, p:0, q:0}
// IN $RY,(C)
opcodes.set(0xed40, {
  name: "IN b,(C)",
  bytes: "ed 40",
  group: "IO",
  fn: (z80) => {
    // ioread: {ab: $BC, dst: $DLATCH, action: "$WZ=$BC+1"}
    z80.abus = z80.regs.bc;
    z80.dbus = z80.readPort(z80.abus);
    z80.regs.wz = inc16(z80.regs.bc);
    // overlapped: {action: "$RY=z80.alu.in($DLATCH)"}
    z80.regs.b = z80.alu.in(z80.dbus);
  },
});

// {n:65, x:1, y:0, z:1, p:0, q:0}
// OUT (C),$RY
opcodes.set(0xed41, {
  name: "OUT (C),b",
  bytes: "ed 41",
  group: "IO",
  fn: (z80) => {
    // iowrite: {ab: $BC, db: $RY, action: "$WZ=$BC+1"}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.bc;
    z80.writePort(z80.abus, z80.dbus);
    z80.regs.wz = inc16(z80.regs.bc);
  },
});

// {n:66, x:1, y:0, z:2, p:0, q:0}
// SBC HL,$RP
opcodes.set(0xed42, {
  name: "SBC HL,bc",
  bytes: "ed 42",
  doc: "16bit sub with carry",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.sbc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.sbc16(z80.regs.bc);
  },
});

// {n:67, x:1, y:0, z:3, p:0, q:0}
// LD ($nn),$RP
opcodes.set(0xed43, {
  name: "LD ($nn),bc",
  bytes: "ed 43 XX XX",
  doc: "($nn)=bc",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mwrite: {ab: $WZ++, db: $RPL}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: $WZ, db: $RPH}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:68, x:1, y:0, z:4, p:0, q:0}
// NEG
opcodes.set(0xed44, {
  name: "NEG",
  bytes: "ed 44",
  doc: "A=-A",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:69, x:1, y:0, z:5, p:0, q:0}
// RETN
opcodes.set(0xed45, {
  name: "RETN",
  bytes: "ed 45",
  doc: "Return from NMI",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $SP++, dst: $WZL}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
    // overlapped: {post_action: "$IFF1=$IFF2"}
    z80.regs.iff1 = z80.regs.iff2;
  },
});

// {n:70, x:1, y:0, z:6, p:0, q:0}
// IM $IMY
opcodes.set(0xed46, {
  name: "IM 0",
  bytes: "ed 46",
  doc: "Interrupt mode",
  group: "Interrupt",
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 0;
  },
});

// {n:71, x:1, y:0, z:7, p:0, q:0}
// LD I,A
opcodes.set(0xed47, {
  name: "LD I,A",
  bytes: "ed 47",
  doc: "I=A",
  group: "Load 1bit",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // overlapped: {action: "z80.regs.i=z80.regs.a"}
    z80.regs.i = z80.regs.a;
  },
});

// {n:72, x:1, y:1, z:0, p:0, q:1}
// IN $RY,(C)
opcodes.set(0xed48, {
  name: "IN c,(C)",
  bytes: "ed 48",
  group: "IO",
  fn: (z80) => {
    // ioread: {ab: $BC, dst: $DLATCH, action: "$WZ=$BC+1"}
    z80.abus = z80.regs.bc;
    z80.dbus = z80.readPort(z80.abus);
    z80.regs.wz = inc16(z80.regs.bc);
    // overlapped: {action: "$RY=z80.alu.in($DLATCH)"}
    z80.regs.c = z80.alu.in(z80.dbus);
  },
});

// {n:73, x:1, y:1, z:1, p:0, q:1}
// OUT (C),$RY
opcodes.set(0xed49, {
  name: "OUT (C),c",
  bytes: "ed 49",
  group: "IO",
  fn: (z80) => {
    // iowrite: {ab: $BC, db: $RY, action: "$WZ=$BC+1"}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.bc;
    z80.writePort(z80.abus, z80.dbus);
    z80.regs.wz = inc16(z80.regs.bc);
  },
});

// {n:74, x:1, y:1, z:2, p:0, q:1}
// ADC HL,$RP
opcodes.set(0xed4a, {
  name: "ADC HL,bc",
  bytes: "ed 4a",
  doc: "16bit add with carry",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.adc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.adc16(z80.regs.bc);
  },
});

// {n:75, x:1, y:1, z:3, p:0, q:1}
// LD $RP,($nn)
opcodes.set(0xed4b, {
  name: "LD bc,($nn)",
  bytes: "ed 4b XX XX",
  doc: "bc=nn",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mread: {ab: $WZ++, dst: $RPL}
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.c = z80.dbus;
    // mread: {ab: $WZ, dst: $RPH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.b = z80.dbus;
  },
});

// {n:76, x:1, y:1, z:4, p:0, q:1}
// NEG
opcodes.set(0xed4c, {
  name: "NEG",
  bytes: "ed 4c",
  doc: "A=-A",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:77, x:1, y:1, z:5, p:0, q:1}
// RETI
opcodes.set(0xed4d, {
  name: "RETI",
  bytes: "ed 4d",
  doc: "Return from interrupt",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $SP++, dst: $WZL, action: "z80.pins|=z80.PINS.RETI"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    z80.pins |= z80.PINS.RETI;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
    // overlapped: {post_action: "$IFF1=$IFF2"}
    z80.regs.iff1 = z80.regs.iff2;
  },
});

// {n:78, x:1, y:1, z:6, p:0, q:1}
// IM $IMY
opcodes.set(0xed4e, {
  name: "IM 0",
  bytes: "ed 4e",
  doc: "Interrupt mode",
  group: "Interrupt",
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 0;
  },
});

// {n:79, x:1, y:1, z:7, p:0, q:1}
// LD R,A
opcodes.set(0xed4f, {
  name: "LD R,A",
  bytes: "ed 4f",
  doc: "R=A",
  group: "Load 1bit",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // overlapped: {action: "z80.regs.r=z80.regs.r7=z80.regs.a"}
    z80.regs.r = z80.regs.r7 = z80.regs.a;
  },
});

// {n:80, x:1, y:2, z:0, p:1, q:0}
// IN $RY,(C)
opcodes.set(0xed50, {
  name: "IN d,(C)",
  bytes: "ed 50",
  group: "IO",
  fn: (z80) => {
    // ioread: {ab: $BC, dst: $DLATCH, action: "$WZ=$BC+1"}
    z80.abus = z80.regs.bc;
    z80.dbus = z80.readPort(z80.abus);
    z80.regs.wz = inc16(z80.regs.bc);
    // overlapped: {action: "$RY=z80.alu.in($DLATCH)"}
    z80.regs.d = z80.alu.in(z80.dbus);
  },
});

// {n:81, x:1, y:2, z:1, p:1, q:0}
// OUT (C),$RY
opcodes.set(0xed51, {
  name: "OUT (C),d",
  bytes: "ed 51",
  group: "IO",
  fn: (z80) => {
    // iowrite: {ab: $BC, db: $RY, action: "$WZ=$BC+1"}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.bc;
    z80.writePort(z80.abus, z80.dbus);
    z80.regs.wz = inc16(z80.regs.bc);
  },
});

// {n:82, x:1, y:2, z:2, p:1, q:0}
// SBC HL,$RP
opcodes.set(0xed52, {
  name: "SBC HL,de",
  bytes: "ed 52",
  doc: "16bit sub with carry",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.sbc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.sbc16(z80.regs.de);
  },
});

// {n:83, x:1, y:2, z:3, p:1, q:0}
// LD ($nn),$RP
opcodes.set(0xed53, {
  name: "LD ($nn),de",
  bytes: "ed 53 XX XX",
  doc: "($nn)=de",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mwrite: {ab: $WZ++, db: $RPL}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: $WZ, db: $RPH}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:84, x:1, y:2, z:4, p:1, q:0}
// NEG
opcodes.set(0xed54, {
  name: "NEG",
  bytes: "ed 54",
  doc: "A=-A",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:85, x:1, y:2, z:5, p:1, q:0}
// RETI
opcodes.set(0xed55, {
  name: "RETI",
  bytes: "ed 55",
  doc: "Return from interrupt",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $SP++, dst: $WZL, action: "z80.pins|=z80.PINS.RETI"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    z80.pins |= z80.PINS.RETI;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
    // overlapped: {post_action: "$IFF1=$IFF2"}
    z80.regs.iff1 = z80.regs.iff2;
  },
});

// {n:86, x:1, y:2, z:6, p:1, q:0}
// IM $IMY
opcodes.set(0xed56, {
  name: "IM 1",
  bytes: "ed 56",
  doc: "Interrupt mode",
  group: "Interrupt",
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 1;
  },
});

// {n:87, x:1, y:2, z:7, p:1, q:0}
// LD A,I
opcodes.set(0xed57, {
  name: "LD A,I",
  bytes: "ed 57",
  doc: "A=I",
  group: "Load 1bit",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // overlapped: {action: "z80.regs.a=z80.regs.i;z80.alu.sziff2()"}
    z80.regs.a = z80.regs.i;
    z80.alu.sziff2();
  },
});

// {n:88, x:1, y:3, z:0, p:1, q:1}
// IN $RY,(C)
opcodes.set(0xed58, {
  name: "IN e,(C)",
  bytes: "ed 58",
  group: "IO",
  fn: (z80) => {
    // ioread: {ab: $BC, dst: $DLATCH, action: "$WZ=$BC+1"}
    z80.abus = z80.regs.bc;
    z80.dbus = z80.readPort(z80.abus);
    z80.regs.wz = inc16(z80.regs.bc);
    // overlapped: {action: "$RY=z80.alu.in($DLATCH)"}
    z80.regs.e = z80.alu.in(z80.dbus);
  },
});

// {n:89, x:1, y:3, z:1, p:1, q:1}
// OUT (C),$RY
opcodes.set(0xed59, {
  name: "OUT (C),e",
  bytes: "ed 59",
  group: "IO",
  fn: (z80) => {
    // iowrite: {ab: $BC, db: $RY, action: "$WZ=$BC+1"}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.bc;
    z80.writePort(z80.abus, z80.dbus);
    z80.regs.wz = inc16(z80.regs.bc);
  },
});

// {n:90, x:1, y:3, z:2, p:1, q:1}
// ADC HL,$RP
opcodes.set(0xed5a, {
  name: "ADC HL,de",
  bytes: "ed 5a",
  doc: "16bit add with carry",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.adc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.adc16(z80.regs.de);
  },
});

// {n:91, x:1, y:3, z:3, p:1, q:1}
// LD $RP,($nn)
opcodes.set(0xed5b, {
  name: "LD de,($nn)",
  bytes: "ed 5b XX XX",
  doc: "de=nn",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mread: {ab: $WZ++, dst: $RPL}
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.e = z80.dbus;
    // mread: {ab: $WZ, dst: $RPH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.d = z80.dbus;
  },
});

// {n:92, x:1, y:3, z:4, p:1, q:1}
// NEG
opcodes.set(0xed5c, {
  name: "NEG",
  bytes: "ed 5c",
  doc: "A=-A",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:93, x:1, y:3, z:5, p:1, q:1}
// RETI
opcodes.set(0xed5d, {
  name: "RETI",
  bytes: "ed 5d",
  doc: "Return from interrupt",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $SP++, dst: $WZL, action: "z80.pins|=z80.PINS.RETI"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    z80.pins |= z80.PINS.RETI;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
    // overlapped: {post_action: "$IFF1=$IFF2"}
    z80.regs.iff1 = z80.regs.iff2;
  },
});

// {n:94, x:1, y:3, z:6, p:1, q:1}
// IM $IMY
opcodes.set(0xed5e, {
  name: "IM 2",
  bytes: "ed 5e",
  doc: "Interrupt mode",
  group: "Interrupt",
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 2;
  },
});

// {n:95, x:1, y:3, z:7, p:1, q:1}
// LD A,R
opcodes.set(0xed5f, {
  name: "LD A,R",
  bytes: "ed 5f",
  doc: "A=R",
  group: "Load 1bit",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // overlapped: {action: "z80.regs.a=z80.regs.rCombined;z80.alu.sziff2()"}
    z80.regs.a = z80.regs.rCombined;
    z80.alu.sziff2();
  },
});

// {n:96, x:1, y:4, z:0, p:2, q:0}
// IN $RY,(C)
opcodes.set(0xed60, {
  name: "IN h,(C)",
  bytes: "ed 60",
  group: "IO",
  fn: (z80) => {
    // ioread: {ab: $BC, dst: $DLATCH, action: "$WZ=$BC+1"}
    z80.abus = z80.regs.bc;
    z80.dbus = z80.readPort(z80.abus);
    z80.regs.wz = inc16(z80.regs.bc);
    // overlapped: {action: "$RY=z80.alu.in($DLATCH)"}
    z80.regs.h = z80.alu.in(z80.dbus);
  },
});

// {n:97, x:1, y:4, z:1, p:2, q:0}
// OUT (C),$RY
opcodes.set(0xed61, {
  name: "OUT (C),h",
  bytes: "ed 61",
  group: "IO",
  fn: (z80) => {
    // iowrite: {ab: $BC, db: $RY, action: "$WZ=$BC+1"}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.bc;
    z80.writePort(z80.abus, z80.dbus);
    z80.regs.wz = inc16(z80.regs.bc);
  },
});

// {n:98, x:1, y:4, z:2, p:2, q:0}
// SBC HL,$RP
opcodes.set(0xed62, {
  name: "SBC HL,hl",
  bytes: "ed 62",
  doc: "16bit sub with carry",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.sbc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.sbc16(z80.regs.hl);
  },
});

// {n:99, x:1, y:4, z:3, p:2, q:0}
// LD ($nn),$RP
opcodes.set(0xed63, {
  name: "LD ($nn),hl",
  bytes: "ed 63 XX XX",
  doc: "($nn)=hl",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mwrite: {ab: $WZ++, db: $RPL}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: $WZ, db: $RPH}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:100, x:1, y:4, z:4, p:2, q:0}
// NEG
opcodes.set(0xed64, {
  name: "NEG",
  bytes: "ed 64",
  doc: "A=-A",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:101, x:1, y:4, z:5, p:2, q:0}
// RETI
opcodes.set(0xed65, {
  name: "RETI",
  bytes: "ed 65",
  doc: "Return from interrupt",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $SP++, dst: $WZL, action: "z80.pins|=z80.PINS.RETI"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    z80.pins |= z80.PINS.RETI;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
    // overlapped: {post_action: "$IFF1=$IFF2"}
    z80.regs.iff1 = z80.regs.iff2;
  },
});

// {n:102, x:1, y:4, z:6, p:2, q:0}
// IM $IMY
opcodes.set(0xed66, {
  name: "IM 0",
  bytes: "ed 66",
  doc: "Interrupt mode",
  group: "Interrupt",
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 0;
  },
});

// {n:103, x:1, y:4, z:7, p:2, q:0}
// RRD
opcodes.set(0xed67, {
  name: "RRD",
  bytes: "ed 67",
  doc: "Rotate right 4 bits: {A,[HL]}=4->{A,[HL]}",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $HL, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // generic: {tcycles: 4, action: "$DLATCH=z80.alu.rrd($DLATCH)"}
    z80.incTStateCount(4);
    z80.dbus = z80.alu.rrd(z80.dbus);
    // mwrite: {ab: $HL, db: $DLATCH, action: "$WZ=$HL+1"}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.wz = inc16(z80.regs.hl);
  },
});

// {n:104, x:1, y:5, z:0, p:2, q:1}
// IN $RY,(C)
opcodes.set(0xed68, {
  name: "IN l,(C)",
  bytes: "ed 68",
  group: "IO",
  fn: (z80) => {
    // ioread: {ab: $BC, dst: $DLATCH, action: "$WZ=$BC+1"}
    z80.abus = z80.regs.bc;
    z80.dbus = z80.readPort(z80.abus);
    z80.regs.wz = inc16(z80.regs.bc);
    // overlapped: {action: "$RY=z80.alu.in($DLATCH)"}
    z80.regs.l = z80.alu.in(z80.dbus);
  },
});

// {n:105, x:1, y:5, z:1, p:2, q:1}
// OUT (C),$RY
opcodes.set(0xed69, {
  name: "OUT (C),l",
  bytes: "ed 69",
  group: "IO",
  fn: (z80) => {
    // iowrite: {ab: $BC, db: $RY, action: "$WZ=$BC+1"}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.bc;
    z80.writePort(z80.abus, z80.dbus);
    z80.regs.wz = inc16(z80.regs.bc);
  },
});

// {n:106, x:1, y:5, z:2, p:2, q:1}
// ADC HL,$RP
opcodes.set(0xed6a, {
  name: "ADC HL,hl",
  bytes: "ed 6a",
  doc: "16bit add with carry",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.adc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.adc16(z80.regs.hl);
  },
});

// {n:107, x:1, y:5, z:3, p:2, q:1}
// LD $RP,($nn)
opcodes.set(0xed6b, {
  name: "LD hl,($nn)",
  bytes: "ed 6b XX XX",
  doc: "hl=nn",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mread: {ab: $WZ++, dst: $RPL}
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.l = z80.dbus;
    // mread: {ab: $WZ, dst: $RPH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.h = z80.dbus;
  },
});

// {n:108, x:1, y:5, z:4, p:2, q:1}
// NEG
opcodes.set(0xed6c, {
  name: "NEG",
  bytes: "ed 6c",
  doc: "A=-A",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:109, x:1, y:5, z:5, p:2, q:1}
// RETI
opcodes.set(0xed6d, {
  name: "RETI",
  bytes: "ed 6d",
  doc: "Return from interrupt",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $SP++, dst: $WZL, action: "z80.pins|=z80.PINS.RETI"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    z80.pins |= z80.PINS.RETI;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
    // overlapped: {post_action: "$IFF1=$IFF2"}
    z80.regs.iff1 = z80.regs.iff2;
  },
});

// {n:110, x:1, y:5, z:6, p:2, q:1}
// IM $IMY
opcodes.set(0xed6e, {
  name: "IM 0",
  bytes: "ed 6e",
  doc: "Interrupt mode",
  group: "Interrupt",
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 0;
  },
});

// {n:111, x:1, y:5, z:7, p:2, q:1}
// RLD
opcodes.set(0xed6f, {
  name: "RLD",
  bytes: "ed 6f",
  doc: "Rotate left 4 bits: {A,[HL]}={A,[HL]}<-4",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $HL, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // generic: {tcycles: 4, action: "$DLATCH=z80.alu.rld($DLATCH)"}
    z80.incTStateCount(4);
    z80.dbus = z80.alu.rld(z80.dbus);
    // mwrite: {ab: $HL, db: $DLATCH, action: "$WZ=$HL+1"}
    z80.abus = z80.regs.hl;
    z80.writeByte(z80.abus, z80.dbus);
    z80.regs.wz = inc16(z80.regs.hl);
  },
});

// {n:112, x:1, y:6, z:0, p:3, q:0}
// IN (C)
opcodes.set(0xed70, {
  name: "IN (C)",
  bytes: "ed 70",
  group: "IO",
  fn: (z80) => {
    // ioread: {ab: $BC, dst: $DLATCH, action: "$WZ=$BC+1"}
    z80.abus = z80.regs.bc;
    z80.dbus = z80.readPort(z80.abus);
    z80.regs.wz = inc16(z80.regs.bc);
    // overlapped: {action: "z80.alu.in($DLATCH)"}
    z80.alu.in(z80.dbus);
  },
});

// {n:113, x:1, y:6, z:1, p:3, q:0}
// OUT (C), $ZERO
opcodes.set(0xed71, {
  name: "OUT (C),0",
  bytes: "ed 71",
  group: "IO",
  fn: (z80) => {
    // iowrite: {ab: $BC, db: $ZERO, action: "$WZ=$BC+1"}
    z80.dbus = 0;
    z80.abus = z80.regs.bc;
    z80.writePort(z80.abus, z80.dbus);
    z80.regs.wz = inc16(z80.regs.bc);
  },
});

// {n:114, x:1, y:6, z:2, p:3, q:0}
// SBC HL,$RP
opcodes.set(0xed72, {
  name: "SBC HL,sp",
  bytes: "ed 72",
  doc: "16bit sub with carry",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.sbc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.sbc16(z80.regs.sp);
  },
});

// {n:115, x:1, y:6, z:3, p:3, q:0}
// LD ($nn),$RP
opcodes.set(0xed73, {
  name: "LD ($nn),sp",
  bytes: "ed 73 XX XX",
  doc: "($nn)=sp",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mwrite: {ab: $WZ++, db: $RPL}
    z80.dbus = z80.regs.spl;
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: $WZ, db: $RPH}
    z80.dbus = z80.regs.sph;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:116, x:1, y:6, z:4, p:3, q:0}
// NEG
opcodes.set(0xed74, {
  name: "NEG",
  bytes: "ed 74",
  doc: "A=-A",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:117, x:1, y:6, z:5, p:3, q:0}
// RETI
opcodes.set(0xed75, {
  name: "RETI",
  bytes: "ed 75",
  doc: "Return from interrupt",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $SP++, dst: $WZL, action: "z80.pins|=z80.PINS.RETI"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    z80.pins |= z80.PINS.RETI;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
    // overlapped: {post_action: "$IFF1=$IFF2"}
    z80.regs.iff1 = z80.regs.iff2;
  },
});

// {n:118, x:1, y:6, z:6, p:3, q:0}
// IM $IMY
opcodes.set(0xed76, {
  name: "IM 1",
  bytes: "ed 76",
  doc: "Interrupt mode",
  group: "Interrupt",
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 1;
  },
});

// {n:120, x:1, y:7, z:0, p:3, q:1}
// IN $RY,(C)
opcodes.set(0xed78, {
  name: "IN a,(C)",
  bytes: "ed 78",
  group: "IO",
  fn: (z80) => {
    // ioread: {ab: $BC, dst: $DLATCH, action: "$WZ=$BC+1"}
    z80.abus = z80.regs.bc;
    z80.dbus = z80.readPort(z80.abus);
    z80.regs.wz = inc16(z80.regs.bc);
    // overlapped: {action: "$RY=z80.alu.in($DLATCH)"}
    z80.regs.a = z80.alu.in(z80.dbus);
  },
});

// {n:121, x:1, y:7, z:1, p:3, q:1}
// OUT (C),$RY
opcodes.set(0xed79, {
  name: "OUT (C),a",
  bytes: "ed 79",
  group: "IO",
  fn: (z80) => {
    // iowrite: {ab: $BC, db: $RY, action: "$WZ=$BC+1"}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.bc;
    z80.writePort(z80.abus, z80.dbus);
    z80.regs.wz = inc16(z80.regs.bc);
  },
});

// {n:122, x:1, y:7, z:2, p:3, q:1}
// ADC HL,$RP
opcodes.set(0xed7a, {
  name: "ADC HL,sp",
  bytes: "ed 7a",
  doc: "16bit add with carry",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.adc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.adc16(z80.regs.sp);
  },
});

// {n:123, x:1, y:7, z:3, p:3, q:1}
// LD $RP,($nn)
opcodes.set(0xed7b, {
  name: "LD sp,($nn)",
  bytes: "ed 7b XX XX",
  doc: "sp=nn",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mread: {ab: $WZ++, dst: $RPL}
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.spl = z80.dbus;
    // mread: {ab: $WZ, dst: $RPH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.sph = z80.dbus;
  },
});

// {n:124, x:1, y:7, z:4, p:3, q:1}
// NEG
opcodes.set(0xed7c, {
  name: "NEG",
  bytes: "ed 7c",
  doc: "A=-A",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:125, x:1, y:7, z:5, p:3, q:1}
// RETI
opcodes.set(0xed7d, {
  name: "RETI",
  bytes: "ed 7d",
  doc: "Return from interrupt",
  group: "Control flow",
  fn: (z80) => {
    // mread: {ab: $SP++, dst: $WZL, action: "z80.pins|=z80.PINS.RETI"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    z80.pins |= z80.PINS.RETI;
    // mread: {ab: $SP++, dst: $WZH, action: "$PC=$WZ"}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    z80.regs.pc = z80.regs.wz;
    // overlapped: {post_action: "$IFF1=$IFF2"}
    z80.regs.iff1 = z80.regs.iff2;
  },
});

// {n:126, x:1, y:7, z:6, p:3, q:1}
// IM $IMY
opcodes.set(0xed7e, {
  name: "IM 2",
  bytes: "ed 7e",
  doc: "Interrupt mode",
  group: "Interrupt",
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 2;
  },
});

// {n:160, x:2, y:4, z:0, p:2, q:0}
// LDI
opcodes.set(0xeda0, {
  name: "LDI",
  bytes: "ed a0",
  doc: "Load and increment: [DE]=[HL],HL+=1,DE+=1,BC-=1",
  group: "Transfer 16bit",
  fn: (z80) => {
    // mread: {ab: $HL++, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.regs.hl = inc16(z80.regs.hl);
    z80.dbus = z80.readByte(z80.abus);
    // mwrite: {ab: $DE++, db: $DLATCH}
    z80.abus = z80.regs.de;
    z80.regs.de = inc16(z80.regs.de);
    z80.writeByte(z80.abus, z80.dbus);
    // generic: {tcycles: 2, action: "z80.ldi_ldd($DLATCH)"}
    z80.incTStateCount(2);
    z80.ldi_ldd(z80.dbus);
  },
});

// {n:161, x:2, y:4, z:1, p:2, q:0}
// CPI
opcodes.set(0xeda1, {
  name: "CPI",
  bytes: "ed a1",
  doc: "Compare and increment: A-[HL],HL=HL+1,BC=BC-1",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $HL++, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.regs.hl = inc16(z80.regs.hl);
    z80.dbus = z80.readByte(z80.abus);
    // generic: {tcycles: 5, action: "$WZ++;z80.alu.cpi_cpd($DLATCH)"}
    z80.incTStateCount(5);
    z80.regs.wz = inc16(z80.regs.wz);
    z80.alu.cpi_cpd(z80.dbus);
  },
});

// {n:162, x:2, y:4, z:2, p:2, q:0}
// INI
opcodes.set(0xeda2, {
  name: "INI",
  bytes: "ed a2",
  doc: "Input and increment: [HL]=[C],HL=HL+1,B=B-1",
  group: "IO",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // ioread: {ab: $BC, dst: $DLATCH, action: "$WZ=$BC+1;$B--;"}
    z80.abus = z80.regs.bc;
    z80.dbus = z80.readPort(z80.abus);
    z80.regs.wz = inc16(z80.regs.bc);
    z80.regs.b = dec8(z80.regs.b);
    // mwrite: {ab: $HL++, db: $DLATCH, action: "z80.ini_ind($DLATCH,$C+1)"}
    z80.abus = z80.regs.hl;
    z80.regs.hl = inc16(z80.regs.hl);
    z80.writeByte(z80.abus, z80.dbus);
    z80.ini_ind(z80.dbus, inc8(z80.regs.c));
  },
});

// {n:163, x:2, y:4, z:3, p:2, q:0}
// OUTI
opcodes.set(0xeda3, {
  name: "OUTI",
  bytes: "ed a3",
  doc: "Output and increment: [C]=[HL],HL=HL+1,B=B-1",
  group: "IO",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mread: {ab: $HL++, dst: $DLATCH, action: "$B--"}
    z80.abus = z80.regs.hl;
    z80.regs.hl = inc16(z80.regs.hl);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.b = dec8(z80.regs.b);
    // iowrite: {ab: $BC, db: $DLATCH, action: "$WZ=$BC+1;z80.outi_outd($DLATCH)"}
    z80.abus = z80.regs.bc;
    z80.writePort(z80.abus, z80.dbus);
    z80.regs.wz = inc16(z80.regs.bc);
    z80.outi_outd(z80.dbus);
  },
});

// {n:168, x:2, y:5, z:0, p:2, q:1}
// LDD
opcodes.set(0xeda8, {
  name: "LDD",
  bytes: "ed a8",
  doc: "Load and decrement: [DE]=[HL],HL-=1,DE-=1,BC-=1",
  group: "Transfer 16bit",
  fn: (z80) => {
    // mread: {ab: $HL--, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.regs.hl = dec16(z80.regs.hl);
    z80.dbus = z80.readByte(z80.abus);
    // mwrite: {ab: $DE--, db: $DLATCH}
    z80.abus = z80.regs.de;
    z80.regs.de = dec16(z80.regs.de);
    z80.writeByte(z80.abus, z80.dbus);
    // generic: {tcycles: 2, action: "z80.ldi_ldd($DLATCH)"}
    z80.incTStateCount(2);
    z80.ldi_ldd(z80.dbus);
  },
});

// {n:169, x:2, y:5, z:1, p:2, q:1}
// CPD
opcodes.set(0xeda9, {
  name: "CPD",
  bytes: "ed a9",
  doc: "Compare and decrement: A-[HL],HL=HL-1,BC=BC-1",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $HL--, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.regs.hl = dec16(z80.regs.hl);
    z80.dbus = z80.readByte(z80.abus);
    // generic: {tcycles: 5, action: "$WZ--;z80.alu.cpi_cpd($DLATCH)"}
    z80.incTStateCount(5);
    z80.regs.wz = dec16(z80.regs.wz);
    z80.alu.cpi_cpd(z80.dbus);
  },
});

// {n:170, x:2, y:5, z:2, p:2, q:1}
// IND
opcodes.set(0xedaa, {
  name: "IND",
  bytes: "ed aa",
  doc: "Input and decrement: [HL]=[C],HL=HL-1,B=B-1",
  group: "IO",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // ioread: {ab: $BC, dst: $DLATCH, action: "$WZ=$BC-1;$B--;"}
    z80.abus = z80.regs.bc;
    z80.dbus = z80.readPort(z80.abus);
    z80.regs.wz = z80.regs.bc - 1;
    z80.regs.b = dec8(z80.regs.b);
    // mwrite: {ab: $HL--, db: $DLATCH, action: "z80.ini_ind($DLATCH,$C-1)"}
    z80.abus = z80.regs.hl;
    z80.regs.hl = dec16(z80.regs.hl);
    z80.writeByte(z80.abus, z80.dbus);
    z80.ini_ind(z80.dbus, dec8(z80.regs.c));
  },
});

// {n:171, x:2, y:5, z:3, p:2, q:1}
// OUTD
opcodes.set(0xedab, {
  name: "OUTD",
  bytes: "ed ab",
  doc: "Output and decrement: Output and increment: [C]=[HL],HL=HL-1,B=B-1",
  group: "IO",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mread: {ab: $HL--, dst: $DLATCH, action: "$B--"}
    z80.abus = z80.regs.hl;
    z80.regs.hl = dec16(z80.regs.hl);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.b = dec8(z80.regs.b);
    // iowrite: {ab: $BC, db: $DLATCH, action: "$WZ=$BC-1;z80.outi_outd($DLATCH)"}
    z80.abus = z80.regs.bc;
    z80.writePort(z80.abus, z80.dbus);
    z80.regs.wz = z80.regs.bc - 1;
    z80.outi_outd(z80.dbus);
  },
});

// {n:176, x:2, y:6, z:0, p:3, q:0}
// LDIR
opcodes.set(0xedb0, {
  name: "LDIR",
  bytes: "ed b0",
  doc: "LDI until BC==0",
  group: "Transfer 16bit",
  fn: (z80) => {
    // mread: {ab: $HL++, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.regs.hl = inc16(z80.regs.hl);
    z80.dbus = z80.readByte(z80.abus);
    // mwrite: {ab: $DE++, db: $DLATCH}
    z80.abus = z80.regs.de;
    z80.regs.de = inc16(z80.regs.de);
    z80.writeByte(z80.abus, z80.dbus);
    // generic: {tcycles: 2, action: "z80.ldi_ldd($DLATCH)"}
    z80.incTStateCount(2);
    z80.ldi_ldd(z80.dbus);
    // generic: {tcycles: 0, if: "$BC!==0", action: "$T+=5; $PC=add16($PC,-2); $WZ=add16($PC, 1)"}
    z80.incTStateCount(0);
    if (z80.regs.bc !== 0) {
      z80.hal.tStateCount += 5;
      z80.regs.pc = add16(z80.regs.pc, -2);
      z80.regs.wz = add16(z80.regs.pc, 1);
    }
  },
});

// {n:177, x:2, y:6, z:1, p:3, q:0}
// CPIR
opcodes.set(0xedb1, {
  name: "CPIR",
  bytes: "ed b1",
  doc: "CPI until A=[HL] or BC=0",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $HL++, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.regs.hl = inc16(z80.regs.hl);
    z80.dbus = z80.readByte(z80.abus);
    // generic: {tcycles: 5, action: "$WZ++; if (!z80.alu.cpi_cpd($DLATCH)) return;"}
    z80.incTStateCount(5);
    z80.regs.wz = inc16(z80.regs.wz);
    if (!z80.alu.cpi_cpd(z80.dbus)) return;
    // generic: {tcycles: 5, action: "$PC=add16($PC,-2); $WZ=add16($PC, 1)"}
    z80.incTStateCount(5);
    z80.regs.pc = add16(z80.regs.pc, -2);
    z80.regs.wz = add16(z80.regs.pc, 1);
  },
});

// {n:178, x:2, y:6, z:2, p:3, q:0}
// INIR
opcodes.set(0xedb2, {
  name: "INIR",
  bytes: "ed b2",
  doc: "INI until B==0",
  group: "IO",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // ioread: {ab: $BC, dst: $DLATCH, action: "$WZ=$BC+1;$B--"}
    z80.abus = z80.regs.bc;
    z80.dbus = z80.readPort(z80.abus);
    z80.regs.wz = inc16(z80.regs.bc);
    z80.regs.b = dec8(z80.regs.b);
    // mwrite: {ab: $HL++, db: $DLATCH, action: "if (!z80.ini_ind($DLATCH,$C+1)) return"}
    z80.abus = z80.regs.hl;
    z80.regs.hl = inc16(z80.regs.hl);
    z80.writeByte(z80.abus, z80.dbus);
    if (!z80.ini_ind(z80.dbus, inc8(z80.regs.c))) return;
    // generic: {tcycles: 5, action: "$PC=add16($PC,-2)"}
    z80.incTStateCount(5);
    z80.regs.pc = add16(z80.regs.pc, -2);
  },
});

// {n:179, x:2, y:6, z:3, p:3, q:0}
// OTIR
opcodes.set(0xedb3, {
  name: "OTIR",
  bytes: "ed b3",
  doc: "OUTI until B==0",
  group: "IO",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mread: {ab: $HL++, dst: $DLATCH, action: "$B--"}
    z80.abus = z80.regs.hl;
    z80.regs.hl = inc16(z80.regs.hl);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.b = dec8(z80.regs.b);
    // iowrite: {ab: $BC, db: $DLATCH, action: "$WZ=$BC+1;if(!z80.outi_outd($DLATCH)) return"}
    z80.abus = z80.regs.bc;
    z80.writePort(z80.abus, z80.dbus);
    z80.regs.wz = inc16(z80.regs.bc);
    if (!z80.outi_outd(z80.dbus)) return;
    // generic: {tcycles: 5, action: "$PC=add16($PC,-2)"}
    z80.incTStateCount(5);
    z80.regs.pc = add16(z80.regs.pc, -2);
  },
});

// {n:184, x:2, y:7, z:0, p:3, q:1}
// LDDR
opcodes.set(0xedb8, {
  name: "LDDR",
  bytes: "ed b8",
  doc: "LDR until BC==0",
  group: "Transfer 16bit",
  fn: (z80) => {
    // mread: {ab: $HL--, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.regs.hl = dec16(z80.regs.hl);
    z80.dbus = z80.readByte(z80.abus);
    // mwrite: {ab: $DE--, db: $DLATCH}
    z80.abus = z80.regs.de;
    z80.regs.de = dec16(z80.regs.de);
    z80.writeByte(z80.abus, z80.dbus);
    // generic: {tcycles: 2, action: "z80.ldi_ldd($DLATCH)"}
    z80.incTStateCount(2);
    z80.ldi_ldd(z80.dbus);
    // generic: {tcycles: 0, if: "$BC!==0", action: "$T+=5; $PC=add16($PC,-2); $WZ=add16($PC, 1)"}
    z80.incTStateCount(0);
    if (z80.regs.bc !== 0) {
      z80.hal.tStateCount += 5;
      z80.regs.pc = add16(z80.regs.pc, -2);
      z80.regs.wz = add16(z80.regs.pc, 1);
    }
  },
});

// {n:185, x:2, y:7, z:1, p:3, q:1}
// CPDR
opcodes.set(0xedb9, {
  name: "CPDR",
  bytes: "ed b9",
  doc: "CPD until A=[HL] or BC=0",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {ab: $HL--, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.regs.hl = dec16(z80.regs.hl);
    z80.dbus = z80.readByte(z80.abus);
    // generic: {tcycles: 5, action: "$WZ--; if (!z80.alu.cpi_cpd($DLATCH)) return;"}
    z80.incTStateCount(5);
    z80.regs.wz = dec16(z80.regs.wz);
    if (!z80.alu.cpi_cpd(z80.dbus)) return;
    // generic: {tcycles: 5, action: "$PC=add16($PC,-2); $WZ=add16($PC, 1)"}
    z80.incTStateCount(5);
    z80.regs.pc = add16(z80.regs.pc, -2);
    z80.regs.wz = add16(z80.regs.pc, 1);
  },
});

// {n:186, x:2, y:7, z:2, p:3, q:1}
// INDR
opcodes.set(0xedba, {
  name: "INDR",
  bytes: "ed ba",
  doc: "IND until B==0",
  group: "IO",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // ioread: {ab: $BC, dst: $DLATCH, action: "$WZ=$BC-1;$B--;"}
    z80.abus = z80.regs.bc;
    z80.dbus = z80.readPort(z80.abus);
    z80.regs.wz = z80.regs.bc - 1;
    z80.regs.b = dec8(z80.regs.b);
    // mwrite: {ab: $HL--, db: $DLATCH, action: "if (!z80.ini_ind($DLATCH,$C-1)) return"}
    z80.abus = z80.regs.hl;
    z80.regs.hl = dec16(z80.regs.hl);
    z80.writeByte(z80.abus, z80.dbus);
    if (!z80.ini_ind(z80.dbus, dec8(z80.regs.c))) return;
    // generic: {tcycles: 5, action: "$PC=add16($PC,-2)"}
    z80.incTStateCount(5);
    z80.regs.pc = add16(z80.regs.pc, -2);
  },
});

// {n:187, x:2, y:7, z:3, p:3, q:1}
// OTDR
opcodes.set(0xedbb, {
  name: "OTDR",
  bytes: "ed bb",
  doc: "OUTD until B==0",
  group: "IO",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mread: {ab: $HL--, dst: $DLATCH, action: "$B--"}
    z80.abus = z80.regs.hl;
    z80.regs.hl = dec16(z80.regs.hl);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.b = dec8(z80.regs.b);
    // iowrite: {ab: $BC, db: $DLATCH, action: "$WZ=$BC-1;if(!z80.outi_outd($DLATCH)) return"}
    z80.abus = z80.regs.bc;
    z80.writePort(z80.abus, z80.dbus);
    z80.regs.wz = z80.regs.bc - 1;
    if (!z80.outi_outd(z80.dbus)) return;
    // generic: {tcycles: 5, action: "$PC=add16($PC,-2)"}
    z80.incTStateCount(5);
    z80.regs.pc = add16(z80.regs.pc, -2);
  },
});

// {n:9, x:0, y:1, z:1, p:0, q:1}
// ADD $RI,$RP
opcodes.set(0xfd09, {
  name: "ADD iy,bc",
  bytes: "fd 09",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.iy = z80.alu.add16(z80.regs.iy, z80.regs.bc);
  },
});

// {n:25, x:0, y:3, z:1, p:1, q:1}
// ADD $RI,$RP
opcodes.set(0xfd19, {
  name: "ADD iy,de",
  bytes: "fd 19",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.iy = z80.alu.add16(z80.regs.iy, z80.regs.de);
  },
});

// {n:33, x:0, y:4, z:1, p:2, q:0}
// LD $RP,$nn
opcodes.set(0xfd21, {
  name: "LD iy,$nn",
  bytes: "fd 21 XX XX",
  doc: "iy=nn",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RPL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.iyl = z80.dbus;
    // mread: {ab: $PC++, dst: $RPH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.iyh = z80.dbus;
  },
});

// {n:34, x:0, y:4, z:2, p:2, q:0}
// LD ($nn),$RP
opcodes.set(0xfd22, {
  name: "LD ($nn),iy",
  bytes: "fd 22 XX XX",
  doc: "[nn]=iy",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mwrite: {ab: $WZ++, db: $RPL}
    z80.dbus = z80.regs.iyl;
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: $WZ, db: $RPH}
    z80.dbus = z80.regs.iyh;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:35, x:0, y:4, z:3, p:2, q:0}
// INC $RP
opcodes.set(0xfd23, {
  name: "INC iy",
  bytes: "fd 23",
  doc: "$RDDP+=1",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.inc16($RP)"}
    z80.incTStateCount(2);
    z80.regs.iy = z80.alu.inc16(z80.regs.iy);
  },
});

// {n:36, x:0, y:4, z:4, p:2, q:0}
// INC $RY
opcodes.set(0xfd24, {
  name: "INC iyh",
  bytes: "fd 24",
  doc: "iyh+=1",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.iyh = z80.alu.inc8(z80.regs.iyh);
  },
});

// {n:37, x:0, y:4, z:5, p:2, q:0}
// DEC $RY
opcodes.set(0xfd25, {
  name: "DEC iyh",
  bytes: "fd 25",
  doc: "iyh-=1",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.iyh = z80.alu.dec8(z80.regs.iyh);
  },
});

// {n:38, x:0, y:4, z:6, p:2, q:0}
// LD $RY,$n
opcodes.set(0xfd26, {
  name: "LD iyh,$n",
  bytes: "fd 26 XX",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RY}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.iyh = z80.dbus;
  },
});

// {n:41, x:0, y:5, z:1, p:2, q:1}
// ADD $RI,$RP
opcodes.set(0xfd29, {
  name: "ADD iy,iy",
  bytes: "fd 29",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.iy = z80.alu.add16(z80.regs.iy, z80.regs.iy);
  },
});

// {n:42, x:0, y:5, z:2, p:2, q:1}
// LD $RP,($nn)
opcodes.set(0xfd2a, {
  name: "LD iy,($nn)",
  bytes: "fd 2a XX XX",
  doc: "iy=($nn)",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $WZL}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {ab: $PC++, dst: $WZH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.w = z80.dbus;
    // mread: {ab: $WZ++, dst: $RPL}
    z80.abus = z80.regs.wz;
    z80.regs.wz = inc16(z80.regs.wz);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.iyl = z80.dbus;
    // mread: {ab: $WZ, dst: $RPH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.iyh = z80.dbus;
  },
});

// {n:43, x:0, y:5, z:3, p:2, q:1}
// DEC $RP
opcodes.set(0xfd2b, {
  name: "DEC iy",
  bytes: "fd 2b",
  doc: "iy-=1",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.dec16($RP)"}
    z80.incTStateCount(2);
    z80.regs.iy = z80.alu.dec16(z80.regs.iy);
  },
});

// {n:44, x:0, y:5, z:4, p:2, q:1}
// INC $RY
opcodes.set(0xfd2c, {
  name: "INC iyl",
  bytes: "fd 2c",
  doc: "iyl+=1",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.iyl = z80.alu.inc8(z80.regs.iyl);
  },
});

// {n:45, x:0, y:5, z:5, p:2, q:1}
// DEC $RY
opcodes.set(0xfd2d, {
  name: "DEC iyl",
  bytes: "fd 2d",
  doc: "iyl-=1",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.iyl = z80.alu.dec8(z80.regs.iyl);
  },
});

// {n:46, x:0, y:5, z:6, p:2, q:1}
// LD $RY,$n
opcodes.set(0xfd2e, {
  name: "LD iyl,$n",
  bytes: "fd 2e XX",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $RY}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.iyl = z80.dbus;
  },
});

// {n:52, x:0, y:6, z:4, p:3, q:0}
// INC ($RI+dd)
opcodes.set(0xfd34, {
  name: "INC (iy+dd)",
  bytes: "fd 34",
  doc: "Increment (iy+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH, action: "$DLATCH=z80.alu.inc8($DLATCH)"}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.dbus = z80.alu.inc8(z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:53, x:0, y:6, z:5, p:3, q:0}
// DEC ($RI+dd)
opcodes.set(0xfd35, {
  name: "DEC (iy+dd)",
  bytes: "fd 35",
  doc: "Decrement (iy+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH, action: "$DLATCH=z80.alu.dec8($DLATCH)"}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.dbus = z80.alu.dec8(z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:54, x:0, y:6, z:6, p:3, q:0}
// LD ($RI+dd),$n
opcodes.set(0xfd36, {
  name: "LD (iy+dd),$n",
  bytes: "fd 36 XX",
  doc: "(iy+dd)=n",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {tcycles: 5, ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(2);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:57, x:0, y:7, z:1, p:3, q:1}
// ADD $RI,$RP
opcodes.set(0xfd39, {
  name: "ADD iy,sp",
  bytes: "fd 39",
  group: "ALU 16bit",
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.iy = z80.alu.add16(z80.regs.iy, z80.regs.sp);
  },
});

// {n:68, x:1, y:0, z:4, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0xfd44, {
  name: "LD b,iyh",
  bytes: "fd 44",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.iyh;
  },
});

// {n:69, x:1, y:0, z:5, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0xfd45, {
  name: "LD b,iyl",
  bytes: "fd 45",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.iyl;
  },
});

// {n:70, x:1, y:0, z:6, p:0, q:0}
// LD $RRY,($RI+dd)
opcodes.set(0xfd46, {
  name: "LD b,(iy+dd)",
  bytes: "fd 46",
  doc: "b=(iy+dd)",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $RRY}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.b = z80.dbus;
  },
});

// {n:76, x:1, y:1, z:4, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0xfd4c, {
  name: "LD c,iyh",
  bytes: "fd 4c",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.iyh;
  },
});

// {n:77, x:1, y:1, z:5, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0xfd4d, {
  name: "LD c,iyl",
  bytes: "fd 4d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.iyl;
  },
});

// {n:78, x:1, y:1, z:6, p:0, q:1}
// LD $RRY,($RI+dd)
opcodes.set(0xfd4e, {
  name: "LD c,(iy+dd)",
  bytes: "fd 4e",
  doc: "c=(iy+dd)",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $RRY}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.c = z80.dbus;
  },
});

// {n:84, x:1, y:2, z:4, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0xfd54, {
  name: "LD d,iyh",
  bytes: "fd 54",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.iyh;
  },
});

// {n:85, x:1, y:2, z:5, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0xfd55, {
  name: "LD d,iyl",
  bytes: "fd 55",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.iyl;
  },
});

// {n:86, x:1, y:2, z:6, p:1, q:0}
// LD $RRY,($RI+dd)
opcodes.set(0xfd56, {
  name: "LD d,(iy+dd)",
  bytes: "fd 56",
  doc: "d=(iy+dd)",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $RRY}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.d = z80.dbus;
  },
});

// {n:92, x:1, y:3, z:4, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0xfd5c, {
  name: "LD e,iyh",
  bytes: "fd 5c",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.iyh;
  },
});

// {n:93, x:1, y:3, z:5, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0xfd5d, {
  name: "LD e,iyl",
  bytes: "fd 5d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.iyl;
  },
});

// {n:94, x:1, y:3, z:6, p:1, q:1}
// LD $RRY,($RI+dd)
opcodes.set(0xfd5e, {
  name: "LD e,(iy+dd)",
  bytes: "fd 5e",
  doc: "e=(iy+dd)",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $RRY}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.e = z80.dbus;
  },
});

// {n:96, x:1, y:4, z:0, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0xfd60, {
  name: "LD iyh,b",
  bytes: "fd 60",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyh = z80.regs.b;
  },
});

// {n:97, x:1, y:4, z:1, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0xfd61, {
  name: "LD iyh,c",
  bytes: "fd 61",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyh = z80.regs.c;
  },
});

// {n:98, x:1, y:4, z:2, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0xfd62, {
  name: "LD iyh,d",
  bytes: "fd 62",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyh = z80.regs.d;
  },
});

// {n:99, x:1, y:4, z:3, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0xfd63, {
  name: "LD iyh,e",
  bytes: "fd 63",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyh = z80.regs.e;
  },
});

// {n:100, x:1, y:4, z:4, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0xfd64, {
  name: "LD iyh,iyh",
  bytes: "fd 64",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyh = z80.regs.iyh;
  },
});

// {n:101, x:1, y:4, z:5, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0xfd65, {
  name: "LD iyh,iyl",
  bytes: "fd 65",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyh = z80.regs.iyl;
  },
});

// {n:102, x:1, y:4, z:6, p:2, q:0}
// LD $RRY,($RI+dd)
opcodes.set(0xfd66, {
  name: "LD h,(iy+dd)",
  bytes: "fd 66",
  doc: "h=(iy+dd)",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $RRY}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.h = z80.dbus;
  },
});

// {n:103, x:1, y:4, z:7, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0xfd67, {
  name: "LD iyh,a",
  bytes: "fd 67",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyh = z80.regs.a;
  },
});

// {n:104, x:1, y:5, z:0, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0xfd68, {
  name: "LD iyl,b",
  bytes: "fd 68",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyl = z80.regs.b;
  },
});

// {n:105, x:1, y:5, z:1, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0xfd69, {
  name: "LD iyl,c",
  bytes: "fd 69",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyl = z80.regs.c;
  },
});

// {n:106, x:1, y:5, z:2, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0xfd6a, {
  name: "LD iyl,d",
  bytes: "fd 6a",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyl = z80.regs.d;
  },
});

// {n:107, x:1, y:5, z:3, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0xfd6b, {
  name: "LD iyl,e",
  bytes: "fd 6b",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyl = z80.regs.e;
  },
});

// {n:108, x:1, y:5, z:4, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0xfd6c, {
  name: "LD iyl,iyh",
  bytes: "fd 6c",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyl = z80.regs.iyh;
  },
});

// {n:109, x:1, y:5, z:5, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0xfd6d, {
  name: "LD iyl,iyl",
  bytes: "fd 6d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyl = z80.regs.iyl;
  },
});

// {n:110, x:1, y:5, z:6, p:2, q:1}
// LD $RRY,($RI+dd)
opcodes.set(0xfd6e, {
  name: "LD l,(iy+dd)",
  bytes: "fd 6e",
  doc: "l=(iy+dd)",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $RRY}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.l = z80.dbus;
  },
});

// {n:111, x:1, y:5, z:7, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0xfd6f, {
  name: "LD iyl,a",
  bytes: "fd 6f",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyl = z80.regs.a;
  },
});

// {n:112, x:1, y:6, z:0, p:3, q:0}
// LD ($RI+dd),$RRZ
opcodes.set(0xfd70, {
  name: "LD (iy+dd),b",
  bytes: "fd 70",
  doc: "(iy+dd) = b",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:113, x:1, y:6, z:1, p:3, q:0}
// LD ($RI+dd),$RRZ
opcodes.set(0xfd71, {
  name: "LD (iy+dd),c",
  bytes: "fd 71",
  doc: "(iy+dd) = c",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:114, x:1, y:6, z:2, p:3, q:0}
// LD ($RI+dd),$RRZ
opcodes.set(0xfd72, {
  name: "LD (iy+dd),d",
  bytes: "fd 72",
  doc: "(iy+dd) = d",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:115, x:1, y:6, z:3, p:3, q:0}
// LD ($RI+dd),$RRZ
opcodes.set(0xfd73, {
  name: "LD (iy+dd),e",
  bytes: "fd 73",
  doc: "(iy+dd) = e",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:116, x:1, y:6, z:4, p:3, q:0}
// LD ($RI+dd),$RRZ
opcodes.set(0xfd74, {
  name: "LD (iy+dd),h",
  bytes: "fd 74",
  doc: "(iy+dd) = h",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:117, x:1, y:6, z:5, p:3, q:0}
// LD ($RI+dd),$RRZ
opcodes.set(0xfd75, {
  name: "LD (iy+dd),l",
  bytes: "fd 75",
  doc: "(iy+dd) = l",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:119, x:1, y:6, z:7, p:3, q:0}
// LD ($RI+dd),$RRZ
opcodes.set(0xfd77, {
  name: "LD (iy+dd),a",
  bytes: "fd 77",
  doc: "(iy+dd) = a",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:124, x:1, y:7, z:4, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0xfd7c, {
  name: "LD a,iyh",
  bytes: "fd 7c",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.iyh;
  },
});

// {n:125, x:1, y:7, z:5, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0xfd7d, {
  name: "LD a,iyl",
  bytes: "fd 7d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.iyl;
  },
});

// {n:126, x:1, y:7, z:6, p:3, q:1}
// LD $RRY,($RI+dd)
opcodes.set(0xfd7e, {
  name: "LD a,(iy+dd)",
  bytes: "fd 7e",
  doc: "a=(iy+dd)",
  group: "Load 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $RRY}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.a = z80.dbus;
  },
});

// {n:132, x:2, y:0, z:4, p:0, q:0}
// $ALU $RZ
opcodes.set(0xfd84, {
  name: "add8 iyh",
  bytes: "fd 84",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add8(z80.regs.iyh);
  },
});

// {n:133, x:2, y:0, z:5, p:0, q:0}
// $ALU $RZ
opcodes.set(0xfd85, {
  name: "add8 iyl",
  bytes: "fd 85",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add8(z80.regs.iyl);
  },
});

// {n:134, x:2, y:0, z:6, p:0, q:0}
// $ALU ($RI+dd)
opcodes.set(0xfd86, {
  name: "add8 (iy+dd)",
  bytes: "fd 86",
  doc: "A=A $ALU (iy+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.add8(z80.dbus);
  },
});

// {n:140, x:2, y:1, z:4, p:0, q:1}
// $ALU $RZ
opcodes.set(0xfd8c, {
  name: "adc8 iyh",
  bytes: "fd 8c",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc8(z80.regs.iyh);
  },
});

// {n:141, x:2, y:1, z:5, p:0, q:1}
// $ALU $RZ
opcodes.set(0xfd8d, {
  name: "adc8 iyl",
  bytes: "fd 8d",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc8(z80.regs.iyl);
  },
});

// {n:142, x:2, y:1, z:6, p:0, q:1}
// $ALU ($RI+dd)
opcodes.set(0xfd8e, {
  name: "adc8 (iy+dd)",
  bytes: "fd 8e",
  doc: "A=A $ALU (iy+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.adc8(z80.dbus);
  },
});

// {n:148, x:2, y:2, z:4, p:1, q:0}
// $ALU $RZ
opcodes.set(0xfd94, {
  name: "sub8 iyh",
  bytes: "fd 94",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub8(z80.regs.iyh);
  },
});

// {n:149, x:2, y:2, z:5, p:1, q:0}
// $ALU $RZ
opcodes.set(0xfd95, {
  name: "sub8 iyl",
  bytes: "fd 95",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub8(z80.regs.iyl);
  },
});

// {n:150, x:2, y:2, z:6, p:1, q:0}
// $ALU ($RI+dd)
opcodes.set(0xfd96, {
  name: "sub8 (iy+dd)",
  bytes: "fd 96",
  doc: "A=A $ALU (iy+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.sub8(z80.dbus);
  },
});

// {n:156, x:2, y:3, z:4, p:1, q:1}
// $ALU $RZ
opcodes.set(0xfd9c, {
  name: "sbc8 iyh",
  bytes: "fd 9c",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc8(z80.regs.iyh);
  },
});

// {n:157, x:2, y:3, z:5, p:1, q:1}
// $ALU $RZ
opcodes.set(0xfd9d, {
  name: "sbc8 iyl",
  bytes: "fd 9d",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc8(z80.regs.iyl);
  },
});

// {n:158, x:2, y:3, z:6, p:1, q:1}
// $ALU ($RI+dd)
opcodes.set(0xfd9e, {
  name: "sbc8 (iy+dd)",
  bytes: "fd 9e",
  doc: "A=A $ALU (iy+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.sbc8(z80.dbus);
  },
});

// {n:164, x:2, y:4, z:4, p:2, q:0}
// $ALU $RZ
opcodes.set(0xfda4, {
  name: "and8 iyh",
  bytes: "fd a4",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and8(z80.regs.iyh);
  },
});

// {n:165, x:2, y:4, z:5, p:2, q:0}
// $ALU $RZ
opcodes.set(0xfda5, {
  name: "and8 iyl",
  bytes: "fd a5",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and8(z80.regs.iyl);
  },
});

// {n:166, x:2, y:4, z:6, p:2, q:0}
// $ALU ($RI+dd)
opcodes.set(0xfda6, {
  name: "and8 (iy+dd)",
  bytes: "fd a6",
  doc: "A=A $ALU (iy+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.and8(z80.dbus);
  },
});

// {n:172, x:2, y:5, z:4, p:2, q:1}
// $ALU $RZ
opcodes.set(0xfdac, {
  name: "xor8 iyh",
  bytes: "fd ac",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor8(z80.regs.iyh);
  },
});

// {n:173, x:2, y:5, z:5, p:2, q:1}
// $ALU $RZ
opcodes.set(0xfdad, {
  name: "xor8 iyl",
  bytes: "fd ad",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor8(z80.regs.iyl);
  },
});

// {n:174, x:2, y:5, z:6, p:2, q:1}
// $ALU ($RI+dd)
opcodes.set(0xfdae, {
  name: "xor8 (iy+dd)",
  bytes: "fd ae",
  doc: "A=A $ALU (iy+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.xor8(z80.dbus);
  },
});

// {n:180, x:2, y:6, z:4, p:3, q:0}
// $ALU $RZ
opcodes.set(0xfdb4, {
  name: "or8 iyh",
  bytes: "fd b4",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or8(z80.regs.iyh);
  },
});

// {n:181, x:2, y:6, z:5, p:3, q:0}
// $ALU $RZ
opcodes.set(0xfdb5, {
  name: "or8 iyl",
  bytes: "fd b5",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or8(z80.regs.iyl);
  },
});

// {n:182, x:2, y:6, z:6, p:3, q:0}
// $ALU ($RI+dd)
opcodes.set(0xfdb6, {
  name: "or8 (iy+dd)",
  bytes: "fd b6",
  doc: "A=A $ALU (iy+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.or8(z80.dbus);
  },
});

// {n:188, x:2, y:7, z:4, p:3, q:1}
// $ALU $RZ
opcodes.set(0xfdbc, {
  name: "cp8 iyh",
  bytes: "fd bc",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp8(z80.regs.iyh);
  },
});

// {n:189, x:2, y:7, z:5, p:3, q:1}
// $ALU $RZ
opcodes.set(0xfdbd, {
  name: "cp8 iyl",
  bytes: "fd bd",
  group: "ALU 8bit",
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp8(z80.regs.iyl);
  },
});

// {n:190, x:2, y:7, z:6, p:3, q:1}
// $ALU ($RI+dd)
opcodes.set(0xfdbe, {
  name: "cp8 (iy+dd)",
  bytes: "fd be",
  doc: "A=A $ALU (iy+dd)",
  group: "ALU 8bit",
  fn: (z80) => {
    // mread: {tcycles: 8, ab: $PC++, dst: $DLATCH, action: "$WZ=add16($RI, signedByte($DLATCH))"}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(5);
    z80.regs.wz = add16(z80.regs.iy, signedByte(z80.dbus));
    // mread: {ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.cp8(z80.dbus);
  },
});

// {n:203, x:3, y:1, z:3, p:0, q:1}
// CB prefix
opcodes.set(0xfdcb, {
  name: "CB XXX",
  bytes: "fd cb",
  group: "Prefix",
  fn: (z80) => {
    // overlapped: {prefix: fdcb}
    z80.decodeFDCB();
  },
});

// {n:225, x:3, y:4, z:1, p:2, q:0}
// POP $RP2
opcodes.set(0xfde1, {
  name: "POP iy",
  bytes: "fd e1",
  group: "Load 16bit",
  fn: (z80) => {
    // mread: {ab: $SP++, dst: $RP2L}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.iyl = z80.dbus;
    // mread: {ab: $SP++, dst: $RP2H}
    z80.abus = z80.regs.sp;
    z80.regs.sp = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.iyh = z80.dbus;
  },
});

// {n:227, x:3, y:4, z:3, p:2, q:0}
// EX (SP),$RI
opcodes.set(0xfde3, {
  name: "EX (SP),iy",
  bytes: "fd e3",
  group: "Transfer",
  fn: (z80) => {
    // mread: {ab: $SP, dst: $WZL}
    z80.abus = z80.regs.sp;
    z80.dbus = z80.readByte(z80.abus);
    z80.regs.z = z80.dbus;
    // mread: {tcycles: 4, ab: $SP+1, dst: $WZH}
    z80.abus = inc16(z80.regs.sp);
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.w = z80.dbus;
    // mwrite: {ab: $SP+1, db: $RPH}
    z80.dbus = z80.regs.iyh;
    z80.abus = inc16(z80.regs.sp);
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {tcycles: 5, ab: $SP, db: $RPL, action: "$RP=$WZ"}
    z80.dbus = z80.regs.iyl;
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    z80.incTStateCount(2);
    z80.regs.iy = z80.regs.wz;
  },
});

// {n:229, x:3, y:4, z:5, p:2, q:0}
// PUSH $RP2
opcodes.set(0xfde5, {
  name: "PUSH iy",
  bytes: "fd e5",
  group: "Load 16bit",
  fn: (z80) => {
    // generic: {tcycles: 1}
    z80.incTStateCount(1);
    // mwrite: {ab: --$SP, db: $RP2H}
    z80.dbus = z80.regs.iyh;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
    // mwrite: {ab: --$SP, db: $RP2L}
    z80.dbus = z80.regs.iyl;
    z80.regs.sp = dec16(z80.regs.sp);
    z80.abus = z80.regs.sp;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:233, x:3, y:5, z:1, p:2, q:1}
// JP $RI
opcodes.set(0xfde9, {
  name: "JP iy",
  bytes: "fd e9",
  doc: "JMP to iy",
  group: "Control flow",
  fn: (z80) => {
    // overlapped: {action: "$PC=$RP"}
    z80.regs.pc = z80.regs.iy;
  },
});

// {n:249, x:3, y:7, z:1, p:3, q:1}
// LD SP,$RI
opcodes.set(0xfdf9, {
  name: "LD SP,iy",
  bytes: "fd f9",
  group: "Load 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$SP=$RI"}
    z80.incTStateCount(2);
    z80.regs.sp = z80.regs.iy;
  },
});

// {n:0, x:0, y:0, z:0, p:0, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb00, {
  name: "rlc (ix+dd),b",
  bytes: "dd cb 00",
  doc: "b = Rotate left through carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.rlc(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:1, x:0, y:0, z:1, p:0, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb01, {
  name: "rlc (ix+dd),c",
  bytes: "dd cb 01",
  doc: "c = Rotate left through carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.rlc(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:2, x:0, y:0, z:2, p:0, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb02, {
  name: "rlc (ix+dd),d",
  bytes: "dd cb 02",
  doc: "d = Rotate left through carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.rlc(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:3, x:0, y:0, z:3, p:0, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb03, {
  name: "rlc (ix+dd),e",
  bytes: "dd cb 03",
  doc: "e = Rotate left through carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.rlc(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:4, x:0, y:0, z:4, p:0, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb04, {
  name: "rlc (ix+dd),ixh",
  bytes: "dd cb 04",
  doc: "ixh = Rotate left through carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.rlc(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:5, x:0, y:0, z:5, p:0, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb05, {
  name: "rlc (ix+dd),ixl",
  bytes: "dd cb 05",
  doc: "ixl = Rotate left through carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.rlc(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:7, x:0, y:0, z:7, p:0, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb07, {
  name: "rlc (ix+dd),a",
  bytes: "dd cb 07",
  doc: "a = Rotate left through carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.rlc(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:8, x:0, y:1, z:0, p:0, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb08, {
  name: "rrc (ix+dd),b",
  bytes: "dd cb 08",
  doc: "b = Rotate right through carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.rrc(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:9, x:0, y:1, z:1, p:0, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb09, {
  name: "rrc (ix+dd),c",
  bytes: "dd cb 09",
  doc: "c = Rotate right through carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.rrc(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:10, x:0, y:1, z:2, p:0, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb0a, {
  name: "rrc (ix+dd),d",
  bytes: "dd cb 0a",
  doc: "d = Rotate right through carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.rrc(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:11, x:0, y:1, z:3, p:0, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb0b, {
  name: "rrc (ix+dd),e",
  bytes: "dd cb 0b",
  doc: "e = Rotate right through carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.rrc(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:12, x:0, y:1, z:4, p:0, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb0c, {
  name: "rrc (ix+dd),ixh",
  bytes: "dd cb 0c",
  doc: "ixh = Rotate right through carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.rrc(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:13, x:0, y:1, z:5, p:0, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb0d, {
  name: "rrc (ix+dd),ixl",
  bytes: "dd cb 0d",
  doc: "ixl = Rotate right through carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.rrc(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:15, x:0, y:1, z:7, p:0, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb0f, {
  name: "rrc (ix+dd),a",
  bytes: "dd cb 0f",
  doc: "a = Rotate right through carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.rrc(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:16, x:0, y:2, z:0, p:1, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb10, {
  name: "rl (ix+dd),b",
  bytes: "dd cb 10",
  doc: "b = Rotate left from carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.rl(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:17, x:0, y:2, z:1, p:1, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb11, {
  name: "rl (ix+dd),c",
  bytes: "dd cb 11",
  doc: "c = Rotate left from carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.rl(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:18, x:0, y:2, z:2, p:1, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb12, {
  name: "rl (ix+dd),d",
  bytes: "dd cb 12",
  doc: "d = Rotate left from carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.rl(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:19, x:0, y:2, z:3, p:1, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb13, {
  name: "rl (ix+dd),e",
  bytes: "dd cb 13",
  doc: "e = Rotate left from carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.rl(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:20, x:0, y:2, z:4, p:1, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb14, {
  name: "rl (ix+dd),ixh",
  bytes: "dd cb 14",
  doc: "ixh = Rotate left from carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.rl(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:21, x:0, y:2, z:5, p:1, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb15, {
  name: "rl (ix+dd),ixl",
  bytes: "dd cb 15",
  doc: "ixl = Rotate left from carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.rl(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:23, x:0, y:2, z:7, p:1, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb17, {
  name: "rl (ix+dd),a",
  bytes: "dd cb 17",
  doc: "a = Rotate left from carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.rl(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:24, x:0, y:3, z:0, p:1, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb18, {
  name: "rr (ix+dd),b",
  bytes: "dd cb 18",
  doc: "b = Rotate right from carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.rr(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:25, x:0, y:3, z:1, p:1, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb19, {
  name: "rr (ix+dd),c",
  bytes: "dd cb 19",
  doc: "c = Rotate right from carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.rr(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:26, x:0, y:3, z:2, p:1, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb1a, {
  name: "rr (ix+dd),d",
  bytes: "dd cb 1a",
  doc: "d = Rotate right from carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.rr(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:27, x:0, y:3, z:3, p:1, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb1b, {
  name: "rr (ix+dd),e",
  bytes: "dd cb 1b",
  doc: "e = Rotate right from carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.rr(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:28, x:0, y:3, z:4, p:1, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb1c, {
  name: "rr (ix+dd),ixh",
  bytes: "dd cb 1c",
  doc: "ixh = Rotate right from carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.rr(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:29, x:0, y:3, z:5, p:1, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb1d, {
  name: "rr (ix+dd),ixl",
  bytes: "dd cb 1d",
  doc: "ixl = Rotate right from carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.rr(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:31, x:0, y:3, z:7, p:1, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb1f, {
  name: "rr (ix+dd),a",
  bytes: "dd cb 1f",
  doc: "a = Rotate right from carry (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.rr(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:32, x:0, y:4, z:0, p:2, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb20, {
  name: "sla (ix+dd),b",
  bytes: "dd cb 20",
  doc: "b = Shift left arithmetic (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.sla(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:33, x:0, y:4, z:1, p:2, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb21, {
  name: "sla (ix+dd),c",
  bytes: "dd cb 21",
  doc: "c = Shift left arithmetic (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.sla(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:34, x:0, y:4, z:2, p:2, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb22, {
  name: "sla (ix+dd),d",
  bytes: "dd cb 22",
  doc: "d = Shift left arithmetic (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.sla(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:35, x:0, y:4, z:3, p:2, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb23, {
  name: "sla (ix+dd),e",
  bytes: "dd cb 23",
  doc: "e = Shift left arithmetic (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.sla(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:36, x:0, y:4, z:4, p:2, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb24, {
  name: "sla (ix+dd),ixh",
  bytes: "dd cb 24",
  doc: "ixh = Shift left arithmetic (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.sla(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:37, x:0, y:4, z:5, p:2, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb25, {
  name: "sla (ix+dd),ixl",
  bytes: "dd cb 25",
  doc: "ixl = Shift left arithmetic (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.sla(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:39, x:0, y:4, z:7, p:2, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb27, {
  name: "sla (ix+dd),a",
  bytes: "dd cb 27",
  doc: "a = Shift left arithmetic (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.sla(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:40, x:0, y:5, z:0, p:2, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb28, {
  name: "sra (ix+dd),b",
  bytes: "dd cb 28",
  doc: "b = Shift right arithmetic (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.sra(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:41, x:0, y:5, z:1, p:2, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb29, {
  name: "sra (ix+dd),c",
  bytes: "dd cb 29",
  doc: "c = Shift right arithmetic (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.sra(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:42, x:0, y:5, z:2, p:2, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb2a, {
  name: "sra (ix+dd),d",
  bytes: "dd cb 2a",
  doc: "d = Shift right arithmetic (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.sra(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:43, x:0, y:5, z:3, p:2, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb2b, {
  name: "sra (ix+dd),e",
  bytes: "dd cb 2b",
  doc: "e = Shift right arithmetic (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.sra(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:44, x:0, y:5, z:4, p:2, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb2c, {
  name: "sra (ix+dd),ixh",
  bytes: "dd cb 2c",
  doc: "ixh = Shift right arithmetic (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.sra(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:45, x:0, y:5, z:5, p:2, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb2d, {
  name: "sra (ix+dd),ixl",
  bytes: "dd cb 2d",
  doc: "ixl = Shift right arithmetic (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.sra(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:47, x:0, y:5, z:7, p:2, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb2f, {
  name: "sra (ix+dd),a",
  bytes: "dd cb 2f",
  doc: "a = Shift right arithmetic (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.sra(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:48, x:0, y:6, z:0, p:3, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb30, {
  name: "sll (ix+dd),b",
  bytes: "dd cb 30",
  doc: "b = Shift left logical (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.sll(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:49, x:0, y:6, z:1, p:3, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb31, {
  name: "sll (ix+dd),c",
  bytes: "dd cb 31",
  doc: "c = Shift left logical (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.sll(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:50, x:0, y:6, z:2, p:3, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb32, {
  name: "sll (ix+dd),d",
  bytes: "dd cb 32",
  doc: "d = Shift left logical (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.sll(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:51, x:0, y:6, z:3, p:3, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb33, {
  name: "sll (ix+dd),e",
  bytes: "dd cb 33",
  doc: "e = Shift left logical (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.sll(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:52, x:0, y:6, z:4, p:3, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb34, {
  name: "sll (ix+dd),ixh",
  bytes: "dd cb 34",
  doc: "ixh = Shift left logical (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.sll(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:53, x:0, y:6, z:5, p:3, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb35, {
  name: "sll (ix+dd),ixl",
  bytes: "dd cb 35",
  doc: "ixl = Shift left logical (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.sll(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:55, x:0, y:6, z:7, p:3, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb37, {
  name: "sll (ix+dd),a",
  bytes: "dd cb 37",
  doc: "a = Shift left logical (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.sll(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:56, x:0, y:7, z:0, p:3, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb38, {
  name: "srl (ix+dd),b",
  bytes: "dd cb 38",
  doc: "b = Shift right logical (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.srl(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:57, x:0, y:7, z:1, p:3, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb39, {
  name: "srl (ix+dd),c",
  bytes: "dd cb 39",
  doc: "c = Shift right logical (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.srl(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:58, x:0, y:7, z:2, p:3, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb3a, {
  name: "srl (ix+dd),d",
  bytes: "dd cb 3a",
  doc: "d = Shift right logical (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.srl(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:59, x:0, y:7, z:3, p:3, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb3b, {
  name: "srl (ix+dd),e",
  bytes: "dd cb 3b",
  doc: "e = Shift right logical (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.srl(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:60, x:0, y:7, z:4, p:3, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb3c, {
  name: "srl (ix+dd),ixh",
  bytes: "dd cb 3c",
  doc: "ixh = Shift right logical (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.srl(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:61, x:0, y:7, z:5, p:3, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb3d, {
  name: "srl (ix+dd),ixl",
  bytes: "dd cb 3d",
  doc: "ixl = Shift right logical (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.srl(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:63, x:0, y:7, z:7, p:3, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xddcb3f, {
  name: "srl (ix+dd),a",
  bytes: "dd cb 3f",
  doc: "a = Shift right logical (ix+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.srl(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:70, x:1, y:0, z:6, p:0, q:0}
// BIT $NY, ($RI+dd)
opcodes.set(0xddcb46, {
  name: "BIT 0,(ix+dd)",
  bytes: "dd cb 46",
  doc: "f.Z = bit 0 of (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x1, z80.dbus);
  },
});

// {n:78, x:1, y:1, z:6, p:0, q:1}
// BIT $NY, ($RI+dd)
opcodes.set(0xddcb4e, {
  name: "BIT 1,(ix+dd)",
  bytes: "dd cb 4e",
  doc: "f.Z = bit 1 of (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x2, z80.dbus);
  },
});

// {n:86, x:1, y:2, z:6, p:1, q:0}
// BIT $NY, ($RI+dd)
opcodes.set(0xddcb56, {
  name: "BIT 2,(ix+dd)",
  bytes: "dd cb 56",
  doc: "f.Z = bit 2 of (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x4, z80.dbus);
  },
});

// {n:94, x:1, y:3, z:6, p:1, q:1}
// BIT $NY, ($RI+dd)
opcodes.set(0xddcb5e, {
  name: "BIT 3,(ix+dd)",
  bytes: "dd cb 5e",
  doc: "f.Z = bit 3 of (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x8, z80.dbus);
  },
});

// {n:102, x:1, y:4, z:6, p:2, q:0}
// BIT $NY, ($RI+dd)
opcodes.set(0xddcb66, {
  name: "BIT 4,(ix+dd)",
  bytes: "dd cb 66",
  doc: "f.Z = bit 4 of (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x10, z80.dbus);
  },
});

// {n:110, x:1, y:5, z:6, p:2, q:1}
// BIT $NY, ($RI+dd)
opcodes.set(0xddcb6e, {
  name: "BIT 5,(ix+dd)",
  bytes: "dd cb 6e",
  doc: "f.Z = bit 5 of (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x20, z80.dbus);
  },
});

// {n:118, x:1, y:6, z:6, p:3, q:0}
// BIT $NY, ($RI+dd)
opcodes.set(0xddcb76, {
  name: "BIT 6,(ix+dd)",
  bytes: "dd cb 76",
  doc: "f.Z = bit 6 of (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x40, z80.dbus);
  },
});

// {n:126, x:1, y:7, z:6, p:3, q:1}
// BIT $NY, ($RI+dd)
opcodes.set(0xddcb7e, {
  name: "BIT 7,(ix+dd)",
  bytes: "dd cb 7e",
  doc: "f.Z = bit 7 of (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x80, z80.dbus);
  },
});

// {n:128, x:2, y:0, z:0, p:0, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb80, {
  name: "RES 0,(ix+dd),b",
  bytes: "dd cb 80",
  doc: "Reset bit 0 of (ix+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:129, x:2, y:0, z:1, p:0, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb81, {
  name: "RES 0,(ix+dd),c",
  bytes: "dd cb 81",
  doc: "Reset bit 0 of (ix+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:130, x:2, y:0, z:2, p:0, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb82, {
  name: "RES 0,(ix+dd),d",
  bytes: "dd cb 82",
  doc: "Reset bit 0 of (ix+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:131, x:2, y:0, z:3, p:0, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb83, {
  name: "RES 0,(ix+dd),e",
  bytes: "dd cb 83",
  doc: "Reset bit 0 of (ix+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:132, x:2, y:0, z:4, p:0, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb84, {
  name: "RES 0,(ix+dd),h",
  bytes: "dd cb 84",
  doc: "Reset bit 0 of (ix+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:133, x:2, y:0, z:5, p:0, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb85, {
  name: "RES 0,(ix+dd),l",
  bytes: "dd cb 85",
  doc: "Reset bit 0 of (ix+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:134, x:2, y:0, z:6, p:0, q:0}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcb86, {
  name: "RES 0,(ix+dd),(ix+dd)",
  bytes: "dd cb 86",
  doc: "Reset bit 0 of (ix+dd) load into (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:135, x:2, y:0, z:7, p:0, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb87, {
  name: "RES 0,(ix+dd),a",
  bytes: "dd cb 87",
  doc: "Reset bit 0 of (ix+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:136, x:2, y:1, z:0, p:0, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb88, {
  name: "RES 1,(ix+dd),b",
  bytes: "dd cb 88",
  doc: "Reset bit 1 of (ix+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:137, x:2, y:1, z:1, p:0, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb89, {
  name: "RES 1,(ix+dd),c",
  bytes: "dd cb 89",
  doc: "Reset bit 1 of (ix+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:138, x:2, y:1, z:2, p:0, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb8a, {
  name: "RES 1,(ix+dd),d",
  bytes: "dd cb 8a",
  doc: "Reset bit 1 of (ix+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:139, x:2, y:1, z:3, p:0, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb8b, {
  name: "RES 1,(ix+dd),e",
  bytes: "dd cb 8b",
  doc: "Reset bit 1 of (ix+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:140, x:2, y:1, z:4, p:0, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb8c, {
  name: "RES 1,(ix+dd),h",
  bytes: "dd cb 8c",
  doc: "Reset bit 1 of (ix+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:141, x:2, y:1, z:5, p:0, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb8d, {
  name: "RES 1,(ix+dd),l",
  bytes: "dd cb 8d",
  doc: "Reset bit 1 of (ix+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:142, x:2, y:1, z:6, p:0, q:1}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcb8e, {
  name: "RES 1,(ix+dd),(ix+dd)",
  bytes: "dd cb 8e",
  doc: "Reset bit 1 of (ix+dd) load into (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:143, x:2, y:1, z:7, p:0, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb8f, {
  name: "RES 1,(ix+dd),a",
  bytes: "dd cb 8f",
  doc: "Reset bit 1 of (ix+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:144, x:2, y:2, z:0, p:1, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb90, {
  name: "RES 2,(ix+dd),b",
  bytes: "dd cb 90",
  doc: "Reset bit 2 of (ix+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:145, x:2, y:2, z:1, p:1, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb91, {
  name: "RES 2,(ix+dd),c",
  bytes: "dd cb 91",
  doc: "Reset bit 2 of (ix+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:146, x:2, y:2, z:2, p:1, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb92, {
  name: "RES 2,(ix+dd),d",
  bytes: "dd cb 92",
  doc: "Reset bit 2 of (ix+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:147, x:2, y:2, z:3, p:1, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb93, {
  name: "RES 2,(ix+dd),e",
  bytes: "dd cb 93",
  doc: "Reset bit 2 of (ix+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:148, x:2, y:2, z:4, p:1, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb94, {
  name: "RES 2,(ix+dd),h",
  bytes: "dd cb 94",
  doc: "Reset bit 2 of (ix+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:149, x:2, y:2, z:5, p:1, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb95, {
  name: "RES 2,(ix+dd),l",
  bytes: "dd cb 95",
  doc: "Reset bit 2 of (ix+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:150, x:2, y:2, z:6, p:1, q:0}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcb96, {
  name: "RES 2,(ix+dd),(ix+dd)",
  bytes: "dd cb 96",
  doc: "Reset bit 2 of (ix+dd) load into (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:151, x:2, y:2, z:7, p:1, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb97, {
  name: "RES 2,(ix+dd),a",
  bytes: "dd cb 97",
  doc: "Reset bit 2 of (ix+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:152, x:2, y:3, z:0, p:1, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb98, {
  name: "RES 3,(ix+dd),b",
  bytes: "dd cb 98",
  doc: "Reset bit 3 of (ix+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:153, x:2, y:3, z:1, p:1, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb99, {
  name: "RES 3,(ix+dd),c",
  bytes: "dd cb 99",
  doc: "Reset bit 3 of (ix+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:154, x:2, y:3, z:2, p:1, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb9a, {
  name: "RES 3,(ix+dd),d",
  bytes: "dd cb 9a",
  doc: "Reset bit 3 of (ix+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:155, x:2, y:3, z:3, p:1, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb9b, {
  name: "RES 3,(ix+dd),e",
  bytes: "dd cb 9b",
  doc: "Reset bit 3 of (ix+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:156, x:2, y:3, z:4, p:1, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb9c, {
  name: "RES 3,(ix+dd),h",
  bytes: "dd cb 9c",
  doc: "Reset bit 3 of (ix+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:157, x:2, y:3, z:5, p:1, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb9d, {
  name: "RES 3,(ix+dd),l",
  bytes: "dd cb 9d",
  doc: "Reset bit 3 of (ix+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:158, x:2, y:3, z:6, p:1, q:1}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcb9e, {
  name: "RES 3,(ix+dd),(ix+dd)",
  bytes: "dd cb 9e",
  doc: "Reset bit 3 of (ix+dd) load into (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:159, x:2, y:3, z:7, p:1, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcb9f, {
  name: "RES 3,(ix+dd),a",
  bytes: "dd cb 9f",
  doc: "Reset bit 3 of (ix+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:160, x:2, y:4, z:0, p:2, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcba0, {
  name: "RES 4,(ix+dd),b",
  bytes: "dd cb a0",
  doc: "Reset bit 4 of (ix+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:161, x:2, y:4, z:1, p:2, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcba1, {
  name: "RES 4,(ix+dd),c",
  bytes: "dd cb a1",
  doc: "Reset bit 4 of (ix+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:162, x:2, y:4, z:2, p:2, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcba2, {
  name: "RES 4,(ix+dd),d",
  bytes: "dd cb a2",
  doc: "Reset bit 4 of (ix+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:163, x:2, y:4, z:3, p:2, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcba3, {
  name: "RES 4,(ix+dd),e",
  bytes: "dd cb a3",
  doc: "Reset bit 4 of (ix+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:164, x:2, y:4, z:4, p:2, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcba4, {
  name: "RES 4,(ix+dd),h",
  bytes: "dd cb a4",
  doc: "Reset bit 4 of (ix+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:165, x:2, y:4, z:5, p:2, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcba5, {
  name: "RES 4,(ix+dd),l",
  bytes: "dd cb a5",
  doc: "Reset bit 4 of (ix+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:166, x:2, y:4, z:6, p:2, q:0}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcba6, {
  name: "RES 4,(ix+dd),(ix+dd)",
  bytes: "dd cb a6",
  doc: "Reset bit 4 of (ix+dd) load into (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:167, x:2, y:4, z:7, p:2, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcba7, {
  name: "RES 4,(ix+dd),a",
  bytes: "dd cb a7",
  doc: "Reset bit 4 of (ix+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:168, x:2, y:5, z:0, p:2, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcba8, {
  name: "RES 5,(ix+dd),b",
  bytes: "dd cb a8",
  doc: "Reset bit 5 of (ix+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:169, x:2, y:5, z:1, p:2, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcba9, {
  name: "RES 5,(ix+dd),c",
  bytes: "dd cb a9",
  doc: "Reset bit 5 of (ix+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:170, x:2, y:5, z:2, p:2, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbaa, {
  name: "RES 5,(ix+dd),d",
  bytes: "dd cb aa",
  doc: "Reset bit 5 of (ix+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:171, x:2, y:5, z:3, p:2, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbab, {
  name: "RES 5,(ix+dd),e",
  bytes: "dd cb ab",
  doc: "Reset bit 5 of (ix+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:172, x:2, y:5, z:4, p:2, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbac, {
  name: "RES 5,(ix+dd),h",
  bytes: "dd cb ac",
  doc: "Reset bit 5 of (ix+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:173, x:2, y:5, z:5, p:2, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbad, {
  name: "RES 5,(ix+dd),l",
  bytes: "dd cb ad",
  doc: "Reset bit 5 of (ix+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:174, x:2, y:5, z:6, p:2, q:1}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcbae, {
  name: "RES 5,(ix+dd),(ix+dd)",
  bytes: "dd cb ae",
  doc: "Reset bit 5 of (ix+dd) load into (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:175, x:2, y:5, z:7, p:2, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbaf, {
  name: "RES 5,(ix+dd),a",
  bytes: "dd cb af",
  doc: "Reset bit 5 of (ix+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:176, x:2, y:6, z:0, p:3, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbb0, {
  name: "RES 6,(ix+dd),b",
  bytes: "dd cb b0",
  doc: "Reset bit 6 of (ix+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:177, x:2, y:6, z:1, p:3, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbb1, {
  name: "RES 6,(ix+dd),c",
  bytes: "dd cb b1",
  doc: "Reset bit 6 of (ix+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:178, x:2, y:6, z:2, p:3, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbb2, {
  name: "RES 6,(ix+dd),d",
  bytes: "dd cb b2",
  doc: "Reset bit 6 of (ix+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:179, x:2, y:6, z:3, p:3, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbb3, {
  name: "RES 6,(ix+dd),e",
  bytes: "dd cb b3",
  doc: "Reset bit 6 of (ix+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:180, x:2, y:6, z:4, p:3, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbb4, {
  name: "RES 6,(ix+dd),h",
  bytes: "dd cb b4",
  doc: "Reset bit 6 of (ix+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:181, x:2, y:6, z:5, p:3, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbb5, {
  name: "RES 6,(ix+dd),l",
  bytes: "dd cb b5",
  doc: "Reset bit 6 of (ix+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:182, x:2, y:6, z:6, p:3, q:0}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcbb6, {
  name: "RES 6,(ix+dd),(ix+dd)",
  bytes: "dd cb b6",
  doc: "Reset bit 6 of (ix+dd) load into (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:183, x:2, y:6, z:7, p:3, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbb7, {
  name: "RES 6,(ix+dd),a",
  bytes: "dd cb b7",
  doc: "Reset bit 6 of (ix+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:184, x:2, y:7, z:0, p:3, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbb8, {
  name: "RES 7,(ix+dd),b",
  bytes: "dd cb b8",
  doc: "Reset bit 7 of (ix+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:185, x:2, y:7, z:1, p:3, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbb9, {
  name: "RES 7,(ix+dd),c",
  bytes: "dd cb b9",
  doc: "Reset bit 7 of (ix+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:186, x:2, y:7, z:2, p:3, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbba, {
  name: "RES 7,(ix+dd),d",
  bytes: "dd cb ba",
  doc: "Reset bit 7 of (ix+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:187, x:2, y:7, z:3, p:3, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbbb, {
  name: "RES 7,(ix+dd),e",
  bytes: "dd cb bb",
  doc: "Reset bit 7 of (ix+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:188, x:2, y:7, z:4, p:3, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbbc, {
  name: "RES 7,(ix+dd),h",
  bytes: "dd cb bc",
  doc: "Reset bit 7 of (ix+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:189, x:2, y:7, z:5, p:3, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbbd, {
  name: "RES 7,(ix+dd),l",
  bytes: "dd cb bd",
  doc: "Reset bit 7 of (ix+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:190, x:2, y:7, z:6, p:3, q:1}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcbbe, {
  name: "RES 7,(ix+dd),(ix+dd)",
  bytes: "dd cb be",
  doc: "Reset bit 7 of (ix+dd) load into (ix+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:191, x:2, y:7, z:7, p:3, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbbf, {
  name: "RES 7,(ix+dd),a",
  bytes: "dd cb bf",
  doc: "Reset bit 7 of (ix+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:192, x:3, y:0, z:0, p:0, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbc0, {
  name: "SET 0,(ix+dd),b",
  bytes: "dd cb c0",
  doc: "ld b, (set 0, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:193, x:3, y:0, z:1, p:0, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbc1, {
  name: "SET 0,(ix+dd),c",
  bytes: "dd cb c1",
  doc: "ld c, (set 0, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:194, x:3, y:0, z:2, p:0, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbc2, {
  name: "SET 0,(ix+dd),d",
  bytes: "dd cb c2",
  doc: "ld d, (set 0, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:195, x:3, y:0, z:3, p:0, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbc3, {
  name: "SET 0,(ix+dd),e",
  bytes: "dd cb c3",
  doc: "ld e, (set 0, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:196, x:3, y:0, z:4, p:0, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbc4, {
  name: "SET 0,(ix+dd),h",
  bytes: "dd cb c4",
  doc: "ld h, (set 0, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:197, x:3, y:0, z:5, p:0, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbc5, {
  name: "SET 0,(ix+dd),l",
  bytes: "dd cb c5",
  doc: "ld l, (set 0, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:198, x:3, y:0, z:6, p:0, q:0}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcbc6, {
  name: "SET 0,(ix+dd),(ix+dd)",
  bytes: "dd cb c6",
  doc: "ld (ix+dd), (set 0, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:199, x:3, y:0, z:7, p:0, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbc7, {
  name: "SET 0,(ix+dd),a",
  bytes: "dd cb c7",
  doc: "ld a, (set 0, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:200, x:3, y:1, z:0, p:0, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbc8, {
  name: "SET 1,(ix+dd),b",
  bytes: "dd cb c8",
  doc: "ld b, (set 1, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:201, x:3, y:1, z:1, p:0, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbc9, {
  name: "SET 1,(ix+dd),c",
  bytes: "dd cb c9",
  doc: "ld c, (set 1, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:202, x:3, y:1, z:2, p:0, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbca, {
  name: "SET 1,(ix+dd),d",
  bytes: "dd cb ca",
  doc: "ld d, (set 1, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:203, x:3, y:1, z:3, p:0, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbcb, {
  name: "SET 1,(ix+dd),e",
  bytes: "dd cb cb",
  doc: "ld e, (set 1, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:204, x:3, y:1, z:4, p:0, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbcc, {
  name: "SET 1,(ix+dd),h",
  bytes: "dd cb cc",
  doc: "ld h, (set 1, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:205, x:3, y:1, z:5, p:0, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbcd, {
  name: "SET 1,(ix+dd),l",
  bytes: "dd cb cd",
  doc: "ld l, (set 1, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:206, x:3, y:1, z:6, p:0, q:1}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcbce, {
  name: "SET 1,(ix+dd),(ix+dd)",
  bytes: "dd cb ce",
  doc: "ld (ix+dd), (set 1, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:207, x:3, y:1, z:7, p:0, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbcf, {
  name: "SET 1,(ix+dd),a",
  bytes: "dd cb cf",
  doc: "ld a, (set 1, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:208, x:3, y:2, z:0, p:1, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbd0, {
  name: "SET 2,(ix+dd),b",
  bytes: "dd cb d0",
  doc: "ld b, (set 2, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:209, x:3, y:2, z:1, p:1, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbd1, {
  name: "SET 2,(ix+dd),c",
  bytes: "dd cb d1",
  doc: "ld c, (set 2, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:210, x:3, y:2, z:2, p:1, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbd2, {
  name: "SET 2,(ix+dd),d",
  bytes: "dd cb d2",
  doc: "ld d, (set 2, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:211, x:3, y:2, z:3, p:1, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbd3, {
  name: "SET 2,(ix+dd),e",
  bytes: "dd cb d3",
  doc: "ld e, (set 2, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:212, x:3, y:2, z:4, p:1, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbd4, {
  name: "SET 2,(ix+dd),h",
  bytes: "dd cb d4",
  doc: "ld h, (set 2, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:213, x:3, y:2, z:5, p:1, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbd5, {
  name: "SET 2,(ix+dd),l",
  bytes: "dd cb d5",
  doc: "ld l, (set 2, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:214, x:3, y:2, z:6, p:1, q:0}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcbd6, {
  name: "SET 2,(ix+dd),(ix+dd)",
  bytes: "dd cb d6",
  doc: "ld (ix+dd), (set 2, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:215, x:3, y:2, z:7, p:1, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbd7, {
  name: "SET 2,(ix+dd),a",
  bytes: "dd cb d7",
  doc: "ld a, (set 2, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:216, x:3, y:3, z:0, p:1, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbd8, {
  name: "SET 3,(ix+dd),b",
  bytes: "dd cb d8",
  doc: "ld b, (set 3, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:217, x:3, y:3, z:1, p:1, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbd9, {
  name: "SET 3,(ix+dd),c",
  bytes: "dd cb d9",
  doc: "ld c, (set 3, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:218, x:3, y:3, z:2, p:1, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbda, {
  name: "SET 3,(ix+dd),d",
  bytes: "dd cb da",
  doc: "ld d, (set 3, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:219, x:3, y:3, z:3, p:1, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbdb, {
  name: "SET 3,(ix+dd),e",
  bytes: "dd cb db",
  doc: "ld e, (set 3, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:220, x:3, y:3, z:4, p:1, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbdc, {
  name: "SET 3,(ix+dd),h",
  bytes: "dd cb dc",
  doc: "ld h, (set 3, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:221, x:3, y:3, z:5, p:1, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbdd, {
  name: "SET 3,(ix+dd),l",
  bytes: "dd cb dd",
  doc: "ld l, (set 3, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:222, x:3, y:3, z:6, p:1, q:1}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcbde, {
  name: "SET 3,(ix+dd),(ix+dd)",
  bytes: "dd cb de",
  doc: "ld (ix+dd), (set 3, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:223, x:3, y:3, z:7, p:1, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbdf, {
  name: "SET 3,(ix+dd),a",
  bytes: "dd cb df",
  doc: "ld a, (set 3, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:224, x:3, y:4, z:0, p:2, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbe0, {
  name: "SET 4,(ix+dd),b",
  bytes: "dd cb e0",
  doc: "ld b, (set 4, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:225, x:3, y:4, z:1, p:2, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbe1, {
  name: "SET 4,(ix+dd),c",
  bytes: "dd cb e1",
  doc: "ld c, (set 4, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:226, x:3, y:4, z:2, p:2, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbe2, {
  name: "SET 4,(ix+dd),d",
  bytes: "dd cb e2",
  doc: "ld d, (set 4, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:227, x:3, y:4, z:3, p:2, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbe3, {
  name: "SET 4,(ix+dd),e",
  bytes: "dd cb e3",
  doc: "ld e, (set 4, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:228, x:3, y:4, z:4, p:2, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbe4, {
  name: "SET 4,(ix+dd),h",
  bytes: "dd cb e4",
  doc: "ld h, (set 4, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:229, x:3, y:4, z:5, p:2, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbe5, {
  name: "SET 4,(ix+dd),l",
  bytes: "dd cb e5",
  doc: "ld l, (set 4, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:230, x:3, y:4, z:6, p:2, q:0}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcbe6, {
  name: "SET 4,(ix+dd),(ix+dd)",
  bytes: "dd cb e6",
  doc: "ld (ix+dd), (set 4, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:231, x:3, y:4, z:7, p:2, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbe7, {
  name: "SET 4,(ix+dd),a",
  bytes: "dd cb e7",
  doc: "ld a, (set 4, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:232, x:3, y:5, z:0, p:2, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbe8, {
  name: "SET 5,(ix+dd),b",
  bytes: "dd cb e8",
  doc: "ld b, (set 5, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:233, x:3, y:5, z:1, p:2, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbe9, {
  name: "SET 5,(ix+dd),c",
  bytes: "dd cb e9",
  doc: "ld c, (set 5, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:234, x:3, y:5, z:2, p:2, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbea, {
  name: "SET 5,(ix+dd),d",
  bytes: "dd cb ea",
  doc: "ld d, (set 5, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:235, x:3, y:5, z:3, p:2, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbeb, {
  name: "SET 5,(ix+dd),e",
  bytes: "dd cb eb",
  doc: "ld e, (set 5, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:236, x:3, y:5, z:4, p:2, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbec, {
  name: "SET 5,(ix+dd),h",
  bytes: "dd cb ec",
  doc: "ld h, (set 5, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:237, x:3, y:5, z:5, p:2, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbed, {
  name: "SET 5,(ix+dd),l",
  bytes: "dd cb ed",
  doc: "ld l, (set 5, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:238, x:3, y:5, z:6, p:2, q:1}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcbee, {
  name: "SET 5,(ix+dd),(ix+dd)",
  bytes: "dd cb ee",
  doc: "ld (ix+dd), (set 5, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:239, x:3, y:5, z:7, p:2, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbef, {
  name: "SET 5,(ix+dd),a",
  bytes: "dd cb ef",
  doc: "ld a, (set 5, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:240, x:3, y:6, z:0, p:3, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbf0, {
  name: "SET 6,(ix+dd),b",
  bytes: "dd cb f0",
  doc: "ld b, (set 6, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:241, x:3, y:6, z:1, p:3, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbf1, {
  name: "SET 6,(ix+dd),c",
  bytes: "dd cb f1",
  doc: "ld c, (set 6, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:242, x:3, y:6, z:2, p:3, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbf2, {
  name: "SET 6,(ix+dd),d",
  bytes: "dd cb f2",
  doc: "ld d, (set 6, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:243, x:3, y:6, z:3, p:3, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbf3, {
  name: "SET 6,(ix+dd),e",
  bytes: "dd cb f3",
  doc: "ld e, (set 6, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:244, x:3, y:6, z:4, p:3, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbf4, {
  name: "SET 6,(ix+dd),h",
  bytes: "dd cb f4",
  doc: "ld h, (set 6, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:245, x:3, y:6, z:5, p:3, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbf5, {
  name: "SET 6,(ix+dd),l",
  bytes: "dd cb f5",
  doc: "ld l, (set 6, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:246, x:3, y:6, z:6, p:3, q:0}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcbf6, {
  name: "SET 6,(ix+dd),(ix+dd)",
  bytes: "dd cb f6",
  doc: "ld (ix+dd), (set 6, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:247, x:3, y:6, z:7, p:3, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbf7, {
  name: "SET 6,(ix+dd),a",
  bytes: "dd cb f7",
  doc: "ld a, (set 6, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:248, x:3, y:7, z:0, p:3, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbf8, {
  name: "SET 7,(ix+dd),b",
  bytes: "dd cb f8",
  doc: "ld b, (set 7, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:249, x:3, y:7, z:1, p:3, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbf9, {
  name: "SET 7,(ix+dd),c",
  bytes: "dd cb f9",
  doc: "ld c, (set 7, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:250, x:3, y:7, z:2, p:3, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbfa, {
  name: "SET 7,(ix+dd),d",
  bytes: "dd cb fa",
  doc: "ld d, (set 7, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:251, x:3, y:7, z:3, p:3, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbfb, {
  name: "SET 7,(ix+dd),e",
  bytes: "dd cb fb",
  doc: "ld e, (set 7, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:252, x:3, y:7, z:4, p:3, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbfc, {
  name: "SET 7,(ix+dd),h",
  bytes: "dd cb fc",
  doc: "ld h, (set 7, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:253, x:3, y:7, z:5, p:3, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbfd, {
  name: "SET 7,(ix+dd),l",
  bytes: "dd cb fd",
  doc: "ld l, (set 7, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:254, x:3, y:7, z:6, p:3, q:1}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xddcbfe, {
  name: "SET 7,(ix+dd),(ix+dd)",
  bytes: "dd cb fe",
  doc: "ld (ix+dd), (set 7, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:255, x:3, y:7, z:7, p:3, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xddcbff, {
  name: "SET 7,(ix+dd),a",
  bytes: "dd cb ff",
  doc: "ld a, (set 7, (ix+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:0, x:0, y:0, z:0, p:0, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb00, {
  name: "rlc (iy+dd),b",
  bytes: "fd cb 00",
  doc: "b = Rotate left through carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.rlc(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:1, x:0, y:0, z:1, p:0, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb01, {
  name: "rlc (iy+dd),c",
  bytes: "fd cb 01",
  doc: "c = Rotate left through carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.rlc(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:2, x:0, y:0, z:2, p:0, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb02, {
  name: "rlc (iy+dd),d",
  bytes: "fd cb 02",
  doc: "d = Rotate left through carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.rlc(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:3, x:0, y:0, z:3, p:0, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb03, {
  name: "rlc (iy+dd),e",
  bytes: "fd cb 03",
  doc: "e = Rotate left through carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.rlc(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:4, x:0, y:0, z:4, p:0, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb04, {
  name: "rlc (iy+dd),iyh",
  bytes: "fd cb 04",
  doc: "iyh = Rotate left through carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.rlc(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:5, x:0, y:0, z:5, p:0, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb05, {
  name: "rlc (iy+dd),iyl",
  bytes: "fd cb 05",
  doc: "iyl = Rotate left through carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.rlc(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:7, x:0, y:0, z:7, p:0, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb07, {
  name: "rlc (iy+dd),a",
  bytes: "fd cb 07",
  doc: "a = Rotate left through carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.rlc(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:8, x:0, y:1, z:0, p:0, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb08, {
  name: "rrc (iy+dd),b",
  bytes: "fd cb 08",
  doc: "b = Rotate right through carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.rrc(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:9, x:0, y:1, z:1, p:0, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb09, {
  name: "rrc (iy+dd),c",
  bytes: "fd cb 09",
  doc: "c = Rotate right through carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.rrc(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:10, x:0, y:1, z:2, p:0, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb0a, {
  name: "rrc (iy+dd),d",
  bytes: "fd cb 0a",
  doc: "d = Rotate right through carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.rrc(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:11, x:0, y:1, z:3, p:0, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb0b, {
  name: "rrc (iy+dd),e",
  bytes: "fd cb 0b",
  doc: "e = Rotate right through carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.rrc(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:12, x:0, y:1, z:4, p:0, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb0c, {
  name: "rrc (iy+dd),iyh",
  bytes: "fd cb 0c",
  doc: "iyh = Rotate right through carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.rrc(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:13, x:0, y:1, z:5, p:0, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb0d, {
  name: "rrc (iy+dd),iyl",
  bytes: "fd cb 0d",
  doc: "iyl = Rotate right through carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.rrc(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:15, x:0, y:1, z:7, p:0, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb0f, {
  name: "rrc (iy+dd),a",
  bytes: "fd cb 0f",
  doc: "a = Rotate right through carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.rrc(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:16, x:0, y:2, z:0, p:1, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb10, {
  name: "rl (iy+dd),b",
  bytes: "fd cb 10",
  doc: "b = Rotate left from carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.rl(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:17, x:0, y:2, z:1, p:1, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb11, {
  name: "rl (iy+dd),c",
  bytes: "fd cb 11",
  doc: "c = Rotate left from carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.rl(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:18, x:0, y:2, z:2, p:1, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb12, {
  name: "rl (iy+dd),d",
  bytes: "fd cb 12",
  doc: "d = Rotate left from carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.rl(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:19, x:0, y:2, z:3, p:1, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb13, {
  name: "rl (iy+dd),e",
  bytes: "fd cb 13",
  doc: "e = Rotate left from carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.rl(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:20, x:0, y:2, z:4, p:1, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb14, {
  name: "rl (iy+dd),iyh",
  bytes: "fd cb 14",
  doc: "iyh = Rotate left from carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.rl(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:21, x:0, y:2, z:5, p:1, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb15, {
  name: "rl (iy+dd),iyl",
  bytes: "fd cb 15",
  doc: "iyl = Rotate left from carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.rl(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:23, x:0, y:2, z:7, p:1, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb17, {
  name: "rl (iy+dd),a",
  bytes: "fd cb 17",
  doc: "a = Rotate left from carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.rl(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:24, x:0, y:3, z:0, p:1, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb18, {
  name: "rr (iy+dd),b",
  bytes: "fd cb 18",
  doc: "b = Rotate right from carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.rr(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:25, x:0, y:3, z:1, p:1, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb19, {
  name: "rr (iy+dd),c",
  bytes: "fd cb 19",
  doc: "c = Rotate right from carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.rr(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:26, x:0, y:3, z:2, p:1, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb1a, {
  name: "rr (iy+dd),d",
  bytes: "fd cb 1a",
  doc: "d = Rotate right from carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.rr(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:27, x:0, y:3, z:3, p:1, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb1b, {
  name: "rr (iy+dd),e",
  bytes: "fd cb 1b",
  doc: "e = Rotate right from carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.rr(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:28, x:0, y:3, z:4, p:1, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb1c, {
  name: "rr (iy+dd),iyh",
  bytes: "fd cb 1c",
  doc: "iyh = Rotate right from carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.rr(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:29, x:0, y:3, z:5, p:1, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb1d, {
  name: "rr (iy+dd),iyl",
  bytes: "fd cb 1d",
  doc: "iyl = Rotate right from carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.rr(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:31, x:0, y:3, z:7, p:1, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb1f, {
  name: "rr (iy+dd),a",
  bytes: "fd cb 1f",
  doc: "a = Rotate right from carry (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.rr(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:32, x:0, y:4, z:0, p:2, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb20, {
  name: "sla (iy+dd),b",
  bytes: "fd cb 20",
  doc: "b = Shift left arithmetic (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.sla(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:33, x:0, y:4, z:1, p:2, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb21, {
  name: "sla (iy+dd),c",
  bytes: "fd cb 21",
  doc: "c = Shift left arithmetic (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.sla(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:34, x:0, y:4, z:2, p:2, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb22, {
  name: "sla (iy+dd),d",
  bytes: "fd cb 22",
  doc: "d = Shift left arithmetic (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.sla(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:35, x:0, y:4, z:3, p:2, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb23, {
  name: "sla (iy+dd),e",
  bytes: "fd cb 23",
  doc: "e = Shift left arithmetic (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.sla(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:36, x:0, y:4, z:4, p:2, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb24, {
  name: "sla (iy+dd),iyh",
  bytes: "fd cb 24",
  doc: "iyh = Shift left arithmetic (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.sla(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:37, x:0, y:4, z:5, p:2, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb25, {
  name: "sla (iy+dd),iyl",
  bytes: "fd cb 25",
  doc: "iyl = Shift left arithmetic (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.sla(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:39, x:0, y:4, z:7, p:2, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb27, {
  name: "sla (iy+dd),a",
  bytes: "fd cb 27",
  doc: "a = Shift left arithmetic (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.sla(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:40, x:0, y:5, z:0, p:2, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb28, {
  name: "sra (iy+dd),b",
  bytes: "fd cb 28",
  doc: "b = Shift right arithmetic (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.sra(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:41, x:0, y:5, z:1, p:2, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb29, {
  name: "sra (iy+dd),c",
  bytes: "fd cb 29",
  doc: "c = Shift right arithmetic (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.sra(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:42, x:0, y:5, z:2, p:2, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb2a, {
  name: "sra (iy+dd),d",
  bytes: "fd cb 2a",
  doc: "d = Shift right arithmetic (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.sra(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:43, x:0, y:5, z:3, p:2, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb2b, {
  name: "sra (iy+dd),e",
  bytes: "fd cb 2b",
  doc: "e = Shift right arithmetic (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.sra(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:44, x:0, y:5, z:4, p:2, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb2c, {
  name: "sra (iy+dd),iyh",
  bytes: "fd cb 2c",
  doc: "iyh = Shift right arithmetic (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.sra(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:45, x:0, y:5, z:5, p:2, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb2d, {
  name: "sra (iy+dd),iyl",
  bytes: "fd cb 2d",
  doc: "iyl = Shift right arithmetic (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.sra(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:47, x:0, y:5, z:7, p:2, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb2f, {
  name: "sra (iy+dd),a",
  bytes: "fd cb 2f",
  doc: "a = Shift right arithmetic (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.sra(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:48, x:0, y:6, z:0, p:3, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb30, {
  name: "sll (iy+dd),b",
  bytes: "fd cb 30",
  doc: "b = Shift left logical (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.sll(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:49, x:0, y:6, z:1, p:3, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb31, {
  name: "sll (iy+dd),c",
  bytes: "fd cb 31",
  doc: "c = Shift left logical (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.sll(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:50, x:0, y:6, z:2, p:3, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb32, {
  name: "sll (iy+dd),d",
  bytes: "fd cb 32",
  doc: "d = Shift left logical (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.sll(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:51, x:0, y:6, z:3, p:3, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb33, {
  name: "sll (iy+dd),e",
  bytes: "fd cb 33",
  doc: "e = Shift left logical (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.sll(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:52, x:0, y:6, z:4, p:3, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb34, {
  name: "sll (iy+dd),iyh",
  bytes: "fd cb 34",
  doc: "iyh = Shift left logical (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.sll(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:53, x:0, y:6, z:5, p:3, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb35, {
  name: "sll (iy+dd),iyl",
  bytes: "fd cb 35",
  doc: "iyl = Shift left logical (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.sll(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:55, x:0, y:6, z:7, p:3, q:0}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb37, {
  name: "sll (iy+dd),a",
  bytes: "fd cb 37",
  doc: "a = Shift left logical (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.sll(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:56, x:0, y:7, z:0, p:3, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb38, {
  name: "srl (iy+dd),b",
  bytes: "fd cb 38",
  doc: "b = Shift right logical (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.b = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.b = z80.alu.srl(z80.regs.b);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:57, x:0, y:7, z:1, p:3, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb39, {
  name: "srl (iy+dd),c",
  bytes: "fd cb 39",
  doc: "c = Shift right logical (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.c = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.c = z80.alu.srl(z80.regs.c);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:58, x:0, y:7, z:2, p:3, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb3a, {
  name: "srl (iy+dd),d",
  bytes: "fd cb 3a",
  doc: "d = Shift right logical (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.d = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.d = z80.alu.srl(z80.regs.d);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:59, x:0, y:7, z:3, p:3, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb3b, {
  name: "srl (iy+dd),e",
  bytes: "fd cb 3b",
  doc: "e = Shift right logical (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.e = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.e = z80.alu.srl(z80.regs.e);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:60, x:0, y:7, z:4, p:3, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb3c, {
  name: "srl (iy+dd),iyh",
  bytes: "fd cb 3c",
  doc: "iyh = Shift right logical (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.h = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.h = z80.alu.srl(z80.regs.h);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:61, x:0, y:7, z:5, p:3, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb3d, {
  name: "srl (iy+dd),iyl",
  bytes: "fd cb 3d",
  doc: "iyl = Shift right logical (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.l = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.l = z80.alu.srl(z80.regs.l);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:63, x:0, y:7, z:7, p:3, q:1}
// $ROT ($RI+dd),$RZ
opcodes.set(0xfdcb3f, {
  name: "srl (iy+dd),a",
  bytes: "fd cb 3f",
  doc: "a = Shift right logical (iy+dd)",
  group: "RT/SH 8bit",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $RRZ}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    z80.regs.a = z80.dbus;
    // overlapped: {action: "$RRZ=$ROT($RRZ)"}
    z80.regs.a = z80.alu.srl(z80.regs.a);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:70, x:1, y:0, z:6, p:0, q:0}
// BIT $NY, ($RI+dd)
opcodes.set(0xfdcb46, {
  name: "BIT 0,(iy+dd)",
  bytes: "fd cb 46",
  doc: "f.Z = bit 0 of (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x1, z80.dbus);
  },
});

// {n:78, x:1, y:1, z:6, p:0, q:1}
// BIT $NY, ($RI+dd)
opcodes.set(0xfdcb4e, {
  name: "BIT 1,(iy+dd)",
  bytes: "fd cb 4e",
  doc: "f.Z = bit 1 of (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x2, z80.dbus);
  },
});

// {n:86, x:1, y:2, z:6, p:1, q:0}
// BIT $NY, ($RI+dd)
opcodes.set(0xfdcb56, {
  name: "BIT 2,(iy+dd)",
  bytes: "fd cb 56",
  doc: "f.Z = bit 2 of (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x4, z80.dbus);
  },
});

// {n:94, x:1, y:3, z:6, p:1, q:1}
// BIT $NY, ($RI+dd)
opcodes.set(0xfdcb5e, {
  name: "BIT 3,(iy+dd)",
  bytes: "fd cb 5e",
  doc: "f.Z = bit 3 of (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x8, z80.dbus);
  },
});

// {n:102, x:1, y:4, z:6, p:2, q:0}
// BIT $NY, ($RI+dd)
opcodes.set(0xfdcb66, {
  name: "BIT 4,(iy+dd)",
  bytes: "fd cb 66",
  doc: "f.Z = bit 4 of (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x10, z80.dbus);
  },
});

// {n:110, x:1, y:5, z:6, p:2, q:1}
// BIT $NY, ($RI+dd)
opcodes.set(0xfdcb6e, {
  name: "BIT 5,(iy+dd)",
  bytes: "fd cb 6e",
  doc: "f.Z = bit 5 of (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x20, z80.dbus);
  },
});

// {n:118, x:1, y:6, z:6, p:3, q:0}
// BIT $NY, ($RI+dd)
opcodes.set(0xfdcb76, {
  name: "BIT 6,(iy+dd)",
  bytes: "fd cb 76",
  doc: "f.Z = bit 6 of (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x40, z80.dbus);
  },
});

// {n:126, x:1, y:7, z:6, p:3, q:1}
// BIT $NY, ($RI+dd)
opcodes.set(0xfdcb7e, {
  name: "BIT 7,(iy+dd)",
  bytes: "fd cb 7e",
  doc: "f.Z = bit 7 of (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "z80.alu.bitHL($BITY, $DLATCH)"}
    z80.alu.bitHL(0x80, z80.dbus);
  },
});

// {n:128, x:2, y:0, z:0, p:0, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb80, {
  name: "RES 0,(iy+dd),b",
  bytes: "fd cb 80",
  doc: "Reset bit 0 of (iy+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:129, x:2, y:0, z:1, p:0, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb81, {
  name: "RES 0,(iy+dd),c",
  bytes: "fd cb 81",
  doc: "Reset bit 0 of (iy+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:130, x:2, y:0, z:2, p:0, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb82, {
  name: "RES 0,(iy+dd),d",
  bytes: "fd cb 82",
  doc: "Reset bit 0 of (iy+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:131, x:2, y:0, z:3, p:0, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb83, {
  name: "RES 0,(iy+dd),e",
  bytes: "fd cb 83",
  doc: "Reset bit 0 of (iy+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:132, x:2, y:0, z:4, p:0, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb84, {
  name: "RES 0,(iy+dd),h",
  bytes: "fd cb 84",
  doc: "Reset bit 0 of (iy+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:133, x:2, y:0, z:5, p:0, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb85, {
  name: "RES 0,(iy+dd),l",
  bytes: "fd cb 85",
  doc: "Reset bit 0 of (iy+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:134, x:2, y:0, z:6, p:0, q:0}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcb86, {
  name: "RES 0,(iy+dd),(iy+dd)",
  bytes: "fd cb 86",
  doc: "Reset bit 0 of (iy+dd) load into (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:135, x:2, y:0, z:7, p:0, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb87, {
  name: "RES 0,(iy+dd),a",
  bytes: "fd cb 87",
  doc: "Reset bit 0 of (iy+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:136, x:2, y:1, z:0, p:0, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb88, {
  name: "RES 1,(iy+dd),b",
  bytes: "fd cb 88",
  doc: "Reset bit 1 of (iy+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:137, x:2, y:1, z:1, p:0, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb89, {
  name: "RES 1,(iy+dd),c",
  bytes: "fd cb 89",
  doc: "Reset bit 1 of (iy+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:138, x:2, y:1, z:2, p:0, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb8a, {
  name: "RES 1,(iy+dd),d",
  bytes: "fd cb 8a",
  doc: "Reset bit 1 of (iy+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:139, x:2, y:1, z:3, p:0, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb8b, {
  name: "RES 1,(iy+dd),e",
  bytes: "fd cb 8b",
  doc: "Reset bit 1 of (iy+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:140, x:2, y:1, z:4, p:0, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb8c, {
  name: "RES 1,(iy+dd),h",
  bytes: "fd cb 8c",
  doc: "Reset bit 1 of (iy+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:141, x:2, y:1, z:5, p:0, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb8d, {
  name: "RES 1,(iy+dd),l",
  bytes: "fd cb 8d",
  doc: "Reset bit 1 of (iy+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:142, x:2, y:1, z:6, p:0, q:1}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcb8e, {
  name: "RES 1,(iy+dd),(iy+dd)",
  bytes: "fd cb 8e",
  doc: "Reset bit 1 of (iy+dd) load into (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:143, x:2, y:1, z:7, p:0, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb8f, {
  name: "RES 1,(iy+dd),a",
  bytes: "fd cb 8f",
  doc: "Reset bit 1 of (iy+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:144, x:2, y:2, z:0, p:1, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb90, {
  name: "RES 2,(iy+dd),b",
  bytes: "fd cb 90",
  doc: "Reset bit 2 of (iy+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:145, x:2, y:2, z:1, p:1, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb91, {
  name: "RES 2,(iy+dd),c",
  bytes: "fd cb 91",
  doc: "Reset bit 2 of (iy+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:146, x:2, y:2, z:2, p:1, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb92, {
  name: "RES 2,(iy+dd),d",
  bytes: "fd cb 92",
  doc: "Reset bit 2 of (iy+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:147, x:2, y:2, z:3, p:1, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb93, {
  name: "RES 2,(iy+dd),e",
  bytes: "fd cb 93",
  doc: "Reset bit 2 of (iy+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:148, x:2, y:2, z:4, p:1, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb94, {
  name: "RES 2,(iy+dd),h",
  bytes: "fd cb 94",
  doc: "Reset bit 2 of (iy+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:149, x:2, y:2, z:5, p:1, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb95, {
  name: "RES 2,(iy+dd),l",
  bytes: "fd cb 95",
  doc: "Reset bit 2 of (iy+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:150, x:2, y:2, z:6, p:1, q:0}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcb96, {
  name: "RES 2,(iy+dd),(iy+dd)",
  bytes: "fd cb 96",
  doc: "Reset bit 2 of (iy+dd) load into (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:151, x:2, y:2, z:7, p:1, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb97, {
  name: "RES 2,(iy+dd),a",
  bytes: "fd cb 97",
  doc: "Reset bit 2 of (iy+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:152, x:2, y:3, z:0, p:1, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb98, {
  name: "RES 3,(iy+dd),b",
  bytes: "fd cb 98",
  doc: "Reset bit 3 of (iy+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:153, x:2, y:3, z:1, p:1, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb99, {
  name: "RES 3,(iy+dd),c",
  bytes: "fd cb 99",
  doc: "Reset bit 3 of (iy+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:154, x:2, y:3, z:2, p:1, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb9a, {
  name: "RES 3,(iy+dd),d",
  bytes: "fd cb 9a",
  doc: "Reset bit 3 of (iy+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:155, x:2, y:3, z:3, p:1, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb9b, {
  name: "RES 3,(iy+dd),e",
  bytes: "fd cb 9b",
  doc: "Reset bit 3 of (iy+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:156, x:2, y:3, z:4, p:1, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb9c, {
  name: "RES 3,(iy+dd),h",
  bytes: "fd cb 9c",
  doc: "Reset bit 3 of (iy+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:157, x:2, y:3, z:5, p:1, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb9d, {
  name: "RES 3,(iy+dd),l",
  bytes: "fd cb 9d",
  doc: "Reset bit 3 of (iy+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:158, x:2, y:3, z:6, p:1, q:1}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcb9e, {
  name: "RES 3,(iy+dd),(iy+dd)",
  bytes: "fd cb 9e",
  doc: "Reset bit 3 of (iy+dd) load into (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:159, x:2, y:3, z:7, p:1, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcb9f, {
  name: "RES 3,(iy+dd),a",
  bytes: "fd cb 9f",
  doc: "Reset bit 3 of (iy+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:160, x:2, y:4, z:0, p:2, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcba0, {
  name: "RES 4,(iy+dd),b",
  bytes: "fd cb a0",
  doc: "Reset bit 4 of (iy+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:161, x:2, y:4, z:1, p:2, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcba1, {
  name: "RES 4,(iy+dd),c",
  bytes: "fd cb a1",
  doc: "Reset bit 4 of (iy+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:162, x:2, y:4, z:2, p:2, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcba2, {
  name: "RES 4,(iy+dd),d",
  bytes: "fd cb a2",
  doc: "Reset bit 4 of (iy+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:163, x:2, y:4, z:3, p:2, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcba3, {
  name: "RES 4,(iy+dd),e",
  bytes: "fd cb a3",
  doc: "Reset bit 4 of (iy+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:164, x:2, y:4, z:4, p:2, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcba4, {
  name: "RES 4,(iy+dd),h",
  bytes: "fd cb a4",
  doc: "Reset bit 4 of (iy+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:165, x:2, y:4, z:5, p:2, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcba5, {
  name: "RES 4,(iy+dd),l",
  bytes: "fd cb a5",
  doc: "Reset bit 4 of (iy+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:166, x:2, y:4, z:6, p:2, q:0}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcba6, {
  name: "RES 4,(iy+dd),(iy+dd)",
  bytes: "fd cb a6",
  doc: "Reset bit 4 of (iy+dd) load into (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:167, x:2, y:4, z:7, p:2, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcba7, {
  name: "RES 4,(iy+dd),a",
  bytes: "fd cb a7",
  doc: "Reset bit 4 of (iy+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:168, x:2, y:5, z:0, p:2, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcba8, {
  name: "RES 5,(iy+dd),b",
  bytes: "fd cb a8",
  doc: "Reset bit 5 of (iy+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:169, x:2, y:5, z:1, p:2, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcba9, {
  name: "RES 5,(iy+dd),c",
  bytes: "fd cb a9",
  doc: "Reset bit 5 of (iy+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:170, x:2, y:5, z:2, p:2, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbaa, {
  name: "RES 5,(iy+dd),d",
  bytes: "fd cb aa",
  doc: "Reset bit 5 of (iy+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:171, x:2, y:5, z:3, p:2, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbab, {
  name: "RES 5,(iy+dd),e",
  bytes: "fd cb ab",
  doc: "Reset bit 5 of (iy+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:172, x:2, y:5, z:4, p:2, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbac, {
  name: "RES 5,(iy+dd),h",
  bytes: "fd cb ac",
  doc: "Reset bit 5 of (iy+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:173, x:2, y:5, z:5, p:2, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbad, {
  name: "RES 5,(iy+dd),l",
  bytes: "fd cb ad",
  doc: "Reset bit 5 of (iy+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:174, x:2, y:5, z:6, p:2, q:1}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcbae, {
  name: "RES 5,(iy+dd),(iy+dd)",
  bytes: "fd cb ae",
  doc: "Reset bit 5 of (iy+dd) load into (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:175, x:2, y:5, z:7, p:2, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbaf, {
  name: "RES 5,(iy+dd),a",
  bytes: "fd cb af",
  doc: "Reset bit 5 of (iy+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:176, x:2, y:6, z:0, p:3, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbb0, {
  name: "RES 6,(iy+dd),b",
  bytes: "fd cb b0",
  doc: "Reset bit 6 of (iy+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:177, x:2, y:6, z:1, p:3, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbb1, {
  name: "RES 6,(iy+dd),c",
  bytes: "fd cb b1",
  doc: "Reset bit 6 of (iy+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:178, x:2, y:6, z:2, p:3, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbb2, {
  name: "RES 6,(iy+dd),d",
  bytes: "fd cb b2",
  doc: "Reset bit 6 of (iy+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:179, x:2, y:6, z:3, p:3, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbb3, {
  name: "RES 6,(iy+dd),e",
  bytes: "fd cb b3",
  doc: "Reset bit 6 of (iy+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:180, x:2, y:6, z:4, p:3, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbb4, {
  name: "RES 6,(iy+dd),h",
  bytes: "fd cb b4",
  doc: "Reset bit 6 of (iy+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:181, x:2, y:6, z:5, p:3, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbb5, {
  name: "RES 6,(iy+dd),l",
  bytes: "fd cb b5",
  doc: "Reset bit 6 of (iy+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:182, x:2, y:6, z:6, p:3, q:0}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcbb6, {
  name: "RES 6,(iy+dd),(iy+dd)",
  bytes: "fd cb b6",
  doc: "Reset bit 6 of (iy+dd) load into (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:183, x:2, y:6, z:7, p:3, q:0}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbb7, {
  name: "RES 6,(iy+dd),a",
  bytes: "fd cb b7",
  doc: "Reset bit 6 of (iy+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:184, x:2, y:7, z:0, p:3, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbb8, {
  name: "RES 7,(iy+dd),b",
  bytes: "fd cb b8",
  doc: "Reset bit 7 of (iy+dd) load into b",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.b = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:185, x:2, y:7, z:1, p:3, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbb9, {
  name: "RES 7,(iy+dd),c",
  bytes: "fd cb b9",
  doc: "Reset bit 7 of (iy+dd) load into c",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.c = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:186, x:2, y:7, z:2, p:3, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbba, {
  name: "RES 7,(iy+dd),d",
  bytes: "fd cb ba",
  doc: "Reset bit 7 of (iy+dd) load into d",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.d = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:187, x:2, y:7, z:3, p:3, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbbb, {
  name: "RES 7,(iy+dd),e",
  bytes: "fd cb bb",
  doc: "Reset bit 7 of (iy+dd) load into e",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.e = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:188, x:2, y:7, z:4, p:3, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbbc, {
  name: "RES 7,(iy+dd),h",
  bytes: "fd cb bc",
  doc: "Reset bit 7 of (iy+dd) load into h",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.h = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:189, x:2, y:7, z:5, p:3, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbbd, {
  name: "RES 7,(iy+dd),l",
  bytes: "fd cb bd",
  doc: "Reset bit 7 of (iy+dd) load into l",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.l = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:190, x:2, y:7, z:6, p:3, q:1}
// RES $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcbbe, {
  name: "RES 7,(iy+dd),(iy+dd)",
  bytes: "fd cb be",
  doc: "Reset bit 7 of (iy+dd) load into (iy+dd)",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.res($NY, $DLATCH)"}
    z80.dbus = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:191, x:2, y:7, z:7, p:3, q:1}
// RES $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbbf, {
  name: "RES 7,(iy+dd),a",
  bytes: "fd cb bf",
  doc: "Reset bit 7 of (iy+dd) load into a",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles:4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.res($NY, $DLATCH)"}
    z80.regs.a = z80.alu.res(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:192, x:3, y:0, z:0, p:0, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbc0, {
  name: "SET 0,(iy+dd),b",
  bytes: "fd cb c0",
  doc: "ld b, (set 0, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:193, x:3, y:0, z:1, p:0, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbc1, {
  name: "SET 0,(iy+dd),c",
  bytes: "fd cb c1",
  doc: "ld c, (set 0, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:194, x:3, y:0, z:2, p:0, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbc2, {
  name: "SET 0,(iy+dd),d",
  bytes: "fd cb c2",
  doc: "ld d, (set 0, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:195, x:3, y:0, z:3, p:0, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbc3, {
  name: "SET 0,(iy+dd),e",
  bytes: "fd cb c3",
  doc: "ld e, (set 0, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:196, x:3, y:0, z:4, p:0, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbc4, {
  name: "SET 0,(iy+dd),h",
  bytes: "fd cb c4",
  doc: "ld h, (set 0, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:197, x:3, y:0, z:5, p:0, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbc5, {
  name: "SET 0,(iy+dd),l",
  bytes: "fd cb c5",
  doc: "ld l, (set 0, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:198, x:3, y:0, z:6, p:0, q:0}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcbc6, {
  name: "SET 0,(iy+dd),(iy+dd)",
  bytes: "fd cb c6",
  doc: "ld (iy+dd), (set 0, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:199, x:3, y:0, z:7, p:0, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbc7, {
  name: "SET 0,(iy+dd),a",
  bytes: "fd cb c7",
  doc: "ld a, (set 0, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(0, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:200, x:3, y:1, z:0, p:0, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbc8, {
  name: "SET 1,(iy+dd),b",
  bytes: "fd cb c8",
  doc: "ld b, (set 1, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:201, x:3, y:1, z:1, p:0, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbc9, {
  name: "SET 1,(iy+dd),c",
  bytes: "fd cb c9",
  doc: "ld c, (set 1, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:202, x:3, y:1, z:2, p:0, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbca, {
  name: "SET 1,(iy+dd),d",
  bytes: "fd cb ca",
  doc: "ld d, (set 1, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:203, x:3, y:1, z:3, p:0, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbcb, {
  name: "SET 1,(iy+dd),e",
  bytes: "fd cb cb",
  doc: "ld e, (set 1, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:204, x:3, y:1, z:4, p:0, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbcc, {
  name: "SET 1,(iy+dd),h",
  bytes: "fd cb cc",
  doc: "ld h, (set 1, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:205, x:3, y:1, z:5, p:0, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbcd, {
  name: "SET 1,(iy+dd),l",
  bytes: "fd cb cd",
  doc: "ld l, (set 1, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:206, x:3, y:1, z:6, p:0, q:1}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcbce, {
  name: "SET 1,(iy+dd),(iy+dd)",
  bytes: "fd cb ce",
  doc: "ld (iy+dd), (set 1, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:207, x:3, y:1, z:7, p:0, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbcf, {
  name: "SET 1,(iy+dd),a",
  bytes: "fd cb cf",
  doc: "ld a, (set 1, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(1, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:208, x:3, y:2, z:0, p:1, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbd0, {
  name: "SET 2,(iy+dd),b",
  bytes: "fd cb d0",
  doc: "ld b, (set 2, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:209, x:3, y:2, z:1, p:1, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbd1, {
  name: "SET 2,(iy+dd),c",
  bytes: "fd cb d1",
  doc: "ld c, (set 2, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:210, x:3, y:2, z:2, p:1, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbd2, {
  name: "SET 2,(iy+dd),d",
  bytes: "fd cb d2",
  doc: "ld d, (set 2, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:211, x:3, y:2, z:3, p:1, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbd3, {
  name: "SET 2,(iy+dd),e",
  bytes: "fd cb d3",
  doc: "ld e, (set 2, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:212, x:3, y:2, z:4, p:1, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbd4, {
  name: "SET 2,(iy+dd),h",
  bytes: "fd cb d4",
  doc: "ld h, (set 2, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:213, x:3, y:2, z:5, p:1, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbd5, {
  name: "SET 2,(iy+dd),l",
  bytes: "fd cb d5",
  doc: "ld l, (set 2, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:214, x:3, y:2, z:6, p:1, q:0}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcbd6, {
  name: "SET 2,(iy+dd),(iy+dd)",
  bytes: "fd cb d6",
  doc: "ld (iy+dd), (set 2, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:215, x:3, y:2, z:7, p:1, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbd7, {
  name: "SET 2,(iy+dd),a",
  bytes: "fd cb d7",
  doc: "ld a, (set 2, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(2, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:216, x:3, y:3, z:0, p:1, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbd8, {
  name: "SET 3,(iy+dd),b",
  bytes: "fd cb d8",
  doc: "ld b, (set 3, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:217, x:3, y:3, z:1, p:1, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbd9, {
  name: "SET 3,(iy+dd),c",
  bytes: "fd cb d9",
  doc: "ld c, (set 3, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:218, x:3, y:3, z:2, p:1, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbda, {
  name: "SET 3,(iy+dd),d",
  bytes: "fd cb da",
  doc: "ld d, (set 3, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:219, x:3, y:3, z:3, p:1, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbdb, {
  name: "SET 3,(iy+dd),e",
  bytes: "fd cb db",
  doc: "ld e, (set 3, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:220, x:3, y:3, z:4, p:1, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbdc, {
  name: "SET 3,(iy+dd),h",
  bytes: "fd cb dc",
  doc: "ld h, (set 3, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:221, x:3, y:3, z:5, p:1, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbdd, {
  name: "SET 3,(iy+dd),l",
  bytes: "fd cb dd",
  doc: "ld l, (set 3, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:222, x:3, y:3, z:6, p:1, q:1}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcbde, {
  name: "SET 3,(iy+dd),(iy+dd)",
  bytes: "fd cb de",
  doc: "ld (iy+dd), (set 3, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:223, x:3, y:3, z:7, p:1, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbdf, {
  name: "SET 3,(iy+dd),a",
  bytes: "fd cb df",
  doc: "ld a, (set 3, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(3, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:224, x:3, y:4, z:0, p:2, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbe0, {
  name: "SET 4,(iy+dd),b",
  bytes: "fd cb e0",
  doc: "ld b, (set 4, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:225, x:3, y:4, z:1, p:2, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbe1, {
  name: "SET 4,(iy+dd),c",
  bytes: "fd cb e1",
  doc: "ld c, (set 4, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:226, x:3, y:4, z:2, p:2, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbe2, {
  name: "SET 4,(iy+dd),d",
  bytes: "fd cb e2",
  doc: "ld d, (set 4, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:227, x:3, y:4, z:3, p:2, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbe3, {
  name: "SET 4,(iy+dd),e",
  bytes: "fd cb e3",
  doc: "ld e, (set 4, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:228, x:3, y:4, z:4, p:2, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbe4, {
  name: "SET 4,(iy+dd),h",
  bytes: "fd cb e4",
  doc: "ld h, (set 4, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:229, x:3, y:4, z:5, p:2, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbe5, {
  name: "SET 4,(iy+dd),l",
  bytes: "fd cb e5",
  doc: "ld l, (set 4, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:230, x:3, y:4, z:6, p:2, q:0}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcbe6, {
  name: "SET 4,(iy+dd),(iy+dd)",
  bytes: "fd cb e6",
  doc: "ld (iy+dd), (set 4, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:231, x:3, y:4, z:7, p:2, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbe7, {
  name: "SET 4,(iy+dd),a",
  bytes: "fd cb e7",
  doc: "ld a, (set 4, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(4, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:232, x:3, y:5, z:0, p:2, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbe8, {
  name: "SET 5,(iy+dd),b",
  bytes: "fd cb e8",
  doc: "ld b, (set 5, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:233, x:3, y:5, z:1, p:2, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbe9, {
  name: "SET 5,(iy+dd),c",
  bytes: "fd cb e9",
  doc: "ld c, (set 5, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:234, x:3, y:5, z:2, p:2, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbea, {
  name: "SET 5,(iy+dd),d",
  bytes: "fd cb ea",
  doc: "ld d, (set 5, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:235, x:3, y:5, z:3, p:2, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbeb, {
  name: "SET 5,(iy+dd),e",
  bytes: "fd cb eb",
  doc: "ld e, (set 5, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:236, x:3, y:5, z:4, p:2, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbec, {
  name: "SET 5,(iy+dd),h",
  bytes: "fd cb ec",
  doc: "ld h, (set 5, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:237, x:3, y:5, z:5, p:2, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbed, {
  name: "SET 5,(iy+dd),l",
  bytes: "fd cb ed",
  doc: "ld l, (set 5, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:238, x:3, y:5, z:6, p:2, q:1}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcbee, {
  name: "SET 5,(iy+dd),(iy+dd)",
  bytes: "fd cb ee",
  doc: "ld (iy+dd), (set 5, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:239, x:3, y:5, z:7, p:2, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbef, {
  name: "SET 5,(iy+dd),a",
  bytes: "fd cb ef",
  doc: "ld a, (set 5, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(5, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:240, x:3, y:6, z:0, p:3, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbf0, {
  name: "SET 6,(iy+dd),b",
  bytes: "fd cb f0",
  doc: "ld b, (set 6, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:241, x:3, y:6, z:1, p:3, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbf1, {
  name: "SET 6,(iy+dd),c",
  bytes: "fd cb f1",
  doc: "ld c, (set 6, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:242, x:3, y:6, z:2, p:3, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbf2, {
  name: "SET 6,(iy+dd),d",
  bytes: "fd cb f2",
  doc: "ld d, (set 6, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:243, x:3, y:6, z:3, p:3, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbf3, {
  name: "SET 6,(iy+dd),e",
  bytes: "fd cb f3",
  doc: "ld e, (set 6, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:244, x:3, y:6, z:4, p:3, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbf4, {
  name: "SET 6,(iy+dd),h",
  bytes: "fd cb f4",
  doc: "ld h, (set 6, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:245, x:3, y:6, z:5, p:3, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbf5, {
  name: "SET 6,(iy+dd),l",
  bytes: "fd cb f5",
  doc: "ld l, (set 6, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:246, x:3, y:6, z:6, p:3, q:0}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcbf6, {
  name: "SET 6,(iy+dd),(iy+dd)",
  bytes: "fd cb f6",
  doc: "ld (iy+dd), (set 6, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:247, x:3, y:6, z:7, p:3, q:0}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbf7, {
  name: "SET 6,(iy+dd),a",
  bytes: "fd cb f7",
  doc: "ld a, (set 6, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(6, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:248, x:3, y:7, z:0, p:3, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbf8, {
  name: "SET 7,(iy+dd),b",
  bytes: "fd cb f8",
  doc: "ld b, (set 7, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.b = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.b;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:249, x:3, y:7, z:1, p:3, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbf9, {
  name: "SET 7,(iy+dd),c",
  bytes: "fd cb f9",
  doc: "ld c, (set 7, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.c = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.c;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:250, x:3, y:7, z:2, p:3, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbfa, {
  name: "SET 7,(iy+dd),d",
  bytes: "fd cb fa",
  doc: "ld d, (set 7, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.d = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.d;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:251, x:3, y:7, z:3, p:3, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbfb, {
  name: "SET 7,(iy+dd),e",
  bytes: "fd cb fb",
  doc: "ld e, (set 7, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.e = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.e;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:252, x:3, y:7, z:4, p:3, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbfc, {
  name: "SET 7,(iy+dd),h",
  bytes: "fd cb fc",
  doc: "ld h, (set 7, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.h = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.h;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:253, x:3, y:7, z:5, p:3, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbfd, {
  name: "SET 7,(iy+dd),l",
  bytes: "fd cb fd",
  doc: "ld l, (set 7, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.l = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.l;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:254, x:3, y:7, z:6, p:3, q:1}
// SET $NY, ($RI+dd), ($RI+dd)
opcodes.set(0xfdcbfe, {
  name: "SET 7,(iy+dd),(iy+dd)",
  bytes: "fd cb fe",
  doc: "ld (iy+dd), (set 7, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$DLATCH=z80.alu.set($NY, $DLATCH)"}
    z80.dbus = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});

// {n:255, x:3, y:7, z:7, p:3, q:1}
// SET $NY, ($RI+dd), $RRZ
opcodes.set(0xfdcbff, {
  name: "SET 7,(iy+dd),a",
  bytes: "fd cb ff",
  doc: "ld a, (set 7, (iy+dd))",
  group: "Set",
  fn: (z80) => {
    // mread: {tcycles: 4, ab: $WZ, dst: $DLATCH}
    z80.abus = z80.regs.wz;
    z80.dbus = z80.readByte(z80.abus);
    z80.incTStateCount(1);
    // overlapped: {action: "$RRZ=z80.alu.set($NY, $DLATCH)"}
    z80.regs.a = z80.alu.set(7, z80.dbus);
    // mwrite: {ab: $WZ, db: $RRZ}
    z80.dbus = z80.regs.a;
    z80.abus = z80.regs.wz;
    z80.writeByte(z80.abus, z80.dbus);
  },
});
