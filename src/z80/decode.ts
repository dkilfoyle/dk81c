/* eslint-disable no-self-assign */
// Generated decoder
import type { Z80 } from "./z80";

interface IOpCodeDefinition {
  name: string;
  template: string;
  bytes: string;
  group: string;
  doc?: string;
  flags?: string;
  states?: number[];
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
  template: "NOP",
  bytes: "00",
  group: "CPU Control",
  doc: "No op",
  states: [4],
  fn: (z80) => {},
});

// {n:1, x:0, y:0, z:1, p:0, q:0}
// LD $RP,$nn
opcodes.set(0x01, {
  name: "LD BC,$NN",
  template: "LD $RP,$nn",
  bytes: "01 $2l $2h",
  group: "Load 16bit",
  doc: "Load bc:=nn",
  states: [10],
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
  template: "LD (BC),A",
  bytes: "02",
  group: "Load 8bit",
  doc: "Load indirect [BC]:=A",
  states: [7],
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
  name: "INC BC",
  template: "INC $RP",
  bytes: "03",
  group: "ALU 16bit",
  doc: "16bit Increment bc+=1",
  states: [6],
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.inc16($RP)"}
    z80.incTStateCount(2);
    z80.regs.bc = z80.alu.inc16(z80.regs.bc);
  },
});

// {n:4, x:0, y:0, z:4, p:0, q:0}
// INC $RY
opcodes.set(0x04, {
  name: "INC B",
  template: "INC $RY",
  bytes: "04",
  group: "ALU 8bit",
  doc: "Increment b+=1",
  flags: "***V0-",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.b = z80.alu.inc8(z80.regs.b);
  },
});

// {n:5, x:0, y:0, z:5, p:0, q:0}
// DEC $RY
opcodes.set(0x05, {
  name: "DEC B",
  template: "DEC $RY",
  bytes: "05",
  group: "ALU 8bit",
  doc: "Decrement b-=1",
  flags: "***V0-",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.b = z80.alu.dec8(z80.regs.b);
  },
});

// {n:6, x:0, y:0, z:6, p:0, q:0}
// LD $RY,$n
opcodes.set(0x06, {
  name: "LD B,$N",
  template: "LD $RY,$n",
  bytes: "06 $2",
  group: "Load 8bit",
  doc: "Load immediate b:=n",
  states: [7],
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
  template: "RLCA",
  bytes: "07",
  group: "ALU Rotate/Shift",
  doc: "Rotate A left with bit 7 copied to Carry",
  flags: "--0-0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.rlca()"}
    z80.alu.rlca();
  },
});

// {n:8, x:0, y:1, z:0, p:0, q:1}
// EX AF,AFP
opcodes.set(0x08, {
  name: "EX AF,AFP",
  template: "EX AF,AFP",
  bytes: "08",
  group: "Transfer",
  doc: "AF <-> AF'",
  flags: "******",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "z80.ex_af_af2()"}
    z80.ex_af_af2();
  },
});

// {n:9, x:0, y:1, z:1, p:0, q:1}
// ADD HL,$RP
opcodes.set(0x09, {
  name: "ADD HL,BC",
  template: "ADD HL,$RP",
  bytes: "09",
  group: "ALU 16bit",
  doc: "Add16: HL+=bc",
  flags: "***V0*",
  states: [15],
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
  template: "LD A,(BC)",
  bytes: "0a",
  group: "Load 8bit",
  doc: "Load indirect A:=[BC]",
  states: [7],
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
  name: "DEC BC",
  template: "DEC $RP",
  bytes: "0b",
  group: "ALU 16bit",
  doc: "16bit Decrement bc-=1",
  states: [6],
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.dec16($RP)"}
    z80.incTStateCount(2);
    z80.regs.bc = z80.alu.dec16(z80.regs.bc);
  },
});

// {n:12, x:0, y:1, z:4, p:0, q:1}
// INC $RY
opcodes.set(0x0c, {
  name: "INC C",
  template: "INC $RY",
  bytes: "0c",
  group: "ALU 8bit",
  doc: "Increment c+=1",
  flags: "***V0-",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.c = z80.alu.inc8(z80.regs.c);
  },
});

// {n:13, x:0, y:1, z:5, p:0, q:1}
// DEC $RY
opcodes.set(0x0d, {
  name: "DEC C",
  template: "DEC $RY",
  bytes: "0d",
  group: "ALU 8bit",
  doc: "Decrement c-=1",
  flags: "***V0-",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.c = z80.alu.dec8(z80.regs.c);
  },
});

// {n:14, x:0, y:1, z:6, p:0, q:1}
// LD $RY,$n
opcodes.set(0x0e, {
  name: "LD C,$N",
  template: "LD $RY,$n",
  bytes: "0e $2",
  group: "Load 8bit",
  doc: "Load immediate c:=n",
  states: [7],
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
  template: "RRCA",
  bytes: "0f",
  group: "ALU Rotate/Shift",
  doc: "Rotate A right with bit 0 copied to Carry",
  flags: "--0-0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.rrca()"}
    z80.alu.rrca();
  },
});

// {n:16, x:0, y:2, z:0, p:1, q:0}
// DJNZ $e
opcodes.set(0x10, {
  name: "DJNZ $E",
  template: "DJNZ $e",
  bytes: "10 $1s",
  group: "Control flow",
  doc: "Delta jump if not zero: PC+=$e if B-- != 0",
  states: [13, 8],
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
  name: "LD DE,$NN",
  template: "LD $RP,$nn",
  bytes: "11 $2l $2h",
  group: "Load 16bit",
  doc: "Load de:=nn",
  states: [10],
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
  template: "LD (DE),A",
  bytes: "12",
  group: "Load 8bit",
  doc: "Load indirect [DE]:=A",
  states: [7],
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
  name: "INC DE",
  template: "INC $RP",
  bytes: "13",
  group: "ALU 16bit",
  doc: "16bit Increment de+=1",
  states: [6],
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.inc16($RP)"}
    z80.incTStateCount(2);
    z80.regs.de = z80.alu.inc16(z80.regs.de);
  },
});

// {n:20, x:0, y:2, z:4, p:1, q:0}
// INC $RY
opcodes.set(0x14, {
  name: "INC D",
  template: "INC $RY",
  bytes: "14",
  group: "ALU 8bit",
  doc: "Increment d+=1",
  flags: "***V0-",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.d = z80.alu.inc8(z80.regs.d);
  },
});

// {n:21, x:0, y:2, z:5, p:1, q:0}
// DEC $RY
opcodes.set(0x15, {
  name: "DEC D",
  template: "DEC $RY",
  bytes: "15",
  group: "ALU 8bit",
  doc: "Decrement d-=1",
  flags: "***V0-",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.d = z80.alu.dec8(z80.regs.d);
  },
});

// {n:22, x:0, y:2, z:6, p:1, q:0}
// LD $RY,$n
opcodes.set(0x16, {
  name: "LD D,$N",
  template: "LD $RY,$n",
  bytes: "16 $2",
  group: "Load 8bit",
  doc: "Load immediate d:=n",
  states: [7],
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
  template: "RLA",
  bytes: "17",
  group: "ALU Rotate/Shift",
  doc: "Rotate A left through carry",
  flags: "--0-0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.rla()"}
    z80.alu.rla();
  },
});

// {n:24, x:0, y:3, z:0, p:1, q:1}
// JR $e
opcodes.set(0x18, {
  name: "JR $E",
  template: "JR $e",
  bytes: "18 $1s",
  group: "Control flow",
  doc: "Jump relative: PC+=$e",
  states: [122],
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
  name: "ADD HL,DE",
  template: "ADD HL,$RP",
  bytes: "19",
  group: "ALU 16bit",
  doc: "Add16: HL+=de",
  flags: "***V0*",
  states: [15],
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
  template: "LD A,(DE)",
  bytes: "1a",
  group: "Load 8bit",
  doc: "Load indirect A:=[DE]",
  states: [7],
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
  name: "DEC DE",
  template: "DEC $RP",
  bytes: "1b",
  group: "ALU 16bit",
  doc: "16bit Decrement de-=1",
  states: [6],
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.dec16($RP)"}
    z80.incTStateCount(2);
    z80.regs.de = z80.alu.dec16(z80.regs.de);
  },
});

// {n:28, x:0, y:3, z:4, p:1, q:1}
// INC $RY
opcodes.set(0x1c, {
  name: "INC E",
  template: "INC $RY",
  bytes: "1c",
  group: "ALU 8bit",
  doc: "Increment e+=1",
  flags: "***V0-",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.e = z80.alu.inc8(z80.regs.e);
  },
});

// {n:29, x:0, y:3, z:5, p:1, q:1}
// DEC $RY
opcodes.set(0x1d, {
  name: "DEC E",
  template: "DEC $RY",
  bytes: "1d",
  group: "ALU 8bit",
  doc: "Decrement e-=1",
  flags: "***V0-",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.e = z80.alu.dec8(z80.regs.e);
  },
});

// {n:30, x:0, y:3, z:6, p:1, q:1}
// LD $RY,$n
opcodes.set(0x1e, {
  name: "LD E,$N",
  template: "LD $RY,$n",
  bytes: "1e $2",
  group: "Load 8bit",
  doc: "Load immediate e:=n",
  states: [7],
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
  template: "RRA",
  bytes: "1f",
  group: "ALU Rotate/Shift",
  doc: "Rotate A right through carry",
  flags: "--0-0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.rra()"}
    z80.alu.rra();
  },
});

// {n:32, x:0, y:4, z:0, p:2, q:0}
// JR $CC-4,$e
opcodes.set(0x20, {
  name: "JR NZ,$E",
  template: "JR $CC-4,$e",
  bytes: "20 $2s",
  group: "Control flow",
  doc: "Jump relative conditional: if NZ then PC+=$e",
  states: [12, 7],
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
  name: "LD HL,$NN",
  template: "LD $RP,$nn",
  bytes: "21 $2l $2h",
  group: "Load 16bit",
  doc: "Load hl:=nn",
  states: [10],
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
  name: "LD ($NN),HL",
  template: "LD ($nn),HL",
  bytes: "22 $1l $1h",
  group: "Load 16bit",
  doc: "Load indirect [nn]:=L, [nn+1]:=H",
  states: [16],
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
  name: "INC HL",
  template: "INC $RP",
  bytes: "23",
  group: "ALU 16bit",
  doc: "16bit Increment hl+=1",
  states: [6],
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.inc16($RP)"}
    z80.incTStateCount(2);
    z80.regs.hl = z80.alu.inc16(z80.regs.hl);
  },
});

// {n:36, x:0, y:4, z:4, p:2, q:0}
// INC $RY
opcodes.set(0x24, {
  name: "INC H",
  template: "INC $RY",
  bytes: "24",
  group: "ALU 8bit",
  doc: "Increment h+=1",
  flags: "***V0-",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.h = z80.alu.inc8(z80.regs.h);
  },
});

// {n:37, x:0, y:4, z:5, p:2, q:0}
// DEC $RY
opcodes.set(0x25, {
  name: "DEC H",
  template: "DEC $RY",
  bytes: "25",
  group: "ALU 8bit",
  doc: "Decrement h-=1",
  flags: "***V0-",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.h = z80.alu.dec8(z80.regs.h);
  },
});

// {n:38, x:0, y:4, z:6, p:2, q:0}
// LD $RY,$n
opcodes.set(0x26, {
  name: "LD H,$N",
  template: "LD $RY,$n",
  bytes: "26 $2",
  group: "Load 8bit",
  doc: "Load immediate h:=n",
  states: [7],
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
  template: "DAA",
  bytes: "27",
  group: "ALU General",
  doc: "Convert A to BCD",
  flags: "***P-*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.daa()"}
    z80.alu.daa();
  },
});

// {n:40, x:0, y:5, z:0, p:2, q:1}
// JR $CC-4,$e
opcodes.set(0x28, {
  name: "JR Z,$E",
  template: "JR $CC-4,$e",
  bytes: "28 $2s",
  group: "Control flow",
  doc: "Jump relative conditional: if Z then PC+=$e",
  states: [12, 7],
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
  name: "ADD HL,HL",
  template: "ADD HL,$RP",
  bytes: "29",
  group: "ALU 16bit",
  doc: "Add16: HL+=hl",
  flags: "***V0*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$HL=z80.alu.add16($HL, $RP)"}
    z80.incTStateCount(7);
    z80.regs.hl = z80.alu.add16(z80.regs.hl, z80.regs.hl);
  },
});

// {n:42, x:0, y:5, z:2, p:2, q:1}
// LD HL,($nn)
opcodes.set(0x2a, {
  name: "LD HL,($NN)",
  template: "LD HL,($nn)",
  bytes: "2a $2l $2h",
  group: "Load 16bit",
  doc: "Load indirect L:=[nn],H:=[nn+1]",
  states: [16],
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
  name: "DEC HL",
  template: "DEC $RP",
  bytes: "2b",
  group: "ALU 16bit",
  doc: "16bit Decrement hl-=1",
  states: [6],
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.dec16($RP)"}
    z80.incTStateCount(2);
    z80.regs.hl = z80.alu.dec16(z80.regs.hl);
  },
});

// {n:44, x:0, y:5, z:4, p:2, q:1}
// INC $RY
opcodes.set(0x2c, {
  name: "INC L",
  template: "INC $RY",
  bytes: "2c",
  group: "ALU 8bit",
  doc: "Increment l+=1",
  flags: "***V0-",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.l = z80.alu.inc8(z80.regs.l);
  },
});

// {n:45, x:0, y:5, z:5, p:2, q:1}
// DEC $RY
opcodes.set(0x2d, {
  name: "DEC L",
  template: "DEC $RY",
  bytes: "2d",
  group: "ALU 8bit",
  doc: "Decrement l-=1",
  flags: "***V0-",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.l = z80.alu.dec8(z80.regs.l);
  },
});

// {n:46, x:0, y:5, z:6, p:2, q:1}
// LD $RY,$n
opcodes.set(0x2e, {
  name: "LD L,$N",
  template: "LD $RY,$n",
  bytes: "2e $2",
  group: "Load 8bit",
  doc: "Load immediate l:=n",
  states: [7],
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
  template: "CPL",
  bytes: "2f",
  group: "ALU General",
  doc: "Invert all bits of A (one's complement)",
  flags: "--1-1-",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.cpl()"}
    z80.alu.cpl();
  },
});

// {n:48, x:0, y:6, z:0, p:3, q:0}
// JR $CC-4,$e
opcodes.set(0x30, {
  name: "JR NC,$E",
  template: "JR $CC-4,$e",
  bytes: "30 $2s",
  group: "Control flow",
  doc: "Jump relative conditional: if NC then PC+=$e",
  states: [12, 7],
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
  name: "LD SP,$NN",
  template: "LD $RP,$nn",
  bytes: "31 $2l $2h",
  group: "Load 16bit",
  doc: "Load sp:=nn",
  states: [10],
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
  name: "LD ($NN),A",
  template: "LD ($nn),A",
  bytes: "32 $1l $1h",
  group: "Load 16bit",
  doc: "Load indirect [nn]:=A",
  states: [13],
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
  name: "INC SP",
  template: "INC $RP",
  bytes: "33",
  group: "ALU 16bit",
  doc: "16bit Increment sp+=1",
  states: [6],
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
  template: "INC (HL)",
  bytes: "34",
  group: "ALU 8bit",
  doc: "Increment indirect [HL]-=1",
  flags: "***V0-",
  states: [11],
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
  template: "DEC (HL)",
  bytes: "35",
  group: "ALU 8bit",
  doc: "Decrement indirect [HL]-=1",
  flags: "***V0-",
  states: [11],
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
  name: "LD (HL),$N",
  template: "LD (HL),$n",
  bytes: "36 $2",
  group: "Load 8bit",
  doc: "Load indirect immediate [HL]:=n",
  states: [10],
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
  template: "SCF",
  bytes: "37",
  group: "ALU General",
  doc: "Set Carry Flag: CY=1",
  flags: "--0-01",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.scf()"}
    z80.alu.scf();
  },
});

// {n:56, x:0, y:7, z:0, p:3, q:1}
// JR $CC-4,$e
opcodes.set(0x38, {
  name: "JR C,$E",
  template: "JR $CC-4,$e",
  bytes: "38 $2s",
  group: "Control flow",
  doc: "Jump relative conditional: if C then PC+=$e",
  states: [12, 7],
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
  name: "ADD HL,SP",
  template: "ADD HL,$RP",
  bytes: "39",
  group: "ALU 16bit",
  doc: "Add16: HL+=sp",
  flags: "***V0*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$HL=z80.alu.add16($HL, $RP)"}
    z80.incTStateCount(7);
    z80.regs.hl = z80.alu.add16(z80.regs.hl, z80.regs.sp);
  },
});

// {n:58, x:0, y:7, z:2, p:3, q:1}
// LD A,($nn)
opcodes.set(0x3a, {
  name: "LD A,($NN)",
  template: "LD A,($nn)",
  bytes: "3a $2l $2h",
  group: "Load 8bit",
  doc: "Load indirect A:=[nn]",
  states: [13],
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
  name: "DEC SP",
  template: "DEC $RP",
  bytes: "3b",
  group: "ALU 16bit",
  doc: "16bit Decrement sp-=1",
  states: [6],
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.dec16($RP)"}
    z80.incTStateCount(2);
    z80.regs.sp = z80.alu.dec16(z80.regs.sp);
  },
});

// {n:60, x:0, y:7, z:4, p:3, q:1}
// INC $RY
opcodes.set(0x3c, {
  name: "INC A",
  template: "INC $RY",
  bytes: "3c",
  group: "ALU 8bit",
  doc: "Increment a+=1",
  flags: "***V0-",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.a = z80.alu.inc8(z80.regs.a);
  },
});

// {n:61, x:0, y:7, z:5, p:3, q:1}
// DEC $RY
opcodes.set(0x3d, {
  name: "DEC A",
  template: "DEC $RY",
  bytes: "3d",
  group: "ALU 8bit",
  doc: "Decrement a-=1",
  flags: "***V0-",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.a = z80.alu.dec8(z80.regs.a);
  },
});

// {n:62, x:0, y:7, z:6, p:3, q:1}
// LD $RY,$n
opcodes.set(0x3e, {
  name: "LD A,$N",
  template: "LD $RY,$n",
  bytes: "3e $2",
  group: "Load 8bit",
  doc: "Load immediate a:=n",
  states: [7],
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
  template: "CCF",
  bytes: "3f",
  group: "ALU General",
  doc: "Complement Carry Flag",
  flags: "--*-0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.ccf()"}
    z80.alu.ccf();
  },
});

// {n:64, x:1, y:0, z:0, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0x40, {
  name: "LD B,B",
  template: "LD $RY,$RZ",
  bytes: "40",
  group: "Load 8bit",
  doc: "Load b:=b",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.b;
  },
});

// {n:65, x:1, y:0, z:1, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0x41, {
  name: "LD B,C",
  template: "LD $RY,$RZ",
  bytes: "41",
  group: "Load 8bit",
  doc: "Load b:=c",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.c;
  },
});

// {n:66, x:1, y:0, z:2, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0x42, {
  name: "LD B,D",
  template: "LD $RY,$RZ",
  bytes: "42",
  group: "Load 8bit",
  doc: "Load b:=d",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.d;
  },
});

// {n:67, x:1, y:0, z:3, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0x43, {
  name: "LD B,E",
  template: "LD $RY,$RZ",
  bytes: "43",
  group: "Load 8bit",
  doc: "Load b:=e",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.e;
  },
});

// {n:68, x:1, y:0, z:4, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0x44, {
  name: "LD B,H",
  template: "LD $RY,$RZ",
  bytes: "44",
  group: "Load 8bit",
  doc: "Load b:=h",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.h;
  },
});

// {n:69, x:1, y:0, z:5, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0x45, {
  name: "LD B,L",
  template: "LD $RY,$RZ",
  bytes: "45",
  group: "Load 8bit",
  doc: "Load b:=l",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.l;
  },
});

// {n:70, x:1, y:0, z:6, p:0, q:0}
// LD $RY,(HL)
opcodes.set(0x46, {
  name: "LD B,(HL)",
  template: "LD $RY,(HL)",
  bytes: "46",
  group: "Load 8bit",
  doc: "Load b:=(HL)",
  states: [7],
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
  name: "LD B,A",
  template: "LD $RY,$RZ",
  bytes: "47",
  group: "Load 8bit",
  doc: "Load b:=a",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.a;
  },
});

// {n:72, x:1, y:1, z:0, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0x48, {
  name: "LD C,B",
  template: "LD $RY,$RZ",
  bytes: "48",
  group: "Load 8bit",
  doc: "Load c:=b",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.b;
  },
});

// {n:73, x:1, y:1, z:1, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0x49, {
  name: "LD C,C",
  template: "LD $RY,$RZ",
  bytes: "49",
  group: "Load 8bit",
  doc: "Load c:=c",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.c;
  },
});

// {n:74, x:1, y:1, z:2, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0x4a, {
  name: "LD C,D",
  template: "LD $RY,$RZ",
  bytes: "4a",
  group: "Load 8bit",
  doc: "Load c:=d",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.d;
  },
});

// {n:75, x:1, y:1, z:3, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0x4b, {
  name: "LD C,E",
  template: "LD $RY,$RZ",
  bytes: "4b",
  group: "Load 8bit",
  doc: "Load c:=e",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.e;
  },
});

// {n:76, x:1, y:1, z:4, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0x4c, {
  name: "LD C,H",
  template: "LD $RY,$RZ",
  bytes: "4c",
  group: "Load 8bit",
  doc: "Load c:=h",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.h;
  },
});

// {n:77, x:1, y:1, z:5, p:0, q:1}
// LD $RY,$RZ
opcodes.set(0x4d, {
  name: "LD C,L",
  template: "LD $RY,$RZ",
  bytes: "4d",
  group: "Load 8bit",
  doc: "Load c:=l",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.l;
  },
});

// {n:78, x:1, y:1, z:6, p:0, q:1}
// LD $RY,(HL)
opcodes.set(0x4e, {
  name: "LD C,(HL)",
  template: "LD $RY,(HL)",
  bytes: "4e",
  group: "Load 8bit",
  doc: "Load c:=(HL)",
  states: [7],
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
  name: "LD C,A",
  template: "LD $RY,$RZ",
  bytes: "4f",
  group: "Load 8bit",
  doc: "Load c:=a",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.a;
  },
});

// {n:80, x:1, y:2, z:0, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0x50, {
  name: "LD D,B",
  template: "LD $RY,$RZ",
  bytes: "50",
  group: "Load 8bit",
  doc: "Load d:=b",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.b;
  },
});

// {n:81, x:1, y:2, z:1, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0x51, {
  name: "LD D,C",
  template: "LD $RY,$RZ",
  bytes: "51",
  group: "Load 8bit",
  doc: "Load d:=c",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.c;
  },
});

// {n:82, x:1, y:2, z:2, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0x52, {
  name: "LD D,D",
  template: "LD $RY,$RZ",
  bytes: "52",
  group: "Load 8bit",
  doc: "Load d:=d",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.d;
  },
});

// {n:83, x:1, y:2, z:3, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0x53, {
  name: "LD D,E",
  template: "LD $RY,$RZ",
  bytes: "53",
  group: "Load 8bit",
  doc: "Load d:=e",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.e;
  },
});

// {n:84, x:1, y:2, z:4, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0x54, {
  name: "LD D,H",
  template: "LD $RY,$RZ",
  bytes: "54",
  group: "Load 8bit",
  doc: "Load d:=h",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.h;
  },
});

// {n:85, x:1, y:2, z:5, p:1, q:0}
// LD $RY,$RZ
opcodes.set(0x55, {
  name: "LD D,L",
  template: "LD $RY,$RZ",
  bytes: "55",
  group: "Load 8bit",
  doc: "Load d:=l",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.l;
  },
});

// {n:86, x:1, y:2, z:6, p:1, q:0}
// LD $RY,(HL)
opcodes.set(0x56, {
  name: "LD D,(HL)",
  template: "LD $RY,(HL)",
  bytes: "56",
  group: "Load 8bit",
  doc: "Load d:=(HL)",
  states: [7],
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
  name: "LD D,A",
  template: "LD $RY,$RZ",
  bytes: "57",
  group: "Load 8bit",
  doc: "Load d:=a",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.a;
  },
});

// {n:88, x:1, y:3, z:0, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0x58, {
  name: "LD E,B",
  template: "LD $RY,$RZ",
  bytes: "58",
  group: "Load 8bit",
  doc: "Load e:=b",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.b;
  },
});

// {n:89, x:1, y:3, z:1, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0x59, {
  name: "LD E,C",
  template: "LD $RY,$RZ",
  bytes: "59",
  group: "Load 8bit",
  doc: "Load e:=c",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.c;
  },
});

// {n:90, x:1, y:3, z:2, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0x5a, {
  name: "LD E,D",
  template: "LD $RY,$RZ",
  bytes: "5a",
  group: "Load 8bit",
  doc: "Load e:=d",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.d;
  },
});

// {n:91, x:1, y:3, z:3, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0x5b, {
  name: "LD E,E",
  template: "LD $RY,$RZ",
  bytes: "5b",
  group: "Load 8bit",
  doc: "Load e:=e",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.e;
  },
});

// {n:92, x:1, y:3, z:4, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0x5c, {
  name: "LD E,H",
  template: "LD $RY,$RZ",
  bytes: "5c",
  group: "Load 8bit",
  doc: "Load e:=h",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.h;
  },
});

// {n:93, x:1, y:3, z:5, p:1, q:1}
// LD $RY,$RZ
opcodes.set(0x5d, {
  name: "LD E,L",
  template: "LD $RY,$RZ",
  bytes: "5d",
  group: "Load 8bit",
  doc: "Load e:=l",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.l;
  },
});

// {n:94, x:1, y:3, z:6, p:1, q:1}
// LD $RY,(HL)
opcodes.set(0x5e, {
  name: "LD E,(HL)",
  template: "LD $RY,(HL)",
  bytes: "5e",
  group: "Load 8bit",
  doc: "Load e:=(HL)",
  states: [7],
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
  name: "LD E,A",
  template: "LD $RY,$RZ",
  bytes: "5f",
  group: "Load 8bit",
  doc: "Load e:=a",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.a;
  },
});

// {n:96, x:1, y:4, z:0, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0x60, {
  name: "LD H,B",
  template: "LD $RY,$RZ",
  bytes: "60",
  group: "Load 8bit",
  doc: "Load h:=b",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.h = z80.regs.b;
  },
});

// {n:97, x:1, y:4, z:1, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0x61, {
  name: "LD H,C",
  template: "LD $RY,$RZ",
  bytes: "61",
  group: "Load 8bit",
  doc: "Load h:=c",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.h = z80.regs.c;
  },
});

// {n:98, x:1, y:4, z:2, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0x62, {
  name: "LD H,D",
  template: "LD $RY,$RZ",
  bytes: "62",
  group: "Load 8bit",
  doc: "Load h:=d",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.h = z80.regs.d;
  },
});

// {n:99, x:1, y:4, z:3, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0x63, {
  name: "LD H,E",
  template: "LD $RY,$RZ",
  bytes: "63",
  group: "Load 8bit",
  doc: "Load h:=e",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.h = z80.regs.e;
  },
});

// {n:100, x:1, y:4, z:4, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0x64, {
  name: "LD H,H",
  template: "LD $RY,$RZ",
  bytes: "64",
  group: "Load 8bit",
  doc: "Load h:=h",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.h = z80.regs.h;
  },
});

// {n:101, x:1, y:4, z:5, p:2, q:0}
// LD $RY,$RZ
opcodes.set(0x65, {
  name: "LD H,L",
  template: "LD $RY,$RZ",
  bytes: "65",
  group: "Load 8bit",
  doc: "Load h:=l",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.h = z80.regs.l;
  },
});

// {n:102, x:1, y:4, z:6, p:2, q:0}
// LD $RY,(HL)
opcodes.set(0x66, {
  name: "LD H,(HL)",
  template: "LD $RY,(HL)",
  bytes: "66",
  group: "Load 8bit",
  doc: "Load h:=(HL)",
  states: [7],
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
  name: "LD H,A",
  template: "LD $RY,$RZ",
  bytes: "67",
  group: "Load 8bit",
  doc: "Load h:=a",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.h = z80.regs.a;
  },
});

// {n:104, x:1, y:5, z:0, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0x68, {
  name: "LD L,B",
  template: "LD $RY,$RZ",
  bytes: "68",
  group: "Load 8bit",
  doc: "Load l:=b",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.l = z80.regs.b;
  },
});

// {n:105, x:1, y:5, z:1, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0x69, {
  name: "LD L,C",
  template: "LD $RY,$RZ",
  bytes: "69",
  group: "Load 8bit",
  doc: "Load l:=c",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.l = z80.regs.c;
  },
});

// {n:106, x:1, y:5, z:2, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0x6a, {
  name: "LD L,D",
  template: "LD $RY,$RZ",
  bytes: "6a",
  group: "Load 8bit",
  doc: "Load l:=d",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.l = z80.regs.d;
  },
});

// {n:107, x:1, y:5, z:3, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0x6b, {
  name: "LD L,E",
  template: "LD $RY,$RZ",
  bytes: "6b",
  group: "Load 8bit",
  doc: "Load l:=e",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.l = z80.regs.e;
  },
});

// {n:108, x:1, y:5, z:4, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0x6c, {
  name: "LD L,H",
  template: "LD $RY,$RZ",
  bytes: "6c",
  group: "Load 8bit",
  doc: "Load l:=h",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.l = z80.regs.h;
  },
});

// {n:109, x:1, y:5, z:5, p:2, q:1}
// LD $RY,$RZ
opcodes.set(0x6d, {
  name: "LD L,L",
  template: "LD $RY,$RZ",
  bytes: "6d",
  group: "Load 8bit",
  doc: "Load l:=l",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.l = z80.regs.l;
  },
});

// {n:110, x:1, y:5, z:6, p:2, q:1}
// LD $RY,(HL)
opcodes.set(0x6e, {
  name: "LD L,(HL)",
  template: "LD $RY,(HL)",
  bytes: "6e",
  group: "Load 8bit",
  doc: "Load l:=(HL)",
  states: [7],
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
  name: "LD L,A",
  template: "LD $RY,$RZ",
  bytes: "6f",
  group: "Load 8bit",
  doc: "Load l:=a",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.l = z80.regs.a;
  },
});

// {n:112, x:1, y:6, z:0, p:3, q:0}
// LD (HL),$RZ
opcodes.set(0x70, {
  name: "LD (HL),B",
  template: "LD (HL),$RZ",
  bytes: "70",
  group: "Load 8bit",
  doc: "Load [hl]:=b",
  states: [7],
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
  name: "LD (HL),C",
  template: "LD (HL),$RZ",
  bytes: "71",
  group: "Load 8bit",
  doc: "Load [hl]:=c",
  states: [7],
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
  name: "LD (HL),D",
  template: "LD (HL),$RZ",
  bytes: "72",
  group: "Load 8bit",
  doc: "Load [hl]:=d",
  states: [7],
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
  name: "LD (HL),E",
  template: "LD (HL),$RZ",
  bytes: "73",
  group: "Load 8bit",
  doc: "Load [hl]:=e",
  states: [7],
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
  name: "LD (HL),H",
  template: "LD (HL),$RZ",
  bytes: "74",
  group: "Load 8bit",
  doc: "Load [hl]:=h",
  states: [7],
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
  name: "LD (HL),L",
  template: "LD (HL),$RZ",
  bytes: "75",
  group: "Load 8bit",
  doc: "Load [hl]:=l",
  states: [7],
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
  template: "HALT",
  bytes: "76",
  group: "CPU Control",
  doc: "Repeat NOP until interrupt",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "z80.regs.halted=1;$PC--;"}
    z80.regs.halted = 1;
    z80.regs.pc--;
  },
});

// {n:119, x:1, y:6, z:7, p:3, q:0}
// LD (HL),$RZ
opcodes.set(0x77, {
  name: "LD (HL),A",
  template: "LD (HL),$RZ",
  bytes: "77",
  group: "Load 8bit",
  doc: "Load [hl]:=a",
  states: [7],
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
  name: "LD A,B",
  template: "LD $RY,$RZ",
  bytes: "78",
  group: "Load 8bit",
  doc: "Load a:=b",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.b;
  },
});

// {n:121, x:1, y:7, z:1, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0x79, {
  name: "LD A,C",
  template: "LD $RY,$RZ",
  bytes: "79",
  group: "Load 8bit",
  doc: "Load a:=c",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.c;
  },
});

// {n:122, x:1, y:7, z:2, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0x7a, {
  name: "LD A,D",
  template: "LD $RY,$RZ",
  bytes: "7a",
  group: "Load 8bit",
  doc: "Load a:=d",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.d;
  },
});

// {n:123, x:1, y:7, z:3, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0x7b, {
  name: "LD A,E",
  template: "LD $RY,$RZ",
  bytes: "7b",
  group: "Load 8bit",
  doc: "Load a:=e",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.e;
  },
});

// {n:124, x:1, y:7, z:4, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0x7c, {
  name: "LD A,H",
  template: "LD $RY,$RZ",
  bytes: "7c",
  group: "Load 8bit",
  doc: "Load a:=h",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.h;
  },
});

// {n:125, x:1, y:7, z:5, p:3, q:1}
// LD $RY,$RZ
opcodes.set(0x7d, {
  name: "LD A,L",
  template: "LD $RY,$RZ",
  bytes: "7d",
  group: "Load 8bit",
  doc: "Load a:=l",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.l;
  },
});

// {n:126, x:1, y:7, z:6, p:3, q:1}
// LD $RY,(HL)
opcodes.set(0x7e, {
  name: "LD A,(HL)",
  template: "LD $RY,(HL)",
  bytes: "7e",
  group: "Load 8bit",
  doc: "Load a:=(HL)",
  states: [7],
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
  name: "LD A,A",
  template: "LD $RY,$RZ",
  bytes: "7f",
  group: "Load 8bit",
  doc: "Load a:=a",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.a;
  },
});

// {n:128, x:2, y:0, z:0, p:0, q:0}
// $ALU $RZ
opcodes.set(0x80, {
  name: "ADD A,B",
  template: "$ALU $RZ",
  bytes: "80",
  group: "ALU 8bit",
  doc: "ALU: A:=A add b",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add(z80.regs.b);
  },
});

// {n:129, x:2, y:0, z:1, p:0, q:0}
// $ALU $RZ
opcodes.set(0x81, {
  name: "ADD A,C",
  template: "$ALU $RZ",
  bytes: "81",
  group: "ALU 8bit",
  doc: "ALU: A:=A add c",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add(z80.regs.c);
  },
});

// {n:130, x:2, y:0, z:2, p:0, q:0}
// $ALU $RZ
opcodes.set(0x82, {
  name: "ADD A,D",
  template: "$ALU $RZ",
  bytes: "82",
  group: "ALU 8bit",
  doc: "ALU: A:=A add d",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add(z80.regs.d);
  },
});

// {n:131, x:2, y:0, z:3, p:0, q:0}
// $ALU $RZ
opcodes.set(0x83, {
  name: "ADD A,E",
  template: "$ALU $RZ",
  bytes: "83",
  group: "ALU 8bit",
  doc: "ALU: A:=A add e",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add(z80.regs.e);
  },
});

// {n:132, x:2, y:0, z:4, p:0, q:0}
// $ALU $RZ
opcodes.set(0x84, {
  name: "ADD A,H",
  template: "$ALU $RZ",
  bytes: "84",
  group: "ALU 8bit",
  doc: "ALU: A:=A add h",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add(z80.regs.h);
  },
});

// {n:133, x:2, y:0, z:5, p:0, q:0}
// $ALU $RZ
opcodes.set(0x85, {
  name: "ADD A,L",
  template: "$ALU $RZ",
  bytes: "85",
  group: "ALU 8bit",
  doc: "ALU: A:=A add l",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add(z80.regs.l);
  },
});

// {n:134, x:2, y:0, z:6, p:0, q:0}
// $ALU (HL)
opcodes.set(0x86, {
  name: "ADD A,(HL)",
  template: "$ALU (HL)",
  bytes: "86",
  group: "ALU 8bit",
  doc: "ALU: A:=A add (HL)",
  flags: "***V0*",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.add(z80.dbus);
  },
});

// {n:135, x:2, y:0, z:7, p:0, q:0}
// $ALU $RZ
opcodes.set(0x87, {
  name: "ADD A,A",
  template: "$ALU $RZ",
  bytes: "87",
  group: "ALU 8bit",
  doc: "ALU: A:=A add a",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add(z80.regs.a);
  },
});

// {n:136, x:2, y:1, z:0, p:0, q:1}
// $ALU $RZ
opcodes.set(0x88, {
  name: "ADC A,B",
  template: "$ALU $RZ",
  bytes: "88",
  group: "ALU 8bit",
  doc: "ALU: A:=A adc b",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc(z80.regs.b);
  },
});

// {n:137, x:2, y:1, z:1, p:0, q:1}
// $ALU $RZ
opcodes.set(0x89, {
  name: "ADC A,C",
  template: "$ALU $RZ",
  bytes: "89",
  group: "ALU 8bit",
  doc: "ALU: A:=A adc c",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc(z80.regs.c);
  },
});

// {n:138, x:2, y:1, z:2, p:0, q:1}
// $ALU $RZ
opcodes.set(0x8a, {
  name: "ADC A,D",
  template: "$ALU $RZ",
  bytes: "8a",
  group: "ALU 8bit",
  doc: "ALU: A:=A adc d",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc(z80.regs.d);
  },
});

// {n:139, x:2, y:1, z:3, p:0, q:1}
// $ALU $RZ
opcodes.set(0x8b, {
  name: "ADC A,E",
  template: "$ALU $RZ",
  bytes: "8b",
  group: "ALU 8bit",
  doc: "ALU: A:=A adc e",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc(z80.regs.e);
  },
});

// {n:140, x:2, y:1, z:4, p:0, q:1}
// $ALU $RZ
opcodes.set(0x8c, {
  name: "ADC A,H",
  template: "$ALU $RZ",
  bytes: "8c",
  group: "ALU 8bit",
  doc: "ALU: A:=A adc h",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc(z80.regs.h);
  },
});

// {n:141, x:2, y:1, z:5, p:0, q:1}
// $ALU $RZ
opcodes.set(0x8d, {
  name: "ADC A,L",
  template: "$ALU $RZ",
  bytes: "8d",
  group: "ALU 8bit",
  doc: "ALU: A:=A adc l",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc(z80.regs.l);
  },
});

// {n:142, x:2, y:1, z:6, p:0, q:1}
// $ALU (HL)
opcodes.set(0x8e, {
  name: "ADC A,(HL)",
  template: "$ALU (HL)",
  bytes: "8e",
  group: "ALU 8bit",
  doc: "ALU: A:=A adc (HL)",
  flags: "***V0*",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.adc(z80.dbus);
  },
});

// {n:143, x:2, y:1, z:7, p:0, q:1}
// $ALU $RZ
opcodes.set(0x8f, {
  name: "ADC A,A",
  template: "$ALU $RZ",
  bytes: "8f",
  group: "ALU 8bit",
  doc: "ALU: A:=A adc a",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc(z80.regs.a);
  },
});

// {n:144, x:2, y:2, z:0, p:1, q:0}
// $ALU $RZ
opcodes.set(0x90, {
  name: "SUB B",
  template: "$ALU $RZ",
  bytes: "90",
  group: "ALU 8bit",
  doc: "ALU: A:=A sub b",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub(z80.regs.b);
  },
});

// {n:145, x:2, y:2, z:1, p:1, q:0}
// $ALU $RZ
opcodes.set(0x91, {
  name: "SUB C",
  template: "$ALU $RZ",
  bytes: "91",
  group: "ALU 8bit",
  doc: "ALU: A:=A sub c",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub(z80.regs.c);
  },
});

// {n:146, x:2, y:2, z:2, p:1, q:0}
// $ALU $RZ
opcodes.set(0x92, {
  name: "SUB D",
  template: "$ALU $RZ",
  bytes: "92",
  group: "ALU 8bit",
  doc: "ALU: A:=A sub d",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub(z80.regs.d);
  },
});

// {n:147, x:2, y:2, z:3, p:1, q:0}
// $ALU $RZ
opcodes.set(0x93, {
  name: "SUB E",
  template: "$ALU $RZ",
  bytes: "93",
  group: "ALU 8bit",
  doc: "ALU: A:=A sub e",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub(z80.regs.e);
  },
});

// {n:148, x:2, y:2, z:4, p:1, q:0}
// $ALU $RZ
opcodes.set(0x94, {
  name: "SUB H",
  template: "$ALU $RZ",
  bytes: "94",
  group: "ALU 8bit",
  doc: "ALU: A:=A sub h",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub(z80.regs.h);
  },
});

// {n:149, x:2, y:2, z:5, p:1, q:0}
// $ALU $RZ
opcodes.set(0x95, {
  name: "SUB L",
  template: "$ALU $RZ",
  bytes: "95",
  group: "ALU 8bit",
  doc: "ALU: A:=A sub l",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub(z80.regs.l);
  },
});

// {n:150, x:2, y:2, z:6, p:1, q:0}
// $ALU (HL)
opcodes.set(0x96, {
  name: "SUB (HL)",
  template: "$ALU (HL)",
  bytes: "96",
  group: "ALU 8bit",
  doc: "ALU: A:=A sub (HL)",
  flags: "***V0*",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.sub(z80.dbus);
  },
});

// {n:151, x:2, y:2, z:7, p:1, q:0}
// $ALU $RZ
opcodes.set(0x97, {
  name: "SUB A",
  template: "$ALU $RZ",
  bytes: "97",
  group: "ALU 8bit",
  doc: "ALU: A:=A sub a",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub(z80.regs.a);
  },
});

// {n:152, x:2, y:3, z:0, p:1, q:1}
// $ALU $RZ
opcodes.set(0x98, {
  name: "SBC A,B",
  template: "$ALU $RZ",
  bytes: "98",
  group: "ALU 8bit",
  doc: "ALU: A:=A sbc b",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc(z80.regs.b);
  },
});

// {n:153, x:2, y:3, z:1, p:1, q:1}
// $ALU $RZ
opcodes.set(0x99, {
  name: "SBC A,C",
  template: "$ALU $RZ",
  bytes: "99",
  group: "ALU 8bit",
  doc: "ALU: A:=A sbc c",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc(z80.regs.c);
  },
});

// {n:154, x:2, y:3, z:2, p:1, q:1}
// $ALU $RZ
opcodes.set(0x9a, {
  name: "SBC A,D",
  template: "$ALU $RZ",
  bytes: "9a",
  group: "ALU 8bit",
  doc: "ALU: A:=A sbc d",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc(z80.regs.d);
  },
});

// {n:155, x:2, y:3, z:3, p:1, q:1}
// $ALU $RZ
opcodes.set(0x9b, {
  name: "SBC A,E",
  template: "$ALU $RZ",
  bytes: "9b",
  group: "ALU 8bit",
  doc: "ALU: A:=A sbc e",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc(z80.regs.e);
  },
});

// {n:156, x:2, y:3, z:4, p:1, q:1}
// $ALU $RZ
opcodes.set(0x9c, {
  name: "SBC A,H",
  template: "$ALU $RZ",
  bytes: "9c",
  group: "ALU 8bit",
  doc: "ALU: A:=A sbc h",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc(z80.regs.h);
  },
});

// {n:157, x:2, y:3, z:5, p:1, q:1}
// $ALU $RZ
opcodes.set(0x9d, {
  name: "SBC A,L",
  template: "$ALU $RZ",
  bytes: "9d",
  group: "ALU 8bit",
  doc: "ALU: A:=A sbc l",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc(z80.regs.l);
  },
});

// {n:158, x:2, y:3, z:6, p:1, q:1}
// $ALU (HL)
opcodes.set(0x9e, {
  name: "SBC A,(HL)",
  template: "$ALU (HL)",
  bytes: "9e",
  group: "ALU 8bit",
  doc: "ALU: A:=A sbc (HL)",
  flags: "***V0*",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.sbc(z80.dbus);
  },
});

// {n:159, x:2, y:3, z:7, p:1, q:1}
// $ALU $RZ
opcodes.set(0x9f, {
  name: "SBC A,A",
  template: "$ALU $RZ",
  bytes: "9f",
  group: "ALU 8bit",
  doc: "ALU: A:=A sbc a",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc(z80.regs.a);
  },
});

// {n:160, x:2, y:4, z:0, p:2, q:0}
// $ALU $RZ
opcodes.set(0xa0, {
  name: "AND B",
  template: "$ALU $RZ",
  bytes: "a0",
  group: "ALU 8bit",
  doc: "ALU: A:=A and b",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and(z80.regs.b);
  },
});

// {n:161, x:2, y:4, z:1, p:2, q:0}
// $ALU $RZ
opcodes.set(0xa1, {
  name: "AND C",
  template: "$ALU $RZ",
  bytes: "a1",
  group: "ALU 8bit",
  doc: "ALU: A:=A and c",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and(z80.regs.c);
  },
});

// {n:162, x:2, y:4, z:2, p:2, q:0}
// $ALU $RZ
opcodes.set(0xa2, {
  name: "AND D",
  template: "$ALU $RZ",
  bytes: "a2",
  group: "ALU 8bit",
  doc: "ALU: A:=A and d",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and(z80.regs.d);
  },
});

// {n:163, x:2, y:4, z:3, p:2, q:0}
// $ALU $RZ
opcodes.set(0xa3, {
  name: "AND E",
  template: "$ALU $RZ",
  bytes: "a3",
  group: "ALU 8bit",
  doc: "ALU: A:=A and e",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and(z80.regs.e);
  },
});

// {n:164, x:2, y:4, z:4, p:2, q:0}
// $ALU $RZ
opcodes.set(0xa4, {
  name: "AND H",
  template: "$ALU $RZ",
  bytes: "a4",
  group: "ALU 8bit",
  doc: "ALU: A:=A and h",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and(z80.regs.h);
  },
});

// {n:165, x:2, y:4, z:5, p:2, q:0}
// $ALU $RZ
opcodes.set(0xa5, {
  name: "AND L",
  template: "$ALU $RZ",
  bytes: "a5",
  group: "ALU 8bit",
  doc: "ALU: A:=A and l",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and(z80.regs.l);
  },
});

// {n:166, x:2, y:4, z:6, p:2, q:0}
// $ALU (HL)
opcodes.set(0xa6, {
  name: "AND (HL)",
  template: "$ALU (HL)",
  bytes: "a6",
  group: "ALU 8bit",
  doc: "ALU: A:=A and (HL)",
  flags: "***V0*",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.and(z80.dbus);
  },
});

// {n:167, x:2, y:4, z:7, p:2, q:0}
// $ALU $RZ
opcodes.set(0xa7, {
  name: "AND A",
  template: "$ALU $RZ",
  bytes: "a7",
  group: "ALU 8bit",
  doc: "ALU: A:=A and a",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and(z80.regs.a);
  },
});

// {n:168, x:2, y:5, z:0, p:2, q:1}
// $ALU $RZ
opcodes.set(0xa8, {
  name: "XOR B",
  template: "$ALU $RZ",
  bytes: "a8",
  group: "ALU 8bit",
  doc: "ALU: A:=A xor b",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor(z80.regs.b);
  },
});

// {n:169, x:2, y:5, z:1, p:2, q:1}
// $ALU $RZ
opcodes.set(0xa9, {
  name: "XOR C",
  template: "$ALU $RZ",
  bytes: "a9",
  group: "ALU 8bit",
  doc: "ALU: A:=A xor c",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor(z80.regs.c);
  },
});

// {n:170, x:2, y:5, z:2, p:2, q:1}
// $ALU $RZ
opcodes.set(0xaa, {
  name: "XOR D",
  template: "$ALU $RZ",
  bytes: "aa",
  group: "ALU 8bit",
  doc: "ALU: A:=A xor d",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor(z80.regs.d);
  },
});

// {n:171, x:2, y:5, z:3, p:2, q:1}
// $ALU $RZ
opcodes.set(0xab, {
  name: "XOR E",
  template: "$ALU $RZ",
  bytes: "ab",
  group: "ALU 8bit",
  doc: "ALU: A:=A xor e",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor(z80.regs.e);
  },
});

// {n:172, x:2, y:5, z:4, p:2, q:1}
// $ALU $RZ
opcodes.set(0xac, {
  name: "XOR H",
  template: "$ALU $RZ",
  bytes: "ac",
  group: "ALU 8bit",
  doc: "ALU: A:=A xor h",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor(z80.regs.h);
  },
});

// {n:173, x:2, y:5, z:5, p:2, q:1}
// $ALU $RZ
opcodes.set(0xad, {
  name: "XOR L",
  template: "$ALU $RZ",
  bytes: "ad",
  group: "ALU 8bit",
  doc: "ALU: A:=A xor l",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor(z80.regs.l);
  },
});

// {n:174, x:2, y:5, z:6, p:2, q:1}
// $ALU (HL)
opcodes.set(0xae, {
  name: "XOR (HL)",
  template: "$ALU (HL)",
  bytes: "ae",
  group: "ALU 8bit",
  doc: "ALU: A:=A xor (HL)",
  flags: "***V0*",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.xor(z80.dbus);
  },
});

// {n:175, x:2, y:5, z:7, p:2, q:1}
// $ALU $RZ
opcodes.set(0xaf, {
  name: "XOR A",
  template: "$ALU $RZ",
  bytes: "af",
  group: "ALU 8bit",
  doc: "ALU: A:=A xor a",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor(z80.regs.a);
  },
});

// {n:176, x:2, y:6, z:0, p:3, q:0}
// $ALU $RZ
opcodes.set(0xb0, {
  name: "OR B",
  template: "$ALU $RZ",
  bytes: "b0",
  group: "ALU 8bit",
  doc: "ALU: A:=A or b",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or(z80.regs.b);
  },
});

// {n:177, x:2, y:6, z:1, p:3, q:0}
// $ALU $RZ
opcodes.set(0xb1, {
  name: "OR C",
  template: "$ALU $RZ",
  bytes: "b1",
  group: "ALU 8bit",
  doc: "ALU: A:=A or c",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or(z80.regs.c);
  },
});

// {n:178, x:2, y:6, z:2, p:3, q:0}
// $ALU $RZ
opcodes.set(0xb2, {
  name: "OR D",
  template: "$ALU $RZ",
  bytes: "b2",
  group: "ALU 8bit",
  doc: "ALU: A:=A or d",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or(z80.regs.d);
  },
});

// {n:179, x:2, y:6, z:3, p:3, q:0}
// $ALU $RZ
opcodes.set(0xb3, {
  name: "OR E",
  template: "$ALU $RZ",
  bytes: "b3",
  group: "ALU 8bit",
  doc: "ALU: A:=A or e",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or(z80.regs.e);
  },
});

// {n:180, x:2, y:6, z:4, p:3, q:0}
// $ALU $RZ
opcodes.set(0xb4, {
  name: "OR H",
  template: "$ALU $RZ",
  bytes: "b4",
  group: "ALU 8bit",
  doc: "ALU: A:=A or h",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or(z80.regs.h);
  },
});

// {n:181, x:2, y:6, z:5, p:3, q:0}
// $ALU $RZ
opcodes.set(0xb5, {
  name: "OR L",
  template: "$ALU $RZ",
  bytes: "b5",
  group: "ALU 8bit",
  doc: "ALU: A:=A or l",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or(z80.regs.l);
  },
});

// {n:182, x:2, y:6, z:6, p:3, q:0}
// $ALU (HL)
opcodes.set(0xb6, {
  name: "OR (HL)",
  template: "$ALU (HL)",
  bytes: "b6",
  group: "ALU 8bit",
  doc: "ALU: A:=A or (HL)",
  flags: "***V0*",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.or(z80.dbus);
  },
});

// {n:183, x:2, y:6, z:7, p:3, q:0}
// $ALU $RZ
opcodes.set(0xb7, {
  name: "OR A",
  template: "$ALU $RZ",
  bytes: "b7",
  group: "ALU 8bit",
  doc: "ALU: A:=A or a",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or(z80.regs.a);
  },
});

// {n:184, x:2, y:7, z:0, p:3, q:1}
// $ALU $RZ
opcodes.set(0xb8, {
  name: "CP B",
  template: "$ALU $RZ",
  bytes: "b8",
  group: "ALU 8bit",
  doc: "ALU: A:=A cp b",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp(z80.regs.b);
  },
});

// {n:185, x:2, y:7, z:1, p:3, q:1}
// $ALU $RZ
opcodes.set(0xb9, {
  name: "CP C",
  template: "$ALU $RZ",
  bytes: "b9",
  group: "ALU 8bit",
  doc: "ALU: A:=A cp c",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp(z80.regs.c);
  },
});

// {n:186, x:2, y:7, z:2, p:3, q:1}
// $ALU $RZ
opcodes.set(0xba, {
  name: "CP D",
  template: "$ALU $RZ",
  bytes: "ba",
  group: "ALU 8bit",
  doc: "ALU: A:=A cp d",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp(z80.regs.d);
  },
});

// {n:187, x:2, y:7, z:3, p:3, q:1}
// $ALU $RZ
opcodes.set(0xbb, {
  name: "CP E",
  template: "$ALU $RZ",
  bytes: "bb",
  group: "ALU 8bit",
  doc: "ALU: A:=A cp e",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp(z80.regs.e);
  },
});

// {n:188, x:2, y:7, z:4, p:3, q:1}
// $ALU $RZ
opcodes.set(0xbc, {
  name: "CP H",
  template: "$ALU $RZ",
  bytes: "bc",
  group: "ALU 8bit",
  doc: "ALU: A:=A cp h",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp(z80.regs.h);
  },
});

// {n:189, x:2, y:7, z:5, p:3, q:1}
// $ALU $RZ
opcodes.set(0xbd, {
  name: "CP L",
  template: "$ALU $RZ",
  bytes: "bd",
  group: "ALU 8bit",
  doc: "ALU: A:=A cp l",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp(z80.regs.l);
  },
});

// {n:190, x:2, y:7, z:6, p:3, q:1}
// $ALU (HL)
opcodes.set(0xbe, {
  name: "CP (HL)",
  template: "$ALU (HL)",
  bytes: "be",
  group: "ALU 8bit",
  doc: "ALU: A:=A cp (HL)",
  flags: "***V0*",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $ADDR, dst: $DLATCH}
    z80.abus = z80.regs.hl;
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.cp(z80.dbus);
  },
});

// {n:191, x:2, y:7, z:7, p:3, q:1}
// $ALU $RZ
opcodes.set(0xbf, {
  name: "CP A",
  template: "$ALU $RZ",
  bytes: "bf",
  group: "ALU 8bit",
  doc: "ALU: A:=A cp a",
  flags: "***V0*",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp(z80.regs.a);
  },
});

// {n:192, x:3, y:0, z:0, p:0, q:0}
// RET $CC
opcodes.set(0xc0, {
  name: "RET NZ",
  template: "RET $CC",
  bytes: "c0",
  group: "Control flow",
  doc: "Return if NZ",
  states: [11, 5],
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
  name: "POP BC",
  template: "POP $RP2",
  bytes: "c1",
  group: "Load 16bit",
  doc: "Pop stack [LowByte,HighByte] to bc",
  states: [10],
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
  name: "JP NZ,$NN",
  template: "JP $CC,$nn",
  bytes: "c2 $2l $2h",
  group: "Control flow",
  doc: "Jump conditional to immediate: if NZ PC=nn",
  states: [10],
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
  name: "JP $NN",
  template: "JP $nn",
  bytes: "c3 $1l $1h",
  group: "Control flow",
  doc: "Jump unconditional to immediate: PC=nn",
  states: [10],
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
  name: "CALL NZ,$NN",
  template: "CALL $CC,$nn",
  bytes: "c4 $2l $2h",
  group: "Control flow",
  doc: "Call conditional: if NZ push PC, PC=nn",
  states: [17, 10],
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
  name: "PUSH BC",
  template: "PUSH $RP2",
  bytes: "c5",
  group: "Load 16bit",
  doc: "Push bc to stack in order [LowHi]",
  states: [11],
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
  name: "ADD A,$N",
  template: "$ALU $n",
  bytes: "c6 $1",
  group: "ALU 8bit",
  doc: "A:=A add n",
  flags: "***V0*",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.add(z80.dbus);
  },
});

// {n:199, x:3, y:0, z:7, p:0, q:0}
// RST $Y*8
opcodes.set(0xc7, {
  name: "RST 0X00",
  template: "RST $Y*8",
  bytes: "c7",
  group: "Control Flow",
  doc: "Restart: push PC, PC=p",
  states: [11],
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
  template: "RET $CC",
  bytes: "c8",
  group: "Control flow",
  doc: "Return if Z",
  states: [11, 5],
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
  template: "RET",
  bytes: "c9",
  group: "Control flow",
  doc: "Return: POP SP",
  states: [10],
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
  name: "JP Z,$NN",
  template: "JP $CC,$nn",
  bytes: "ca $2l $2h",
  group: "Control flow",
  doc: "Jump conditional to immediate: if Z PC=nn",
  states: [10],
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
  template: "CB prefix",
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
  name: "CALL Z,$NN",
  template: "CALL $CC,$nn",
  bytes: "cc $2l $2h",
  group: "Control flow",
  doc: "Call conditional: if Z push PC, PC=nn",
  states: [17, 10],
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
  name: "CALL $NN",
  template: "CALL $nn",
  bytes: "cd $1l $1h",
  group: "Control flow",
  doc: "Call unconditional: push SP,PC=nn",
  states: [17],
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
  name: "ADC A,$N",
  template: "$ALU $n",
  bytes: "ce $1",
  group: "ALU 8bit",
  doc: "A:=A adc n",
  flags: "***V0*",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.adc(z80.dbus);
  },
});

// {n:207, x:3, y:1, z:7, p:0, q:1}
// RST $Y*8
opcodes.set(0xcf, {
  name: "RST 0X08",
  template: "RST $Y*8",
  bytes: "cf",
  group: "Control Flow",
  doc: "Restart: push PC, PC=p",
  states: [11],
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
  template: "RET $CC",
  bytes: "d0",
  group: "Control flow",
  doc: "Return if NC",
  states: [11, 5],
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
  name: "POP DE",
  template: "POP $RP2",
  bytes: "d1",
  group: "Load 16bit",
  doc: "Pop stack [LowByte,HighByte] to de",
  states: [10],
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
  name: "JP NC,$NN",
  template: "JP $CC,$nn",
  bytes: "d2 $2l $2h",
  group: "Control flow",
  doc: "Jump conditional to immediate: if NC PC=nn",
  states: [10],
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
  name: "OUT ($N),A",
  template: "OUT ($n),A",
  bytes: "d3 $1",
  group: "IO",
  doc: "[N]:=A",
  states: [11],
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
  name: "CALL NC,$NN",
  template: "CALL $CC,$nn",
  bytes: "d4 $2l $2h",
  group: "Control flow",
  doc: "Call conditional: if NC push PC, PC=nn",
  states: [17, 10],
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
  name: "PUSH DE",
  template: "PUSH $RP2",
  bytes: "d5",
  group: "Load 16bit",
  doc: "Push de to stack in order [LowHi]",
  states: [11],
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
  name: "SUB $N",
  template: "$ALU $n",
  bytes: "d6 $1",
  group: "ALU 8bit",
  doc: "A:=A sub n",
  flags: "***V1*",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.sub(z80.dbus);
  },
});

// {n:215, x:3, y:2, z:7, p:1, q:0}
// RST $Y*8
opcodes.set(0xd7, {
  name: "RST 0X10",
  template: "RST $Y*8",
  bytes: "d7",
  group: "Control Flow",
  doc: "Restart: push PC, PC=p",
  states: [11],
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
  template: "RET $CC",
  bytes: "d8",
  group: "Control flow",
  doc: "Return if C",
  states: [11, 5],
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
  template: "EXX",
  bytes: "d9",
  group: "Transfer",
  doc: "Swap BC/DE/HL with their prime",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "z80.exx()"}
    z80.exx();
  },
});

// {n:218, x:3, y:3, z:2, p:1, q:1}
// JP $CC,$nn
opcodes.set(0xda, {
  name: "JP C,$NN",
  template: "JP $CC,$nn",
  bytes: "da $2l $2h",
  group: "Control flow",
  doc: "Jump conditional to immediate: if C PC=nn",
  states: [10],
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
  name: "IN A,($N)",
  template: "IN A,($n)",
  bytes: "db $2",
  group: "IO",
  doc: "A:=[N]",
  states: [11],
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
  name: "CALL C,$NN",
  template: "CALL $CC,$nn",
  bytes: "dc $2l $2h",
  group: "Control flow",
  doc: "Call conditional: if C push PC, PC=nn",
  states: [17, 10],
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
  template: "DD prefix",
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
  name: "SBC A,$N",
  template: "$ALU $n",
  bytes: "de $1",
  group: "ALU 8bit",
  doc: "A:=A sbc n",
  flags: "***V1*",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.sbc(z80.dbus);
  },
});

// {n:223, x:3, y:3, z:7, p:1, q:1}
// RST $Y*8
opcodes.set(0xdf, {
  name: "RST 0X18",
  template: "RST $Y*8",
  bytes: "df",
  group: "Control Flow",
  doc: "Restart: push PC, PC=p",
  states: [11],
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
  template: "RET $CC",
  bytes: "e0",
  group: "Control flow",
  doc: "Return if PO",
  states: [11, 5],
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
  name: "POP HL",
  template: "POP $RP2",
  bytes: "e1",
  group: "Load 16bit",
  doc: "Pop stack [LowByte,HighByte] to hl",
  states: [10],
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
  name: "JP PO,$NN",
  template: "JP $CC,$nn",
  bytes: "e2 $2l $2h",
  group: "Control flow",
  doc: "Jump conditional to immediate: if PO PC=nn",
  states: [10],
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
  template: "EX (SP),HL",
  bytes: "e3",
  group: "Transfer",
  doc: "Exchange (SP)<->HL",
  states: [19],
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
  name: "CALL PO,$NN",
  template: "CALL $CC,$nn",
  bytes: "e4 $2l $2h",
  group: "Control flow",
  doc: "Call conditional: if PO push PC, PC=nn",
  states: [17, 10],
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
  name: "PUSH HL",
  template: "PUSH $RP2",
  bytes: "e5",
  group: "Load 16bit",
  doc: "Push hl to stack in order [LowHi]",
  states: [11],
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
  name: "AND $N",
  template: "$ALU $n",
  bytes: "e6 $1",
  group: "ALU 8bit",
  doc: "A:=A and n",
  flags: "***P00",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.and(z80.dbus);
  },
});

// {n:231, x:3, y:4, z:7, p:2, q:0}
// RST $Y*8
opcodes.set(0xe7, {
  name: "RST 0X20",
  template: "RST $Y*8",
  bytes: "e7",
  group: "Control Flow",
  doc: "Restart: push PC, PC=p",
  states: [11],
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
  template: "RET $CC",
  bytes: "e8",
  group: "Control flow",
  doc: "Return if PE",
  states: [11, 5],
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
  template: "JP HL",
  bytes: "e9",
  group: "Control flow",
  doc: "JMP if parity: PC=HL",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$PC=$HL"}
    z80.regs.pc = z80.regs.hl;
  },
});

// {n:234, x:3, y:5, z:2, p:2, q:1}
// JP $CC,$nn
opcodes.set(0xea, {
  name: "JP PE,$NN",
  template: "JP $CC,$nn",
  bytes: "ea $2l $2h",
  group: "Control flow",
  doc: "Jump conditional to immediate: if PE PC=nn",
  states: [10],
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
  template: "EX DE,HL",
  bytes: "eb",
  group: "Transfer",
  doc: "Exchange DE<->HL",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "z80.ex_de_hl()"}
    z80.ex_de_hl();
  },
});

// {n:236, x:3, y:5, z:4, p:2, q:1}
// CALL $CC,$nn
opcodes.set(0xec, {
  name: "CALL PE,$NN",
  template: "CALL $CC,$nn",
  bytes: "ec $2l $2h",
  group: "Control flow",
  doc: "Call conditional: if PE push PC, PC=nn",
  states: [17, 10],
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
  template: "ED prefix",
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
  name: "XOR $N",
  template: "$ALU $n",
  bytes: "ee $1",
  group: "ALU 8bit",
  doc: "A:=A xor n",
  flags: "***P00",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.xor(z80.dbus);
  },
});

// {n:239, x:3, y:5, z:7, p:2, q:1}
// RST $Y*8
opcodes.set(0xef, {
  name: "RST 0X28",
  template: "RST $Y*8",
  bytes: "ef",
  group: "Control Flow",
  doc: "Restart: push PC, PC=p",
  states: [11],
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
  template: "RET $CC",
  bytes: "f0",
  group: "Control flow",
  doc: "Return if P",
  states: [11, 5],
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
  name: "POP AF",
  template: "POP $RP2",
  bytes: "f1",
  group: "Load 16bit",
  doc: "Pop stack [LowByte,HighByte] to af",
  states: [10],
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
  name: "JP P,$NN",
  template: "JP $CC,$nn",
  bytes: "f2 $2l $2h",
  group: "Control flow",
  doc: "Jump conditional to immediate: if P PC=nn",
  states: [10],
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
  template: "DI",
  bytes: "f3",
  group: "CPU Control",
  doc: "Disable interrupts",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$IFF1=0; $IFF2=0"}
    z80.regs.iff1 = 0;
    z80.regs.iff2 = 0;
  },
});

// {n:244, x:3, y:6, z:4, p:3, q:0}
// CALL $CC,$nn
opcodes.set(0xf4, {
  name: "CALL P,$NN",
  template: "CALL $CC,$nn",
  bytes: "f4 $2l $2h",
  group: "Control flow",
  doc: "Call conditional: if P push PC, PC=nn",
  states: [17, 10],
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
  name: "PUSH AF",
  template: "PUSH $RP2",
  bytes: "f5",
  group: "Load 16bit",
  doc: "Push af to stack in order [LowHi]",
  states: [11],
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
  name: "OR $N",
  template: "$ALU $n",
  bytes: "f6 $1",
  group: "ALU 8bit",
  doc: "A:=A or n",
  flags: "***P00",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.or(z80.dbus);
  },
});

// {n:247, x:3, y:6, z:7, p:3, q:0}
// RST $Y*8
opcodes.set(0xf7, {
  name: "RST 0X30",
  template: "RST $Y*8",
  bytes: "f7",
  group: "Control Flow",
  doc: "Restart: push PC, PC=p",
  states: [11],
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
  template: "RET $CC",
  bytes: "f8",
  group: "Control flow",
  doc: "Return if M",
  states: [11, 5],
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
  template: "LD SP,HL",
  bytes: "f9",
  group: "Load 16bit",
  doc: "SP:=HL",
  states: [6],
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$SP=$HL"}
    z80.incTStateCount(2);
    z80.regs.sp = z80.regs.hl;
  },
});

// {n:250, x:3, y:7, z:2, p:3, q:1}
// JP $CC,$nn
opcodes.set(0xfa, {
  name: "JP M,$NN",
  template: "JP $CC,$nn",
  bytes: "fa $2l $2h",
  group: "Control flow",
  doc: "Jump conditional to immediate: if M PC=nn",
  states: [10],
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
  template: "EI",
  bytes: "fb",
  group: "CPU Control",
  doc: "Enable interrupts",
  states: [4],
  fn: (z80) => {
    // overlapped: {action: "$IFF1=1; $IFF2=1"}
    z80.regs.iff1 = 1;
    z80.regs.iff2 = 1;
  },
});

// {n:252, x:3, y:7, z:4, p:3, q:1}
// CALL $CC,$nn
opcodes.set(0xfc, {
  name: "CALL M,$NN",
  template: "CALL $CC,$nn",
  bytes: "fc $2l $2h",
  group: "Control flow",
  doc: "Call conditional: if M push PC, PC=nn",
  states: [17, 10],
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
  template: "FD prefix",
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
  name: "CP $N",
  template: "$ALU $n",
  bytes: "fe $1",
  group: "ALU 8bit",
  doc: "A:=A cp n",
  flags: "***V1*",
  states: [7],
  fn: (z80) => {
    // mread: {ab: $PC++, dst: $DLATCH}
    z80.abus = z80.regs.pc;
    z80.regs.pc = inc16(z80.regs.pc);
    z80.dbus = z80.readByte(z80.abus);
    // overlapped: {action: "$ALU($DLATCH)"}
    z80.alu.cp(z80.dbus);
  },
});

// {n:255, x:3, y:7, z:7, p:3, q:1}
// RST $Y*8
opcodes.set(0xff, {
  name: "RST 0X38",
  template: "RST $Y*8",
  bytes: "ff",
  group: "Control Flow",
  doc: "Restart: push PC, PC=p",
  states: [11],
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
  name: "RLC B",
  template: "$ROT $RZ",
  bytes: "cb 00",
  group: "RT/SH 8bit",
  doc: "Rotate left through carry b",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.rlc(z80.regs.b);
  },
});

// {n:1, x:0, y:0, z:1, p:0, q:0}
// $ROT $RZ
opcodes.set(0xcb01, {
  name: "RLC C",
  template: "$ROT $RZ",
  bytes: "cb 01",
  group: "RT/SH 8bit",
  doc: "Rotate left through carry c",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.rlc(z80.regs.c);
  },
});

// {n:2, x:0, y:0, z:2, p:0, q:0}
// $ROT $RZ
opcodes.set(0xcb02, {
  name: "RLC D",
  template: "$ROT $RZ",
  bytes: "cb 02",
  group: "RT/SH 8bit",
  doc: "Rotate left through carry d",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.rlc(z80.regs.d);
  },
});

// {n:3, x:0, y:0, z:3, p:0, q:0}
// $ROT $RZ
opcodes.set(0xcb03, {
  name: "RLC E",
  template: "$ROT $RZ",
  bytes: "cb 03",
  group: "RT/SH 8bit",
  doc: "Rotate left through carry e",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.rlc(z80.regs.e);
  },
});

// {n:4, x:0, y:0, z:4, p:0, q:0}
// $ROT $RZ
opcodes.set(0xcb04, {
  name: "RLC H",
  template: "$ROT $RZ",
  bytes: "cb 04",
  group: "RT/SH 8bit",
  doc: "Rotate left through carry h",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.rlc(z80.regs.h);
  },
});

// {n:5, x:0, y:0, z:5, p:0, q:0}
// $ROT $RZ
opcodes.set(0xcb05, {
  name: "RLC L",
  template: "$ROT $RZ",
  bytes: "cb 05",
  group: "RT/SH 8bit",
  doc: "Rotate left through carry l",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.rlc(z80.regs.l);
  },
});

// {n:6, x:0, y:0, z:6, p:0, q:0}
// $ROT (HL)
opcodes.set(0xcb06, {
  name: "RLC (HL)",
  template: "$ROT (HL)",
  bytes: "cb 06",
  group: "RT/SH 8bit",
  doc: "Rotate left through carry (HL)",
  flags: "**0P0*",
  states: [8],
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
  name: "RLC A",
  template: "$ROT $RZ",
  bytes: "cb 07",
  group: "RT/SH 8bit",
  doc: "Rotate left through carry a",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.rlc(z80.regs.a);
  },
});

// {n:8, x:0, y:1, z:0, p:0, q:1}
// $ROT $RZ
opcodes.set(0xcb08, {
  name: "RRC B",
  template: "$ROT $RZ",
  bytes: "cb 08",
  group: "RT/SH 8bit",
  doc: "Rotate right through carry b",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.rrc(z80.regs.b);
  },
});

// {n:9, x:0, y:1, z:1, p:0, q:1}
// $ROT $RZ
opcodes.set(0xcb09, {
  name: "RRC C",
  template: "$ROT $RZ",
  bytes: "cb 09",
  group: "RT/SH 8bit",
  doc: "Rotate right through carry c",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.rrc(z80.regs.c);
  },
});

// {n:10, x:0, y:1, z:2, p:0, q:1}
// $ROT $RZ
opcodes.set(0xcb0a, {
  name: "RRC D",
  template: "$ROT $RZ",
  bytes: "cb 0a",
  group: "RT/SH 8bit",
  doc: "Rotate right through carry d",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.rrc(z80.regs.d);
  },
});

// {n:11, x:0, y:1, z:3, p:0, q:1}
// $ROT $RZ
opcodes.set(0xcb0b, {
  name: "RRC E",
  template: "$ROT $RZ",
  bytes: "cb 0b",
  group: "RT/SH 8bit",
  doc: "Rotate right through carry e",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.rrc(z80.regs.e);
  },
});

// {n:12, x:0, y:1, z:4, p:0, q:1}
// $ROT $RZ
opcodes.set(0xcb0c, {
  name: "RRC H",
  template: "$ROT $RZ",
  bytes: "cb 0c",
  group: "RT/SH 8bit",
  doc: "Rotate right through carry h",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.rrc(z80.regs.h);
  },
});

// {n:13, x:0, y:1, z:5, p:0, q:1}
// $ROT $RZ
opcodes.set(0xcb0d, {
  name: "RRC L",
  template: "$ROT $RZ",
  bytes: "cb 0d",
  group: "RT/SH 8bit",
  doc: "Rotate right through carry l",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.rrc(z80.regs.l);
  },
});

// {n:14, x:0, y:1, z:6, p:0, q:1}
// $ROT (HL)
opcodes.set(0xcb0e, {
  name: "RRC (HL)",
  template: "$ROT (HL)",
  bytes: "cb 0e",
  group: "RT/SH 8bit",
  doc: "Rotate right through carry (HL)",
  flags: "**0P0*",
  states: [8],
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
  name: "RRC A",
  template: "$ROT $RZ",
  bytes: "cb 0f",
  group: "RT/SH 8bit",
  doc: "Rotate right through carry a",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.rrc(z80.regs.a);
  },
});

// {n:16, x:0, y:2, z:0, p:1, q:0}
// $ROT $RZ
opcodes.set(0xcb10, {
  name: "RL B",
  template: "$ROT $RZ",
  bytes: "cb 10",
  group: "RT/SH 8bit",
  doc: "Rotate left from carry b",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.rl(z80.regs.b);
  },
});

// {n:17, x:0, y:2, z:1, p:1, q:0}
// $ROT $RZ
opcodes.set(0xcb11, {
  name: "RL C",
  template: "$ROT $RZ",
  bytes: "cb 11",
  group: "RT/SH 8bit",
  doc: "Rotate left from carry c",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.rl(z80.regs.c);
  },
});

// {n:18, x:0, y:2, z:2, p:1, q:0}
// $ROT $RZ
opcodes.set(0xcb12, {
  name: "RL D",
  template: "$ROT $RZ",
  bytes: "cb 12",
  group: "RT/SH 8bit",
  doc: "Rotate left from carry d",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.rl(z80.regs.d);
  },
});

// {n:19, x:0, y:2, z:3, p:1, q:0}
// $ROT $RZ
opcodes.set(0xcb13, {
  name: "RL E",
  template: "$ROT $RZ",
  bytes: "cb 13",
  group: "RT/SH 8bit",
  doc: "Rotate left from carry e",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.rl(z80.regs.e);
  },
});

// {n:20, x:0, y:2, z:4, p:1, q:0}
// $ROT $RZ
opcodes.set(0xcb14, {
  name: "RL H",
  template: "$ROT $RZ",
  bytes: "cb 14",
  group: "RT/SH 8bit",
  doc: "Rotate left from carry h",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.rl(z80.regs.h);
  },
});

// {n:21, x:0, y:2, z:5, p:1, q:0}
// $ROT $RZ
opcodes.set(0xcb15, {
  name: "RL L",
  template: "$ROT $RZ",
  bytes: "cb 15",
  group: "RT/SH 8bit",
  doc: "Rotate left from carry l",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.rl(z80.regs.l);
  },
});

// {n:22, x:0, y:2, z:6, p:1, q:0}
// $ROT (HL)
opcodes.set(0xcb16, {
  name: "RL (HL)",
  template: "$ROT (HL)",
  bytes: "cb 16",
  group: "RT/SH 8bit",
  doc: "Rotate left from carry (HL)",
  flags: "**0P0*",
  states: [8],
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
  name: "RL A",
  template: "$ROT $RZ",
  bytes: "cb 17",
  group: "RT/SH 8bit",
  doc: "Rotate left from carry a",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.rl(z80.regs.a);
  },
});

// {n:24, x:0, y:3, z:0, p:1, q:1}
// $ROT $RZ
opcodes.set(0xcb18, {
  name: "RR B",
  template: "$ROT $RZ",
  bytes: "cb 18",
  group: "RT/SH 8bit",
  doc: "Rotate right from carry b",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.rr(z80.regs.b);
  },
});

// {n:25, x:0, y:3, z:1, p:1, q:1}
// $ROT $RZ
opcodes.set(0xcb19, {
  name: "RR C",
  template: "$ROT $RZ",
  bytes: "cb 19",
  group: "RT/SH 8bit",
  doc: "Rotate right from carry c",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.rr(z80.regs.c);
  },
});

// {n:26, x:0, y:3, z:2, p:1, q:1}
// $ROT $RZ
opcodes.set(0xcb1a, {
  name: "RR D",
  template: "$ROT $RZ",
  bytes: "cb 1a",
  group: "RT/SH 8bit",
  doc: "Rotate right from carry d",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.rr(z80.regs.d);
  },
});

// {n:27, x:0, y:3, z:3, p:1, q:1}
// $ROT $RZ
opcodes.set(0xcb1b, {
  name: "RR E",
  template: "$ROT $RZ",
  bytes: "cb 1b",
  group: "RT/SH 8bit",
  doc: "Rotate right from carry e",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.rr(z80.regs.e);
  },
});

// {n:28, x:0, y:3, z:4, p:1, q:1}
// $ROT $RZ
opcodes.set(0xcb1c, {
  name: "RR H",
  template: "$ROT $RZ",
  bytes: "cb 1c",
  group: "RT/SH 8bit",
  doc: "Rotate right from carry h",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.rr(z80.regs.h);
  },
});

// {n:29, x:0, y:3, z:5, p:1, q:1}
// $ROT $RZ
opcodes.set(0xcb1d, {
  name: "RR L",
  template: "$ROT $RZ",
  bytes: "cb 1d",
  group: "RT/SH 8bit",
  doc: "Rotate right from carry l",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.rr(z80.regs.l);
  },
});

// {n:30, x:0, y:3, z:6, p:1, q:1}
// $ROT (HL)
opcodes.set(0xcb1e, {
  name: "RR (HL)",
  template: "$ROT (HL)",
  bytes: "cb 1e",
  group: "RT/SH 8bit",
  doc: "Rotate right from carry (HL)",
  flags: "**0P0*",
  states: [8],
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
  name: "RR A",
  template: "$ROT $RZ",
  bytes: "cb 1f",
  group: "RT/SH 8bit",
  doc: "Rotate right from carry a",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.rr(z80.regs.a);
  },
});

// {n:32, x:0, y:4, z:0, p:2, q:0}
// $ROT $RZ
opcodes.set(0xcb20, {
  name: "SLA B",
  template: "$ROT $RZ",
  bytes: "cb 20",
  group: "RT/SH 8bit",
  doc: "Shift left arithmetic b",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.sla(z80.regs.b);
  },
});

// {n:33, x:0, y:4, z:1, p:2, q:0}
// $ROT $RZ
opcodes.set(0xcb21, {
  name: "SLA C",
  template: "$ROT $RZ",
  bytes: "cb 21",
  group: "RT/SH 8bit",
  doc: "Shift left arithmetic c",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.sla(z80.regs.c);
  },
});

// {n:34, x:0, y:4, z:2, p:2, q:0}
// $ROT $RZ
opcodes.set(0xcb22, {
  name: "SLA D",
  template: "$ROT $RZ",
  bytes: "cb 22",
  group: "RT/SH 8bit",
  doc: "Shift left arithmetic d",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.sla(z80.regs.d);
  },
});

// {n:35, x:0, y:4, z:3, p:2, q:0}
// $ROT $RZ
opcodes.set(0xcb23, {
  name: "SLA E",
  template: "$ROT $RZ",
  bytes: "cb 23",
  group: "RT/SH 8bit",
  doc: "Shift left arithmetic e",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.sla(z80.regs.e);
  },
});

// {n:36, x:0, y:4, z:4, p:2, q:0}
// $ROT $RZ
opcodes.set(0xcb24, {
  name: "SLA H",
  template: "$ROT $RZ",
  bytes: "cb 24",
  group: "RT/SH 8bit",
  doc: "Shift left arithmetic h",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.sla(z80.regs.h);
  },
});

// {n:37, x:0, y:4, z:5, p:2, q:0}
// $ROT $RZ
opcodes.set(0xcb25, {
  name: "SLA L",
  template: "$ROT $RZ",
  bytes: "cb 25",
  group: "RT/SH 8bit",
  doc: "Shift left arithmetic l",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.sla(z80.regs.l);
  },
});

// {n:38, x:0, y:4, z:6, p:2, q:0}
// $ROT (HL)
opcodes.set(0xcb26, {
  name: "SLA (HL)",
  template: "$ROT (HL)",
  bytes: "cb 26",
  group: "RT/SH 8bit",
  doc: "Shift left arithmetic (HL)",
  flags: "**0P0*",
  states: [8],
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
  name: "SLA A",
  template: "$ROT $RZ",
  bytes: "cb 27",
  group: "RT/SH 8bit",
  doc: "Shift left arithmetic a",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.sla(z80.regs.a);
  },
});

// {n:40, x:0, y:5, z:0, p:2, q:1}
// $ROT $RZ
opcodes.set(0xcb28, {
  name: "SRA B",
  template: "$ROT $RZ",
  bytes: "cb 28",
  group: "RT/SH 8bit",
  doc: "Shift right arithmetic b",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.sra(z80.regs.b);
  },
});

// {n:41, x:0, y:5, z:1, p:2, q:1}
// $ROT $RZ
opcodes.set(0xcb29, {
  name: "SRA C",
  template: "$ROT $RZ",
  bytes: "cb 29",
  group: "RT/SH 8bit",
  doc: "Shift right arithmetic c",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.sra(z80.regs.c);
  },
});

// {n:42, x:0, y:5, z:2, p:2, q:1}
// $ROT $RZ
opcodes.set(0xcb2a, {
  name: "SRA D",
  template: "$ROT $RZ",
  bytes: "cb 2a",
  group: "RT/SH 8bit",
  doc: "Shift right arithmetic d",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.sra(z80.regs.d);
  },
});

// {n:43, x:0, y:5, z:3, p:2, q:1}
// $ROT $RZ
opcodes.set(0xcb2b, {
  name: "SRA E",
  template: "$ROT $RZ",
  bytes: "cb 2b",
  group: "RT/SH 8bit",
  doc: "Shift right arithmetic e",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.sra(z80.regs.e);
  },
});

// {n:44, x:0, y:5, z:4, p:2, q:1}
// $ROT $RZ
opcodes.set(0xcb2c, {
  name: "SRA H",
  template: "$ROT $RZ",
  bytes: "cb 2c",
  group: "RT/SH 8bit",
  doc: "Shift right arithmetic h",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.sra(z80.regs.h);
  },
});

// {n:45, x:0, y:5, z:5, p:2, q:1}
// $ROT $RZ
opcodes.set(0xcb2d, {
  name: "SRA L",
  template: "$ROT $RZ",
  bytes: "cb 2d",
  group: "RT/SH 8bit",
  doc: "Shift right arithmetic l",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.sra(z80.regs.l);
  },
});

// {n:46, x:0, y:5, z:6, p:2, q:1}
// $ROT (HL)
opcodes.set(0xcb2e, {
  name: "SRA (HL)",
  template: "$ROT (HL)",
  bytes: "cb 2e",
  group: "RT/SH 8bit",
  doc: "Shift right arithmetic (HL)",
  flags: "**0P0*",
  states: [8],
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
  name: "SRA A",
  template: "$ROT $RZ",
  bytes: "cb 2f",
  group: "RT/SH 8bit",
  doc: "Shift right arithmetic a",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.sra(z80.regs.a);
  },
});

// {n:48, x:0, y:6, z:0, p:3, q:0}
// $ROT $RZ
opcodes.set(0xcb30, {
  name: "SLL B",
  template: "$ROT $RZ",
  bytes: "cb 30",
  group: "RT/SH 8bit",
  doc: "Shift left logical b",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.sll(z80.regs.b);
  },
});

// {n:49, x:0, y:6, z:1, p:3, q:0}
// $ROT $RZ
opcodes.set(0xcb31, {
  name: "SLL C",
  template: "$ROT $RZ",
  bytes: "cb 31",
  group: "RT/SH 8bit",
  doc: "Shift left logical c",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.sll(z80.regs.c);
  },
});

// {n:50, x:0, y:6, z:2, p:3, q:0}
// $ROT $RZ
opcodes.set(0xcb32, {
  name: "SLL D",
  template: "$ROT $RZ",
  bytes: "cb 32",
  group: "RT/SH 8bit",
  doc: "Shift left logical d",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.sll(z80.regs.d);
  },
});

// {n:51, x:0, y:6, z:3, p:3, q:0}
// $ROT $RZ
opcodes.set(0xcb33, {
  name: "SLL E",
  template: "$ROT $RZ",
  bytes: "cb 33",
  group: "RT/SH 8bit",
  doc: "Shift left logical e",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.sll(z80.regs.e);
  },
});

// {n:52, x:0, y:6, z:4, p:3, q:0}
// $ROT $RZ
opcodes.set(0xcb34, {
  name: "SLL H",
  template: "$ROT $RZ",
  bytes: "cb 34",
  group: "RT/SH 8bit",
  doc: "Shift left logical h",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.sll(z80.regs.h);
  },
});

// {n:53, x:0, y:6, z:5, p:3, q:0}
// $ROT $RZ
opcodes.set(0xcb35, {
  name: "SLL L",
  template: "$ROT $RZ",
  bytes: "cb 35",
  group: "RT/SH 8bit",
  doc: "Shift left logical l",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.sll(z80.regs.l);
  },
});

// {n:54, x:0, y:6, z:6, p:3, q:0}
// $ROT (HL)
opcodes.set(0xcb36, {
  name: "SLL (HL)",
  template: "$ROT (HL)",
  bytes: "cb 36",
  group: "RT/SH 8bit",
  doc: "Shift left logical (HL)",
  flags: "**0P0*",
  states: [8],
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
  name: "SLL A",
  template: "$ROT $RZ",
  bytes: "cb 37",
  group: "RT/SH 8bit",
  doc: "Shift left logical a",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.sll(z80.regs.a);
  },
});

// {n:56, x:0, y:7, z:0, p:3, q:1}
// $ROT $RZ
opcodes.set(0xcb38, {
  name: "SRL B",
  template: "$ROT $RZ",
  bytes: "cb 38",
  group: "RT/SH 8bit",
  doc: "Shift right logical b",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.b = z80.alu.srl(z80.regs.b);
  },
});

// {n:57, x:0, y:7, z:1, p:3, q:1}
// $ROT $RZ
opcodes.set(0xcb39, {
  name: "SRL C",
  template: "$ROT $RZ",
  bytes: "cb 39",
  group: "RT/SH 8bit",
  doc: "Shift right logical c",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.c = z80.alu.srl(z80.regs.c);
  },
});

// {n:58, x:0, y:7, z:2, p:3, q:1}
// $ROT $RZ
opcodes.set(0xcb3a, {
  name: "SRL D",
  template: "$ROT $RZ",
  bytes: "cb 3a",
  group: "RT/SH 8bit",
  doc: "Shift right logical d",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.d = z80.alu.srl(z80.regs.d);
  },
});

// {n:59, x:0, y:7, z:3, p:3, q:1}
// $ROT $RZ
opcodes.set(0xcb3b, {
  name: "SRL E",
  template: "$ROT $RZ",
  bytes: "cb 3b",
  group: "RT/SH 8bit",
  doc: "Shift right logical e",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.e = z80.alu.srl(z80.regs.e);
  },
});

// {n:60, x:0, y:7, z:4, p:3, q:1}
// $ROT $RZ
opcodes.set(0xcb3c, {
  name: "SRL H",
  template: "$ROT $RZ",
  bytes: "cb 3c",
  group: "RT/SH 8bit",
  doc: "Shift right logical h",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.h = z80.alu.srl(z80.regs.h);
  },
});

// {n:61, x:0, y:7, z:5, p:3, q:1}
// $ROT $RZ
opcodes.set(0xcb3d, {
  name: "SRL L",
  template: "$ROT $RZ",
  bytes: "cb 3d",
  group: "RT/SH 8bit",
  doc: "Shift right logical l",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.l = z80.alu.srl(z80.regs.l);
  },
});

// {n:62, x:0, y:7, z:6, p:3, q:1}
// $ROT (HL)
opcodes.set(0xcb3e, {
  name: "SRL (HL)",
  template: "$ROT (HL)",
  bytes: "cb 3e",
  group: "RT/SH 8bit",
  doc: "Shift right logical (HL)",
  flags: "**0P0*",
  states: [8],
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
  name: "SRL A",
  template: "$ROT $RZ",
  bytes: "cb 3f",
  group: "RT/SH 8bit",
  doc: "Shift right logical a",
  flags: "**0P0*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=$ROT($RZ)"}
    z80.regs.a = z80.alu.srl(z80.regs.a);
  },
});

// {n:64, x:1, y:0, z:0, p:0, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb40, {
  name: "BIT 0,B",
  template: "BIT $NY, $RZ",
  bytes: "cb 40",
  group: "Bits",
  doc: "f.Z = bit 0 in register b2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x1, z80.regs.b);
  },
});

// {n:65, x:1, y:0, z:1, p:0, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb41, {
  name: "BIT 0,C",
  template: "BIT $NY, $RZ",
  bytes: "cb 41",
  group: "Bits",
  doc: "f.Z = bit 0 in register c2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x1, z80.regs.c);
  },
});

// {n:66, x:1, y:0, z:2, p:0, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb42, {
  name: "BIT 0,D",
  template: "BIT $NY, $RZ",
  bytes: "cb 42",
  group: "Bits",
  doc: "f.Z = bit 0 in register d2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x1, z80.regs.d);
  },
});

// {n:67, x:1, y:0, z:3, p:0, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb43, {
  name: "BIT 0,E",
  template: "BIT $NY, $RZ",
  bytes: "cb 43",
  group: "Bits",
  doc: "f.Z = bit 0 in register e2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x1, z80.regs.e);
  },
});

// {n:68, x:1, y:0, z:4, p:0, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb44, {
  name: "BIT 0,H",
  template: "BIT $NY, $RZ",
  bytes: "cb 44",
  group: "Bits",
  doc: "f.Z = bit 0 in register h2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x1, z80.regs.h);
  },
});

// {n:69, x:1, y:0, z:5, p:0, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb45, {
  name: "BIT 0,L",
  template: "BIT $NY, $RZ",
  bytes: "cb 45",
  group: "Bits",
  doc: "f.Z = bit 0 in register l2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x1, z80.regs.l);
  },
});

// {n:70, x:1, y:0, z:6, p:0, q:0}
// BIT $NY, (HL)
opcodes.set(0xcb46, {
  name: "BIT 0,(HL)",
  template: "BIT $NY, (HL)",
  bytes: "cb 46",
  group: "Bits",
  doc: "f.Z = bit 0 of (HL)",
  flags: "**1*0-",
  states: [8],
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
  name: "BIT 0,A",
  template: "BIT $NY, $RZ",
  bytes: "cb 47",
  group: "Bits",
  doc: "f.Z = bit 0 in register a2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x1, z80.regs.a);
  },
});

// {n:72, x:1, y:1, z:0, p:0, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb48, {
  name: "BIT 1,B",
  template: "BIT $NY, $RZ",
  bytes: "cb 48",
  group: "Bits",
  doc: "f.Z = bit 1 in register b2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x2, z80.regs.b);
  },
});

// {n:73, x:1, y:1, z:1, p:0, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb49, {
  name: "BIT 1,C",
  template: "BIT $NY, $RZ",
  bytes: "cb 49",
  group: "Bits",
  doc: "f.Z = bit 1 in register c2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x2, z80.regs.c);
  },
});

// {n:74, x:1, y:1, z:2, p:0, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb4a, {
  name: "BIT 1,D",
  template: "BIT $NY, $RZ",
  bytes: "cb 4a",
  group: "Bits",
  doc: "f.Z = bit 1 in register d2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x2, z80.regs.d);
  },
});

// {n:75, x:1, y:1, z:3, p:0, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb4b, {
  name: "BIT 1,E",
  template: "BIT $NY, $RZ",
  bytes: "cb 4b",
  group: "Bits",
  doc: "f.Z = bit 1 in register e2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x2, z80.regs.e);
  },
});

// {n:76, x:1, y:1, z:4, p:0, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb4c, {
  name: "BIT 1,H",
  template: "BIT $NY, $RZ",
  bytes: "cb 4c",
  group: "Bits",
  doc: "f.Z = bit 1 in register h2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x2, z80.regs.h);
  },
});

// {n:77, x:1, y:1, z:5, p:0, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb4d, {
  name: "BIT 1,L",
  template: "BIT $NY, $RZ",
  bytes: "cb 4d",
  group: "Bits",
  doc: "f.Z = bit 1 in register l2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x2, z80.regs.l);
  },
});

// {n:78, x:1, y:1, z:6, p:0, q:1}
// BIT $NY, (HL)
opcodes.set(0xcb4e, {
  name: "BIT 1,(HL)",
  template: "BIT $NY, (HL)",
  bytes: "cb 4e",
  group: "Bits",
  doc: "f.Z = bit 1 of (HL)",
  flags: "**1*0-",
  states: [8],
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
  name: "BIT 1,A",
  template: "BIT $NY, $RZ",
  bytes: "cb 4f",
  group: "Bits",
  doc: "f.Z = bit 1 in register a2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x2, z80.regs.a);
  },
});

// {n:80, x:1, y:2, z:0, p:1, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb50, {
  name: "BIT 2,B",
  template: "BIT $NY, $RZ",
  bytes: "cb 50",
  group: "Bits",
  doc: "f.Z = bit 2 in register b2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x4, z80.regs.b);
  },
});

// {n:81, x:1, y:2, z:1, p:1, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb51, {
  name: "BIT 2,C",
  template: "BIT $NY, $RZ",
  bytes: "cb 51",
  group: "Bits",
  doc: "f.Z = bit 2 in register c2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x4, z80.regs.c);
  },
});

// {n:82, x:1, y:2, z:2, p:1, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb52, {
  name: "BIT 2,D",
  template: "BIT $NY, $RZ",
  bytes: "cb 52",
  group: "Bits",
  doc: "f.Z = bit 2 in register d2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x4, z80.regs.d);
  },
});

// {n:83, x:1, y:2, z:3, p:1, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb53, {
  name: "BIT 2,E",
  template: "BIT $NY, $RZ",
  bytes: "cb 53",
  group: "Bits",
  doc: "f.Z = bit 2 in register e2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x4, z80.regs.e);
  },
});

// {n:84, x:1, y:2, z:4, p:1, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb54, {
  name: "BIT 2,H",
  template: "BIT $NY, $RZ",
  bytes: "cb 54",
  group: "Bits",
  doc: "f.Z = bit 2 in register h2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x4, z80.regs.h);
  },
});

// {n:85, x:1, y:2, z:5, p:1, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb55, {
  name: "BIT 2,L",
  template: "BIT $NY, $RZ",
  bytes: "cb 55",
  group: "Bits",
  doc: "f.Z = bit 2 in register l2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x4, z80.regs.l);
  },
});

// {n:86, x:1, y:2, z:6, p:1, q:0}
// BIT $NY, (HL)
opcodes.set(0xcb56, {
  name: "BIT 2,(HL)",
  template: "BIT $NY, (HL)",
  bytes: "cb 56",
  group: "Bits",
  doc: "f.Z = bit 2 of (HL)",
  flags: "**1*0-",
  states: [8],
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
  name: "BIT 2,A",
  template: "BIT $NY, $RZ",
  bytes: "cb 57",
  group: "Bits",
  doc: "f.Z = bit 2 in register a2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x4, z80.regs.a);
  },
});

// {n:88, x:1, y:3, z:0, p:1, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb58, {
  name: "BIT 3,B",
  template: "BIT $NY, $RZ",
  bytes: "cb 58",
  group: "Bits",
  doc: "f.Z = bit 3 in register b2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x8, z80.regs.b);
  },
});

// {n:89, x:1, y:3, z:1, p:1, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb59, {
  name: "BIT 3,C",
  template: "BIT $NY, $RZ",
  bytes: "cb 59",
  group: "Bits",
  doc: "f.Z = bit 3 in register c2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x8, z80.regs.c);
  },
});

// {n:90, x:1, y:3, z:2, p:1, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb5a, {
  name: "BIT 3,D",
  template: "BIT $NY, $RZ",
  bytes: "cb 5a",
  group: "Bits",
  doc: "f.Z = bit 3 in register d2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x8, z80.regs.d);
  },
});

// {n:91, x:1, y:3, z:3, p:1, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb5b, {
  name: "BIT 3,E",
  template: "BIT $NY, $RZ",
  bytes: "cb 5b",
  group: "Bits",
  doc: "f.Z = bit 3 in register e2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x8, z80.regs.e);
  },
});

// {n:92, x:1, y:3, z:4, p:1, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb5c, {
  name: "BIT 3,H",
  template: "BIT $NY, $RZ",
  bytes: "cb 5c",
  group: "Bits",
  doc: "f.Z = bit 3 in register h2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x8, z80.regs.h);
  },
});

// {n:93, x:1, y:3, z:5, p:1, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb5d, {
  name: "BIT 3,L",
  template: "BIT $NY, $RZ",
  bytes: "cb 5d",
  group: "Bits",
  doc: "f.Z = bit 3 in register l2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x8, z80.regs.l);
  },
});

// {n:94, x:1, y:3, z:6, p:1, q:1}
// BIT $NY, (HL)
opcodes.set(0xcb5e, {
  name: "BIT 3,(HL)",
  template: "BIT $NY, (HL)",
  bytes: "cb 5e",
  group: "Bits",
  doc: "f.Z = bit 3 of (HL)",
  flags: "**1*0-",
  states: [8],
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
  name: "BIT 3,A",
  template: "BIT $NY, $RZ",
  bytes: "cb 5f",
  group: "Bits",
  doc: "f.Z = bit 3 in register a2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x8, z80.regs.a);
  },
});

// {n:96, x:1, y:4, z:0, p:2, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb60, {
  name: "BIT 4,B",
  template: "BIT $NY, $RZ",
  bytes: "cb 60",
  group: "Bits",
  doc: "f.Z = bit 4 in register b2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x10, z80.regs.b);
  },
});

// {n:97, x:1, y:4, z:1, p:2, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb61, {
  name: "BIT 4,C",
  template: "BIT $NY, $RZ",
  bytes: "cb 61",
  group: "Bits",
  doc: "f.Z = bit 4 in register c2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x10, z80.regs.c);
  },
});

// {n:98, x:1, y:4, z:2, p:2, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb62, {
  name: "BIT 4,D",
  template: "BIT $NY, $RZ",
  bytes: "cb 62",
  group: "Bits",
  doc: "f.Z = bit 4 in register d2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x10, z80.regs.d);
  },
});

// {n:99, x:1, y:4, z:3, p:2, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb63, {
  name: "BIT 4,E",
  template: "BIT $NY, $RZ",
  bytes: "cb 63",
  group: "Bits",
  doc: "f.Z = bit 4 in register e2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x10, z80.regs.e);
  },
});

// {n:100, x:1, y:4, z:4, p:2, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb64, {
  name: "BIT 4,H",
  template: "BIT $NY, $RZ",
  bytes: "cb 64",
  group: "Bits",
  doc: "f.Z = bit 4 in register h2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x10, z80.regs.h);
  },
});

// {n:101, x:1, y:4, z:5, p:2, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb65, {
  name: "BIT 4,L",
  template: "BIT $NY, $RZ",
  bytes: "cb 65",
  group: "Bits",
  doc: "f.Z = bit 4 in register l2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x10, z80.regs.l);
  },
});

// {n:102, x:1, y:4, z:6, p:2, q:0}
// BIT $NY, (HL)
opcodes.set(0xcb66, {
  name: "BIT 4,(HL)",
  template: "BIT $NY, (HL)",
  bytes: "cb 66",
  group: "Bits",
  doc: "f.Z = bit 4 of (HL)",
  flags: "**1*0-",
  states: [8],
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
  name: "BIT 4,A",
  template: "BIT $NY, $RZ",
  bytes: "cb 67",
  group: "Bits",
  doc: "f.Z = bit 4 in register a2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x10, z80.regs.a);
  },
});

// {n:104, x:1, y:5, z:0, p:2, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb68, {
  name: "BIT 5,B",
  template: "BIT $NY, $RZ",
  bytes: "cb 68",
  group: "Bits",
  doc: "f.Z = bit 5 in register b2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x20, z80.regs.b);
  },
});

// {n:105, x:1, y:5, z:1, p:2, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb69, {
  name: "BIT 5,C",
  template: "BIT $NY, $RZ",
  bytes: "cb 69",
  group: "Bits",
  doc: "f.Z = bit 5 in register c2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x20, z80.regs.c);
  },
});

// {n:106, x:1, y:5, z:2, p:2, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb6a, {
  name: "BIT 5,D",
  template: "BIT $NY, $RZ",
  bytes: "cb 6a",
  group: "Bits",
  doc: "f.Z = bit 5 in register d2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x20, z80.regs.d);
  },
});

// {n:107, x:1, y:5, z:3, p:2, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb6b, {
  name: "BIT 5,E",
  template: "BIT $NY, $RZ",
  bytes: "cb 6b",
  group: "Bits",
  doc: "f.Z = bit 5 in register e2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x20, z80.regs.e);
  },
});

// {n:108, x:1, y:5, z:4, p:2, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb6c, {
  name: "BIT 5,H",
  template: "BIT $NY, $RZ",
  bytes: "cb 6c",
  group: "Bits",
  doc: "f.Z = bit 5 in register h2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x20, z80.regs.h);
  },
});

// {n:109, x:1, y:5, z:5, p:2, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb6d, {
  name: "BIT 5,L",
  template: "BIT $NY, $RZ",
  bytes: "cb 6d",
  group: "Bits",
  doc: "f.Z = bit 5 in register l2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x20, z80.regs.l);
  },
});

// {n:110, x:1, y:5, z:6, p:2, q:1}
// BIT $NY, (HL)
opcodes.set(0xcb6e, {
  name: "BIT 5,(HL)",
  template: "BIT $NY, (HL)",
  bytes: "cb 6e",
  group: "Bits",
  doc: "f.Z = bit 5 of (HL)",
  flags: "**1*0-",
  states: [8],
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
  name: "BIT 5,A",
  template: "BIT $NY, $RZ",
  bytes: "cb 6f",
  group: "Bits",
  doc: "f.Z = bit 5 in register a2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x20, z80.regs.a);
  },
});

// {n:112, x:1, y:6, z:0, p:3, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb70, {
  name: "BIT 6,B",
  template: "BIT $NY, $RZ",
  bytes: "cb 70",
  group: "Bits",
  doc: "f.Z = bit 6 in register b2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x40, z80.regs.b);
  },
});

// {n:113, x:1, y:6, z:1, p:3, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb71, {
  name: "BIT 6,C",
  template: "BIT $NY, $RZ",
  bytes: "cb 71",
  group: "Bits",
  doc: "f.Z = bit 6 in register c2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x40, z80.regs.c);
  },
});

// {n:114, x:1, y:6, z:2, p:3, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb72, {
  name: "BIT 6,D",
  template: "BIT $NY, $RZ",
  bytes: "cb 72",
  group: "Bits",
  doc: "f.Z = bit 6 in register d2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x40, z80.regs.d);
  },
});

// {n:115, x:1, y:6, z:3, p:3, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb73, {
  name: "BIT 6,E",
  template: "BIT $NY, $RZ",
  bytes: "cb 73",
  group: "Bits",
  doc: "f.Z = bit 6 in register e2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x40, z80.regs.e);
  },
});

// {n:116, x:1, y:6, z:4, p:3, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb74, {
  name: "BIT 6,H",
  template: "BIT $NY, $RZ",
  bytes: "cb 74",
  group: "Bits",
  doc: "f.Z = bit 6 in register h2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x40, z80.regs.h);
  },
});

// {n:117, x:1, y:6, z:5, p:3, q:0}
// BIT $NY, $RZ
opcodes.set(0xcb75, {
  name: "BIT 6,L",
  template: "BIT $NY, $RZ",
  bytes: "cb 75",
  group: "Bits",
  doc: "f.Z = bit 6 in register l2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x40, z80.regs.l);
  },
});

// {n:118, x:1, y:6, z:6, p:3, q:0}
// BIT $NY, (HL)
opcodes.set(0xcb76, {
  name: "BIT 6,(HL)",
  template: "BIT $NY, (HL)",
  bytes: "cb 76",
  group: "Bits",
  doc: "f.Z = bit 6 of (HL)",
  flags: "**1*0-",
  states: [8],
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
  name: "BIT 6,A",
  template: "BIT $NY, $RZ",
  bytes: "cb 77",
  group: "Bits",
  doc: "f.Z = bit 6 in register a2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x40, z80.regs.a);
  },
});

// {n:120, x:1, y:7, z:0, p:3, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb78, {
  name: "BIT 7,B",
  template: "BIT $NY, $RZ",
  bytes: "cb 78",
  group: "Bits",
  doc: "f.Z = bit 7 in register b2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x80, z80.regs.b);
  },
});

// {n:121, x:1, y:7, z:1, p:3, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb79, {
  name: "BIT 7,C",
  template: "BIT $NY, $RZ",
  bytes: "cb 79",
  group: "Bits",
  doc: "f.Z = bit 7 in register c2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x80, z80.regs.c);
  },
});

// {n:122, x:1, y:7, z:2, p:3, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb7a, {
  name: "BIT 7,D",
  template: "BIT $NY, $RZ",
  bytes: "cb 7a",
  group: "Bits",
  doc: "f.Z = bit 7 in register d2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x80, z80.regs.d);
  },
});

// {n:123, x:1, y:7, z:3, p:3, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb7b, {
  name: "BIT 7,E",
  template: "BIT $NY, $RZ",
  bytes: "cb 7b",
  group: "Bits",
  doc: "f.Z = bit 7 in register e2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x80, z80.regs.e);
  },
});

// {n:124, x:1, y:7, z:4, p:3, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb7c, {
  name: "BIT 7,H",
  template: "BIT $NY, $RZ",
  bytes: "cb 7c",
  group: "Bits",
  doc: "f.Z = bit 7 in register h2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x80, z80.regs.h);
  },
});

// {n:125, x:1, y:7, z:5, p:3, q:1}
// BIT $NY, $RZ
opcodes.set(0xcb7d, {
  name: "BIT 7,L",
  template: "BIT $NY, $RZ",
  bytes: "cb 7d",
  group: "Bits",
  doc: "f.Z = bit 7 in register l2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x80, z80.regs.l);
  },
});

// {n:126, x:1, y:7, z:6, p:3, q:1}
// BIT $NY, (HL)
opcodes.set(0xcb7e, {
  name: "BIT 7,(HL)",
  template: "BIT $NY, (HL)",
  bytes: "cb 7e",
  group: "Bits",
  doc: "f.Z = bit 7 of (HL)",
  flags: "**1*0-",
  states: [8],
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
  name: "BIT 7,A",
  template: "BIT $NY, $RZ",
  bytes: "cb 7f",
  group: "Bits",
  doc: "f.Z = bit 7 in register a2",
  flags: "**1*0-",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.bit($BITY, $RZ)"}
    z80.alu.bit(0x80, z80.regs.a);
  },
});

// {n:128, x:2, y:0, z:0, p:0, q:0}
// RES $NY, $RZ
opcodes.set(0xcb80, {
  name: "RES 0,B",
  template: "RES $NY, $RZ",
  bytes: "cb 80",
  group: "Bits",
  doc: "Reset bit 0 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(0, z80.regs.b);
  },
});

// {n:129, x:2, y:0, z:1, p:0, q:0}
// RES $NY, $RZ
opcodes.set(0xcb81, {
  name: "RES 0,C",
  template: "RES $NY, $RZ",
  bytes: "cb 81",
  group: "Bits",
  doc: "Reset bit 0 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(0, z80.regs.c);
  },
});

// {n:130, x:2, y:0, z:2, p:0, q:0}
// RES $NY, $RZ
opcodes.set(0xcb82, {
  name: "RES 0,D",
  template: "RES $NY, $RZ",
  bytes: "cb 82",
  group: "Bits",
  doc: "Reset bit 0 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(0, z80.regs.d);
  },
});

// {n:131, x:2, y:0, z:3, p:0, q:0}
// RES $NY, $RZ
opcodes.set(0xcb83, {
  name: "RES 0,E",
  template: "RES $NY, $RZ",
  bytes: "cb 83",
  group: "Bits",
  doc: "Reset bit 0 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(0, z80.regs.e);
  },
});

// {n:132, x:2, y:0, z:4, p:0, q:0}
// RES $NY, $RZ
opcodes.set(0xcb84, {
  name: "RES 0,H",
  template: "RES $NY, $RZ",
  bytes: "cb 84",
  group: "Bits",
  doc: "Reset bit 0 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(0, z80.regs.h);
  },
});

// {n:133, x:2, y:0, z:5, p:0, q:0}
// RES $NY, $RZ
opcodes.set(0xcb85, {
  name: "RES 0,L",
  template: "RES $NY, $RZ",
  bytes: "cb 85",
  group: "Bits",
  doc: "Reset bit 0 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(0, z80.regs.l);
  },
});

// {n:134, x:2, y:0, z:6, p:0, q:0}
// RES $NY, (HL)
opcodes.set(0xcb86, {
  name: "RES 0,(HL)",
  template: "RES $NY, (HL)",
  bytes: "cb 86",
  group: "Bits",
  doc: "Reset bit 0 of (HL)",
  states: [15],
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
  name: "RES 0,A",
  template: "RES $NY, $RZ",
  bytes: "cb 87",
  group: "Bits",
  doc: "Reset bit 0 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(0, z80.regs.a);
  },
});

// {n:136, x:2, y:1, z:0, p:0, q:1}
// RES $NY, $RZ
opcodes.set(0xcb88, {
  name: "RES 1,B",
  template: "RES $NY, $RZ",
  bytes: "cb 88",
  group: "Bits",
  doc: "Reset bit 1 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(1, z80.regs.b);
  },
});

// {n:137, x:2, y:1, z:1, p:0, q:1}
// RES $NY, $RZ
opcodes.set(0xcb89, {
  name: "RES 1,C",
  template: "RES $NY, $RZ",
  bytes: "cb 89",
  group: "Bits",
  doc: "Reset bit 1 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(1, z80.regs.c);
  },
});

// {n:138, x:2, y:1, z:2, p:0, q:1}
// RES $NY, $RZ
opcodes.set(0xcb8a, {
  name: "RES 1,D",
  template: "RES $NY, $RZ",
  bytes: "cb 8a",
  group: "Bits",
  doc: "Reset bit 1 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(1, z80.regs.d);
  },
});

// {n:139, x:2, y:1, z:3, p:0, q:1}
// RES $NY, $RZ
opcodes.set(0xcb8b, {
  name: "RES 1,E",
  template: "RES $NY, $RZ",
  bytes: "cb 8b",
  group: "Bits",
  doc: "Reset bit 1 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(1, z80.regs.e);
  },
});

// {n:140, x:2, y:1, z:4, p:0, q:1}
// RES $NY, $RZ
opcodes.set(0xcb8c, {
  name: "RES 1,H",
  template: "RES $NY, $RZ",
  bytes: "cb 8c",
  group: "Bits",
  doc: "Reset bit 1 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(1, z80.regs.h);
  },
});

// {n:141, x:2, y:1, z:5, p:0, q:1}
// RES $NY, $RZ
opcodes.set(0xcb8d, {
  name: "RES 1,L",
  template: "RES $NY, $RZ",
  bytes: "cb 8d",
  group: "Bits",
  doc: "Reset bit 1 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(1, z80.regs.l);
  },
});

// {n:142, x:2, y:1, z:6, p:0, q:1}
// RES $NY, (HL)
opcodes.set(0xcb8e, {
  name: "RES 1,(HL)",
  template: "RES $NY, (HL)",
  bytes: "cb 8e",
  group: "Bits",
  doc: "Reset bit 1 of (HL)",
  states: [15],
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
  name: "RES 1,A",
  template: "RES $NY, $RZ",
  bytes: "cb 8f",
  group: "Bits",
  doc: "Reset bit 1 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(1, z80.regs.a);
  },
});

// {n:144, x:2, y:2, z:0, p:1, q:0}
// RES $NY, $RZ
opcodes.set(0xcb90, {
  name: "RES 2,B",
  template: "RES $NY, $RZ",
  bytes: "cb 90",
  group: "Bits",
  doc: "Reset bit 2 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(2, z80.regs.b);
  },
});

// {n:145, x:2, y:2, z:1, p:1, q:0}
// RES $NY, $RZ
opcodes.set(0xcb91, {
  name: "RES 2,C",
  template: "RES $NY, $RZ",
  bytes: "cb 91",
  group: "Bits",
  doc: "Reset bit 2 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(2, z80.regs.c);
  },
});

// {n:146, x:2, y:2, z:2, p:1, q:0}
// RES $NY, $RZ
opcodes.set(0xcb92, {
  name: "RES 2,D",
  template: "RES $NY, $RZ",
  bytes: "cb 92",
  group: "Bits",
  doc: "Reset bit 2 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(2, z80.regs.d);
  },
});

// {n:147, x:2, y:2, z:3, p:1, q:0}
// RES $NY, $RZ
opcodes.set(0xcb93, {
  name: "RES 2,E",
  template: "RES $NY, $RZ",
  bytes: "cb 93",
  group: "Bits",
  doc: "Reset bit 2 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(2, z80.regs.e);
  },
});

// {n:148, x:2, y:2, z:4, p:1, q:0}
// RES $NY, $RZ
opcodes.set(0xcb94, {
  name: "RES 2,H",
  template: "RES $NY, $RZ",
  bytes: "cb 94",
  group: "Bits",
  doc: "Reset bit 2 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(2, z80.regs.h);
  },
});

// {n:149, x:2, y:2, z:5, p:1, q:0}
// RES $NY, $RZ
opcodes.set(0xcb95, {
  name: "RES 2,L",
  template: "RES $NY, $RZ",
  bytes: "cb 95",
  group: "Bits",
  doc: "Reset bit 2 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(2, z80.regs.l);
  },
});

// {n:150, x:2, y:2, z:6, p:1, q:0}
// RES $NY, (HL)
opcodes.set(0xcb96, {
  name: "RES 2,(HL)",
  template: "RES $NY, (HL)",
  bytes: "cb 96",
  group: "Bits",
  doc: "Reset bit 2 of (HL)",
  states: [15],
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
  name: "RES 2,A",
  template: "RES $NY, $RZ",
  bytes: "cb 97",
  group: "Bits",
  doc: "Reset bit 2 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(2, z80.regs.a);
  },
});

// {n:152, x:2, y:3, z:0, p:1, q:1}
// RES $NY, $RZ
opcodes.set(0xcb98, {
  name: "RES 3,B",
  template: "RES $NY, $RZ",
  bytes: "cb 98",
  group: "Bits",
  doc: "Reset bit 3 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(3, z80.regs.b);
  },
});

// {n:153, x:2, y:3, z:1, p:1, q:1}
// RES $NY, $RZ
opcodes.set(0xcb99, {
  name: "RES 3,C",
  template: "RES $NY, $RZ",
  bytes: "cb 99",
  group: "Bits",
  doc: "Reset bit 3 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(3, z80.regs.c);
  },
});

// {n:154, x:2, y:3, z:2, p:1, q:1}
// RES $NY, $RZ
opcodes.set(0xcb9a, {
  name: "RES 3,D",
  template: "RES $NY, $RZ",
  bytes: "cb 9a",
  group: "Bits",
  doc: "Reset bit 3 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(3, z80.regs.d);
  },
});

// {n:155, x:2, y:3, z:3, p:1, q:1}
// RES $NY, $RZ
opcodes.set(0xcb9b, {
  name: "RES 3,E",
  template: "RES $NY, $RZ",
  bytes: "cb 9b",
  group: "Bits",
  doc: "Reset bit 3 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(3, z80.regs.e);
  },
});

// {n:156, x:2, y:3, z:4, p:1, q:1}
// RES $NY, $RZ
opcodes.set(0xcb9c, {
  name: "RES 3,H",
  template: "RES $NY, $RZ",
  bytes: "cb 9c",
  group: "Bits",
  doc: "Reset bit 3 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(3, z80.regs.h);
  },
});

// {n:157, x:2, y:3, z:5, p:1, q:1}
// RES $NY, $RZ
opcodes.set(0xcb9d, {
  name: "RES 3,L",
  template: "RES $NY, $RZ",
  bytes: "cb 9d",
  group: "Bits",
  doc: "Reset bit 3 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(3, z80.regs.l);
  },
});

// {n:158, x:2, y:3, z:6, p:1, q:1}
// RES $NY, (HL)
opcodes.set(0xcb9e, {
  name: "RES 3,(HL)",
  template: "RES $NY, (HL)",
  bytes: "cb 9e",
  group: "Bits",
  doc: "Reset bit 3 of (HL)",
  states: [15],
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
  name: "RES 3,A",
  template: "RES $NY, $RZ",
  bytes: "cb 9f",
  group: "Bits",
  doc: "Reset bit 3 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(3, z80.regs.a);
  },
});

// {n:160, x:2, y:4, z:0, p:2, q:0}
// RES $NY, $RZ
opcodes.set(0xcba0, {
  name: "RES 4,B",
  template: "RES $NY, $RZ",
  bytes: "cb a0",
  group: "Bits",
  doc: "Reset bit 4 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(4, z80.regs.b);
  },
});

// {n:161, x:2, y:4, z:1, p:2, q:0}
// RES $NY, $RZ
opcodes.set(0xcba1, {
  name: "RES 4,C",
  template: "RES $NY, $RZ",
  bytes: "cb a1",
  group: "Bits",
  doc: "Reset bit 4 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(4, z80.regs.c);
  },
});

// {n:162, x:2, y:4, z:2, p:2, q:0}
// RES $NY, $RZ
opcodes.set(0xcba2, {
  name: "RES 4,D",
  template: "RES $NY, $RZ",
  bytes: "cb a2",
  group: "Bits",
  doc: "Reset bit 4 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(4, z80.regs.d);
  },
});

// {n:163, x:2, y:4, z:3, p:2, q:0}
// RES $NY, $RZ
opcodes.set(0xcba3, {
  name: "RES 4,E",
  template: "RES $NY, $RZ",
  bytes: "cb a3",
  group: "Bits",
  doc: "Reset bit 4 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(4, z80.regs.e);
  },
});

// {n:164, x:2, y:4, z:4, p:2, q:0}
// RES $NY, $RZ
opcodes.set(0xcba4, {
  name: "RES 4,H",
  template: "RES $NY, $RZ",
  bytes: "cb a4",
  group: "Bits",
  doc: "Reset bit 4 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(4, z80.regs.h);
  },
});

// {n:165, x:2, y:4, z:5, p:2, q:0}
// RES $NY, $RZ
opcodes.set(0xcba5, {
  name: "RES 4,L",
  template: "RES $NY, $RZ",
  bytes: "cb a5",
  group: "Bits",
  doc: "Reset bit 4 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(4, z80.regs.l);
  },
});

// {n:166, x:2, y:4, z:6, p:2, q:0}
// RES $NY, (HL)
opcodes.set(0xcba6, {
  name: "RES 4,(HL)",
  template: "RES $NY, (HL)",
  bytes: "cb a6",
  group: "Bits",
  doc: "Reset bit 4 of (HL)",
  states: [15],
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
  name: "RES 4,A",
  template: "RES $NY, $RZ",
  bytes: "cb a7",
  group: "Bits",
  doc: "Reset bit 4 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(4, z80.regs.a);
  },
});

// {n:168, x:2, y:5, z:0, p:2, q:1}
// RES $NY, $RZ
opcodes.set(0xcba8, {
  name: "RES 5,B",
  template: "RES $NY, $RZ",
  bytes: "cb a8",
  group: "Bits",
  doc: "Reset bit 5 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(5, z80.regs.b);
  },
});

// {n:169, x:2, y:5, z:1, p:2, q:1}
// RES $NY, $RZ
opcodes.set(0xcba9, {
  name: "RES 5,C",
  template: "RES $NY, $RZ",
  bytes: "cb a9",
  group: "Bits",
  doc: "Reset bit 5 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(5, z80.regs.c);
  },
});

// {n:170, x:2, y:5, z:2, p:2, q:1}
// RES $NY, $RZ
opcodes.set(0xcbaa, {
  name: "RES 5,D",
  template: "RES $NY, $RZ",
  bytes: "cb aa",
  group: "Bits",
  doc: "Reset bit 5 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(5, z80.regs.d);
  },
});

// {n:171, x:2, y:5, z:3, p:2, q:1}
// RES $NY, $RZ
opcodes.set(0xcbab, {
  name: "RES 5,E",
  template: "RES $NY, $RZ",
  bytes: "cb ab",
  group: "Bits",
  doc: "Reset bit 5 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(5, z80.regs.e);
  },
});

// {n:172, x:2, y:5, z:4, p:2, q:1}
// RES $NY, $RZ
opcodes.set(0xcbac, {
  name: "RES 5,H",
  template: "RES $NY, $RZ",
  bytes: "cb ac",
  group: "Bits",
  doc: "Reset bit 5 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(5, z80.regs.h);
  },
});

// {n:173, x:2, y:5, z:5, p:2, q:1}
// RES $NY, $RZ
opcodes.set(0xcbad, {
  name: "RES 5,L",
  template: "RES $NY, $RZ",
  bytes: "cb ad",
  group: "Bits",
  doc: "Reset bit 5 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(5, z80.regs.l);
  },
});

// {n:174, x:2, y:5, z:6, p:2, q:1}
// RES $NY, (HL)
opcodes.set(0xcbae, {
  name: "RES 5,(HL)",
  template: "RES $NY, (HL)",
  bytes: "cb ae",
  group: "Bits",
  doc: "Reset bit 5 of (HL)",
  states: [15],
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
  name: "RES 5,A",
  template: "RES $NY, $RZ",
  bytes: "cb af",
  group: "Bits",
  doc: "Reset bit 5 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(5, z80.regs.a);
  },
});

// {n:176, x:2, y:6, z:0, p:3, q:0}
// RES $NY, $RZ
opcodes.set(0xcbb0, {
  name: "RES 6,B",
  template: "RES $NY, $RZ",
  bytes: "cb b0",
  group: "Bits",
  doc: "Reset bit 6 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(6, z80.regs.b);
  },
});

// {n:177, x:2, y:6, z:1, p:3, q:0}
// RES $NY, $RZ
opcodes.set(0xcbb1, {
  name: "RES 6,C",
  template: "RES $NY, $RZ",
  bytes: "cb b1",
  group: "Bits",
  doc: "Reset bit 6 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(6, z80.regs.c);
  },
});

// {n:178, x:2, y:6, z:2, p:3, q:0}
// RES $NY, $RZ
opcodes.set(0xcbb2, {
  name: "RES 6,D",
  template: "RES $NY, $RZ",
  bytes: "cb b2",
  group: "Bits",
  doc: "Reset bit 6 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(6, z80.regs.d);
  },
});

// {n:179, x:2, y:6, z:3, p:3, q:0}
// RES $NY, $RZ
opcodes.set(0xcbb3, {
  name: "RES 6,E",
  template: "RES $NY, $RZ",
  bytes: "cb b3",
  group: "Bits",
  doc: "Reset bit 6 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(6, z80.regs.e);
  },
});

// {n:180, x:2, y:6, z:4, p:3, q:0}
// RES $NY, $RZ
opcodes.set(0xcbb4, {
  name: "RES 6,H",
  template: "RES $NY, $RZ",
  bytes: "cb b4",
  group: "Bits",
  doc: "Reset bit 6 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(6, z80.regs.h);
  },
});

// {n:181, x:2, y:6, z:5, p:3, q:0}
// RES $NY, $RZ
opcodes.set(0xcbb5, {
  name: "RES 6,L",
  template: "RES $NY, $RZ",
  bytes: "cb b5",
  group: "Bits",
  doc: "Reset bit 6 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(6, z80.regs.l);
  },
});

// {n:182, x:2, y:6, z:6, p:3, q:0}
// RES $NY, (HL)
opcodes.set(0xcbb6, {
  name: "RES 6,(HL)",
  template: "RES $NY, (HL)",
  bytes: "cb b6",
  group: "Bits",
  doc: "Reset bit 6 of (HL)",
  states: [15],
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
  name: "RES 6,A",
  template: "RES $NY, $RZ",
  bytes: "cb b7",
  group: "Bits",
  doc: "Reset bit 6 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(6, z80.regs.a);
  },
});

// {n:184, x:2, y:7, z:0, p:3, q:1}
// RES $NY, $RZ
opcodes.set(0xcbb8, {
  name: "RES 7,B",
  template: "RES $NY, $RZ",
  bytes: "cb b8",
  group: "Bits",
  doc: "Reset bit 7 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.b = z80.alu.res(7, z80.regs.b);
  },
});

// {n:185, x:2, y:7, z:1, p:3, q:1}
// RES $NY, $RZ
opcodes.set(0xcbb9, {
  name: "RES 7,C",
  template: "RES $NY, $RZ",
  bytes: "cb b9",
  group: "Bits",
  doc: "Reset bit 7 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.c = z80.alu.res(7, z80.regs.c);
  },
});

// {n:186, x:2, y:7, z:2, p:3, q:1}
// RES $NY, $RZ
opcodes.set(0xcbba, {
  name: "RES 7,D",
  template: "RES $NY, $RZ",
  bytes: "cb ba",
  group: "Bits",
  doc: "Reset bit 7 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.d = z80.alu.res(7, z80.regs.d);
  },
});

// {n:187, x:2, y:7, z:3, p:3, q:1}
// RES $NY, $RZ
opcodes.set(0xcbbb, {
  name: "RES 7,E",
  template: "RES $NY, $RZ",
  bytes: "cb bb",
  group: "Bits",
  doc: "Reset bit 7 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.e = z80.alu.res(7, z80.regs.e);
  },
});

// {n:188, x:2, y:7, z:4, p:3, q:1}
// RES $NY, $RZ
opcodes.set(0xcbbc, {
  name: "RES 7,H",
  template: "RES $NY, $RZ",
  bytes: "cb bc",
  group: "Bits",
  doc: "Reset bit 7 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.h = z80.alu.res(7, z80.regs.h);
  },
});

// {n:189, x:2, y:7, z:5, p:3, q:1}
// RES $NY, $RZ
opcodes.set(0xcbbd, {
  name: "RES 7,L",
  template: "RES $NY, $RZ",
  bytes: "cb bd",
  group: "Bits",
  doc: "Reset bit 7 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.l = z80.alu.res(7, z80.regs.l);
  },
});

// {n:190, x:2, y:7, z:6, p:3, q:1}
// RES $NY, (HL)
opcodes.set(0xcbbe, {
  name: "RES 7,(HL)",
  template: "RES $NY, (HL)",
  bytes: "cb be",
  group: "Bits",
  doc: "Reset bit 7 of (HL)",
  states: [15],
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
  name: "RES 7,A",
  template: "RES $NY, $RZ",
  bytes: "cb bf",
  group: "Bits",
  doc: "Reset bit 7 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.res($NY, $RZ)"}
    z80.regs.a = z80.alu.res(7, z80.regs.a);
  },
});

// {n:192, x:3, y:0, z:0, p:0, q:0}
// SET $NY, $RZ
opcodes.set(0xcbc0, {
  name: "SET 0,B",
  template: "SET $NY, $RZ",
  bytes: "cb c0",
  group: "Bits",
  doc: "Set bit 0 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(0, z80.regs.b);
  },
});

// {n:193, x:3, y:0, z:1, p:0, q:0}
// SET $NY, $RZ
opcodes.set(0xcbc1, {
  name: "SET 0,C",
  template: "SET $NY, $RZ",
  bytes: "cb c1",
  group: "Bits",
  doc: "Set bit 0 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(0, z80.regs.c);
  },
});

// {n:194, x:3, y:0, z:2, p:0, q:0}
// SET $NY, $RZ
opcodes.set(0xcbc2, {
  name: "SET 0,D",
  template: "SET $NY, $RZ",
  bytes: "cb c2",
  group: "Bits",
  doc: "Set bit 0 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(0, z80.regs.d);
  },
});

// {n:195, x:3, y:0, z:3, p:0, q:0}
// SET $NY, $RZ
opcodes.set(0xcbc3, {
  name: "SET 0,E",
  template: "SET $NY, $RZ",
  bytes: "cb c3",
  group: "Bits",
  doc: "Set bit 0 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(0, z80.regs.e);
  },
});

// {n:196, x:3, y:0, z:4, p:0, q:0}
// SET $NY, $RZ
opcodes.set(0xcbc4, {
  name: "SET 0,H",
  template: "SET $NY, $RZ",
  bytes: "cb c4",
  group: "Bits",
  doc: "Set bit 0 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(0, z80.regs.h);
  },
});

// {n:197, x:3, y:0, z:5, p:0, q:0}
// SET $NY, $RZ
opcodes.set(0xcbc5, {
  name: "SET 0,L",
  template: "SET $NY, $RZ",
  bytes: "cb c5",
  group: "Bits",
  doc: "Set bit 0 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(0, z80.regs.l);
  },
});

// {n:198, x:3, y:0, z:6, p:0, q:0}
// SET $NY, (HL)
opcodes.set(0xcbc6, {
  name: "SET 0,(HL)",
  template: "SET $NY, (HL)",
  bytes: "cb c6",
  group: "Bits",
  doc: "Set bit 0 of (HL)",
  states: [15],
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
  name: "SET 0,A",
  template: "SET $NY, $RZ",
  bytes: "cb c7",
  group: "Bits",
  doc: "Set bit 0 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(0, z80.regs.a);
  },
});

// {n:200, x:3, y:1, z:0, p:0, q:1}
// SET $NY, $RZ
opcodes.set(0xcbc8, {
  name: "SET 1,B",
  template: "SET $NY, $RZ",
  bytes: "cb c8",
  group: "Bits",
  doc: "Set bit 1 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(1, z80.regs.b);
  },
});

// {n:201, x:3, y:1, z:1, p:0, q:1}
// SET $NY, $RZ
opcodes.set(0xcbc9, {
  name: "SET 1,C",
  template: "SET $NY, $RZ",
  bytes: "cb c9",
  group: "Bits",
  doc: "Set bit 1 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(1, z80.regs.c);
  },
});

// {n:202, x:3, y:1, z:2, p:0, q:1}
// SET $NY, $RZ
opcodes.set(0xcbca, {
  name: "SET 1,D",
  template: "SET $NY, $RZ",
  bytes: "cb ca",
  group: "Bits",
  doc: "Set bit 1 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(1, z80.regs.d);
  },
});

// {n:203, x:3, y:1, z:3, p:0, q:1}
// SET $NY, $RZ
opcodes.set(0xcbcb, {
  name: "SET 1,E",
  template: "SET $NY, $RZ",
  bytes: "cb cb",
  group: "Bits",
  doc: "Set bit 1 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(1, z80.regs.e);
  },
});

// {n:204, x:3, y:1, z:4, p:0, q:1}
// SET $NY, $RZ
opcodes.set(0xcbcc, {
  name: "SET 1,H",
  template: "SET $NY, $RZ",
  bytes: "cb cc",
  group: "Bits",
  doc: "Set bit 1 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(1, z80.regs.h);
  },
});

// {n:205, x:3, y:1, z:5, p:0, q:1}
// SET $NY, $RZ
opcodes.set(0xcbcd, {
  name: "SET 1,L",
  template: "SET $NY, $RZ",
  bytes: "cb cd",
  group: "Bits",
  doc: "Set bit 1 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(1, z80.regs.l);
  },
});

// {n:206, x:3, y:1, z:6, p:0, q:1}
// SET $NY, (HL)
opcodes.set(0xcbce, {
  name: "SET 1,(HL)",
  template: "SET $NY, (HL)",
  bytes: "cb ce",
  group: "Bits",
  doc: "Set bit 1 of (HL)",
  states: [15],
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
  name: "SET 1,A",
  template: "SET $NY, $RZ",
  bytes: "cb cf",
  group: "Bits",
  doc: "Set bit 1 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(1, z80.regs.a);
  },
});

// {n:208, x:3, y:2, z:0, p:1, q:0}
// SET $NY, $RZ
opcodes.set(0xcbd0, {
  name: "SET 2,B",
  template: "SET $NY, $RZ",
  bytes: "cb d0",
  group: "Bits",
  doc: "Set bit 2 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(2, z80.regs.b);
  },
});

// {n:209, x:3, y:2, z:1, p:1, q:0}
// SET $NY, $RZ
opcodes.set(0xcbd1, {
  name: "SET 2,C",
  template: "SET $NY, $RZ",
  bytes: "cb d1",
  group: "Bits",
  doc: "Set bit 2 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(2, z80.regs.c);
  },
});

// {n:210, x:3, y:2, z:2, p:1, q:0}
// SET $NY, $RZ
opcodes.set(0xcbd2, {
  name: "SET 2,D",
  template: "SET $NY, $RZ",
  bytes: "cb d2",
  group: "Bits",
  doc: "Set bit 2 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(2, z80.regs.d);
  },
});

// {n:211, x:3, y:2, z:3, p:1, q:0}
// SET $NY, $RZ
opcodes.set(0xcbd3, {
  name: "SET 2,E",
  template: "SET $NY, $RZ",
  bytes: "cb d3",
  group: "Bits",
  doc: "Set bit 2 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(2, z80.regs.e);
  },
});

// {n:212, x:3, y:2, z:4, p:1, q:0}
// SET $NY, $RZ
opcodes.set(0xcbd4, {
  name: "SET 2,H",
  template: "SET $NY, $RZ",
  bytes: "cb d4",
  group: "Bits",
  doc: "Set bit 2 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(2, z80.regs.h);
  },
});

// {n:213, x:3, y:2, z:5, p:1, q:0}
// SET $NY, $RZ
opcodes.set(0xcbd5, {
  name: "SET 2,L",
  template: "SET $NY, $RZ",
  bytes: "cb d5",
  group: "Bits",
  doc: "Set bit 2 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(2, z80.regs.l);
  },
});

// {n:214, x:3, y:2, z:6, p:1, q:0}
// SET $NY, (HL)
opcodes.set(0xcbd6, {
  name: "SET 2,(HL)",
  template: "SET $NY, (HL)",
  bytes: "cb d6",
  group: "Bits",
  doc: "Set bit 2 of (HL)",
  states: [15],
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
  name: "SET 2,A",
  template: "SET $NY, $RZ",
  bytes: "cb d7",
  group: "Bits",
  doc: "Set bit 2 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(2, z80.regs.a);
  },
});

// {n:216, x:3, y:3, z:0, p:1, q:1}
// SET $NY, $RZ
opcodes.set(0xcbd8, {
  name: "SET 3,B",
  template: "SET $NY, $RZ",
  bytes: "cb d8",
  group: "Bits",
  doc: "Set bit 3 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(3, z80.regs.b);
  },
});

// {n:217, x:3, y:3, z:1, p:1, q:1}
// SET $NY, $RZ
opcodes.set(0xcbd9, {
  name: "SET 3,C",
  template: "SET $NY, $RZ",
  bytes: "cb d9",
  group: "Bits",
  doc: "Set bit 3 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(3, z80.regs.c);
  },
});

// {n:218, x:3, y:3, z:2, p:1, q:1}
// SET $NY, $RZ
opcodes.set(0xcbda, {
  name: "SET 3,D",
  template: "SET $NY, $RZ",
  bytes: "cb da",
  group: "Bits",
  doc: "Set bit 3 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(3, z80.regs.d);
  },
});

// {n:219, x:3, y:3, z:3, p:1, q:1}
// SET $NY, $RZ
opcodes.set(0xcbdb, {
  name: "SET 3,E",
  template: "SET $NY, $RZ",
  bytes: "cb db",
  group: "Bits",
  doc: "Set bit 3 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(3, z80.regs.e);
  },
});

// {n:220, x:3, y:3, z:4, p:1, q:1}
// SET $NY, $RZ
opcodes.set(0xcbdc, {
  name: "SET 3,H",
  template: "SET $NY, $RZ",
  bytes: "cb dc",
  group: "Bits",
  doc: "Set bit 3 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(3, z80.regs.h);
  },
});

// {n:221, x:3, y:3, z:5, p:1, q:1}
// SET $NY, $RZ
opcodes.set(0xcbdd, {
  name: "SET 3,L",
  template: "SET $NY, $RZ",
  bytes: "cb dd",
  group: "Bits",
  doc: "Set bit 3 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(3, z80.regs.l);
  },
});

// {n:222, x:3, y:3, z:6, p:1, q:1}
// SET $NY, (HL)
opcodes.set(0xcbde, {
  name: "SET 3,(HL)",
  template: "SET $NY, (HL)",
  bytes: "cb de",
  group: "Bits",
  doc: "Set bit 3 of (HL)",
  states: [15],
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
  name: "SET 3,A",
  template: "SET $NY, $RZ",
  bytes: "cb df",
  group: "Bits",
  doc: "Set bit 3 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(3, z80.regs.a);
  },
});

// {n:224, x:3, y:4, z:0, p:2, q:0}
// SET $NY, $RZ
opcodes.set(0xcbe0, {
  name: "SET 4,B",
  template: "SET $NY, $RZ",
  bytes: "cb e0",
  group: "Bits",
  doc: "Set bit 4 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(4, z80.regs.b);
  },
});

// {n:225, x:3, y:4, z:1, p:2, q:0}
// SET $NY, $RZ
opcodes.set(0xcbe1, {
  name: "SET 4,C",
  template: "SET $NY, $RZ",
  bytes: "cb e1",
  group: "Bits",
  doc: "Set bit 4 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(4, z80.regs.c);
  },
});

// {n:226, x:3, y:4, z:2, p:2, q:0}
// SET $NY, $RZ
opcodes.set(0xcbe2, {
  name: "SET 4,D",
  template: "SET $NY, $RZ",
  bytes: "cb e2",
  group: "Bits",
  doc: "Set bit 4 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(4, z80.regs.d);
  },
});

// {n:227, x:3, y:4, z:3, p:2, q:0}
// SET $NY, $RZ
opcodes.set(0xcbe3, {
  name: "SET 4,E",
  template: "SET $NY, $RZ",
  bytes: "cb e3",
  group: "Bits",
  doc: "Set bit 4 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(4, z80.regs.e);
  },
});

// {n:228, x:3, y:4, z:4, p:2, q:0}
// SET $NY, $RZ
opcodes.set(0xcbe4, {
  name: "SET 4,H",
  template: "SET $NY, $RZ",
  bytes: "cb e4",
  group: "Bits",
  doc: "Set bit 4 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(4, z80.regs.h);
  },
});

// {n:229, x:3, y:4, z:5, p:2, q:0}
// SET $NY, $RZ
opcodes.set(0xcbe5, {
  name: "SET 4,L",
  template: "SET $NY, $RZ",
  bytes: "cb e5",
  group: "Bits",
  doc: "Set bit 4 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(4, z80.regs.l);
  },
});

// {n:230, x:3, y:4, z:6, p:2, q:0}
// SET $NY, (HL)
opcodes.set(0xcbe6, {
  name: "SET 4,(HL)",
  template: "SET $NY, (HL)",
  bytes: "cb e6",
  group: "Bits",
  doc: "Set bit 4 of (HL)",
  states: [15],
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
  name: "SET 4,A",
  template: "SET $NY, $RZ",
  bytes: "cb e7",
  group: "Bits",
  doc: "Set bit 4 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(4, z80.regs.a);
  },
});

// {n:232, x:3, y:5, z:0, p:2, q:1}
// SET $NY, $RZ
opcodes.set(0xcbe8, {
  name: "SET 5,B",
  template: "SET $NY, $RZ",
  bytes: "cb e8",
  group: "Bits",
  doc: "Set bit 5 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(5, z80.regs.b);
  },
});

// {n:233, x:3, y:5, z:1, p:2, q:1}
// SET $NY, $RZ
opcodes.set(0xcbe9, {
  name: "SET 5,C",
  template: "SET $NY, $RZ",
  bytes: "cb e9",
  group: "Bits",
  doc: "Set bit 5 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(5, z80.regs.c);
  },
});

// {n:234, x:3, y:5, z:2, p:2, q:1}
// SET $NY, $RZ
opcodes.set(0xcbea, {
  name: "SET 5,D",
  template: "SET $NY, $RZ",
  bytes: "cb ea",
  group: "Bits",
  doc: "Set bit 5 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(5, z80.regs.d);
  },
});

// {n:235, x:3, y:5, z:3, p:2, q:1}
// SET $NY, $RZ
opcodes.set(0xcbeb, {
  name: "SET 5,E",
  template: "SET $NY, $RZ",
  bytes: "cb eb",
  group: "Bits",
  doc: "Set bit 5 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(5, z80.regs.e);
  },
});

// {n:236, x:3, y:5, z:4, p:2, q:1}
// SET $NY, $RZ
opcodes.set(0xcbec, {
  name: "SET 5,H",
  template: "SET $NY, $RZ",
  bytes: "cb ec",
  group: "Bits",
  doc: "Set bit 5 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(5, z80.regs.h);
  },
});

// {n:237, x:3, y:5, z:5, p:2, q:1}
// SET $NY, $RZ
opcodes.set(0xcbed, {
  name: "SET 5,L",
  template: "SET $NY, $RZ",
  bytes: "cb ed",
  group: "Bits",
  doc: "Set bit 5 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(5, z80.regs.l);
  },
});

// {n:238, x:3, y:5, z:6, p:2, q:1}
// SET $NY, (HL)
opcodes.set(0xcbee, {
  name: "SET 5,(HL)",
  template: "SET $NY, (HL)",
  bytes: "cb ee",
  group: "Bits",
  doc: "Set bit 5 of (HL)",
  states: [15],
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
  name: "SET 5,A",
  template: "SET $NY, $RZ",
  bytes: "cb ef",
  group: "Bits",
  doc: "Set bit 5 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(5, z80.regs.a);
  },
});

// {n:240, x:3, y:6, z:0, p:3, q:0}
// SET $NY, $RZ
opcodes.set(0xcbf0, {
  name: "SET 6,B",
  template: "SET $NY, $RZ",
  bytes: "cb f0",
  group: "Bits",
  doc: "Set bit 6 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(6, z80.regs.b);
  },
});

// {n:241, x:3, y:6, z:1, p:3, q:0}
// SET $NY, $RZ
opcodes.set(0xcbf1, {
  name: "SET 6,C",
  template: "SET $NY, $RZ",
  bytes: "cb f1",
  group: "Bits",
  doc: "Set bit 6 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(6, z80.regs.c);
  },
});

// {n:242, x:3, y:6, z:2, p:3, q:0}
// SET $NY, $RZ
opcodes.set(0xcbf2, {
  name: "SET 6,D",
  template: "SET $NY, $RZ",
  bytes: "cb f2",
  group: "Bits",
  doc: "Set bit 6 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(6, z80.regs.d);
  },
});

// {n:243, x:3, y:6, z:3, p:3, q:0}
// SET $NY, $RZ
opcodes.set(0xcbf3, {
  name: "SET 6,E",
  template: "SET $NY, $RZ",
  bytes: "cb f3",
  group: "Bits",
  doc: "Set bit 6 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(6, z80.regs.e);
  },
});

// {n:244, x:3, y:6, z:4, p:3, q:0}
// SET $NY, $RZ
opcodes.set(0xcbf4, {
  name: "SET 6,H",
  template: "SET $NY, $RZ",
  bytes: "cb f4",
  group: "Bits",
  doc: "Set bit 6 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(6, z80.regs.h);
  },
});

// {n:245, x:3, y:6, z:5, p:3, q:0}
// SET $NY, $RZ
opcodes.set(0xcbf5, {
  name: "SET 6,L",
  template: "SET $NY, $RZ",
  bytes: "cb f5",
  group: "Bits",
  doc: "Set bit 6 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(6, z80.regs.l);
  },
});

// {n:246, x:3, y:6, z:6, p:3, q:0}
// SET $NY, (HL)
opcodes.set(0xcbf6, {
  name: "SET 6,(HL)",
  template: "SET $NY, (HL)",
  bytes: "cb f6",
  group: "Bits",
  doc: "Set bit 6 of (HL)",
  states: [15],
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
  name: "SET 6,A",
  template: "SET $NY, $RZ",
  bytes: "cb f7",
  group: "Bits",
  doc: "Set bit 6 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(6, z80.regs.a);
  },
});

// {n:248, x:3, y:7, z:0, p:3, q:1}
// SET $NY, $RZ
opcodes.set(0xcbf8, {
  name: "SET 7,B",
  template: "SET $NY, $RZ",
  bytes: "cb f8",
  group: "Bits",
  doc: "Set bit 7 in register b2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.b = z80.alu.set(7, z80.regs.b);
  },
});

// {n:249, x:3, y:7, z:1, p:3, q:1}
// SET $NY, $RZ
opcodes.set(0xcbf9, {
  name: "SET 7,C",
  template: "SET $NY, $RZ",
  bytes: "cb f9",
  group: "Bits",
  doc: "Set bit 7 in register c2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.c = z80.alu.set(7, z80.regs.c);
  },
});

// {n:250, x:3, y:7, z:2, p:3, q:1}
// SET $NY, $RZ
opcodes.set(0xcbfa, {
  name: "SET 7,D",
  template: "SET $NY, $RZ",
  bytes: "cb fa",
  group: "Bits",
  doc: "Set bit 7 in register d2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.d = z80.alu.set(7, z80.regs.d);
  },
});

// {n:251, x:3, y:7, z:3, p:3, q:1}
// SET $NY, $RZ
opcodes.set(0xcbfb, {
  name: "SET 7,E",
  template: "SET $NY, $RZ",
  bytes: "cb fb",
  group: "Bits",
  doc: "Set bit 7 in register e2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.e = z80.alu.set(7, z80.regs.e);
  },
});

// {n:252, x:3, y:7, z:4, p:3, q:1}
// SET $NY, $RZ
opcodes.set(0xcbfc, {
  name: "SET 7,H",
  template: "SET $NY, $RZ",
  bytes: "cb fc",
  group: "Bits",
  doc: "Set bit 7 in register h2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.h = z80.alu.set(7, z80.regs.h);
  },
});

// {n:253, x:3, y:7, z:5, p:3, q:1}
// SET $NY, $RZ
opcodes.set(0xcbfd, {
  name: "SET 7,L",
  template: "SET $NY, $RZ",
  bytes: "cb fd",
  group: "Bits",
  doc: "Set bit 7 in register l2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.l = z80.alu.set(7, z80.regs.l);
  },
});

// {n:254, x:3, y:7, z:6, p:3, q:1}
// SET $NY, (HL)
opcodes.set(0xcbfe, {
  name: "SET 7,(HL)",
  template: "SET $NY, (HL)",
  bytes: "cb fe",
  group: "Bits",
  doc: "Set bit 7 of (HL)",
  states: [15],
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
  name: "SET 7,A",
  template: "SET $NY, $RZ",
  bytes: "cb ff",
  group: "Bits",
  doc: "Set bit 7 in register a2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$RZ=z80.alu.set($NY, $RZ)"}
    z80.regs.a = z80.alu.set(7, z80.regs.a);
  },
});

// {n:9, x:0, y:1, z:1, p:0, q:1}
// ADD $RI,$RP
opcodes.set(0xdd09, {
  name: "ADD IX,BC",
  template: "ADD $RI,$RP",
  bytes: "dd 09",
  group: "ALU 16bit",
  doc: "ix+=bc",
  flags: "--*-0*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.ix = z80.alu.add16(z80.regs.ix, z80.regs.bc);
  },
});

// {n:25, x:0, y:3, z:1, p:1, q:1}
// ADD $RI,$RP
opcodes.set(0xdd19, {
  name: "ADD IX,DE",
  template: "ADD $RI,$RP",
  bytes: "dd 19",
  group: "ALU 16bit",
  doc: "ix+=de",
  flags: "--*-0*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.ix = z80.alu.add16(z80.regs.ix, z80.regs.de);
  },
});

// {n:33, x:0, y:4, z:1, p:2, q:0}
// LD $RP,$nn
opcodes.set(0xdd21, {
  name: "LD IX,$NN",
  template: "LD $RP,$nn",
  bytes: "dd 21 $2l $2h",
  group: "Load 16bit",
  doc: "ix=nn",
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
  name: "LD ($NN),IX",
  template: "LD ($nn),$RP",
  bytes: "dd 22 $1l $1h",
  group: "Load 16bit",
  doc: "[nn]=ix",
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
  name: "INC IX",
  template: "INC $RP",
  bytes: "dd 23",
  group: "ALU 16bit",
  doc: "$RDDP+=1",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.inc16($RP)"}
    z80.incTStateCount(2);
    z80.regs.ix = z80.alu.inc16(z80.regs.ix);
  },
});

// {n:36, x:0, y:4, z:4, p:2, q:0}
// INC $RY
opcodes.set(0xdd24, {
  name: "INC IXH",
  template: "INC $RY",
  bytes: "dd 24",
  group: "ALU 8bit",
  doc: "ixh+=1",
  states: [10],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.ixh = z80.alu.inc8(z80.regs.ixh);
  },
});

// {n:37, x:0, y:4, z:5, p:2, q:0}
// DEC $RY
opcodes.set(0xdd25, {
  name: "DEC IXH",
  template: "DEC $RY",
  bytes: "dd 25",
  group: "ALU 8bit",
  doc: "ixh-=1",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.ixh = z80.alu.dec8(z80.regs.ixh);
  },
});

// {n:38, x:0, y:4, z:6, p:2, q:0}
// LD $RY,$n
opcodes.set(0xdd26, {
  name: "LD IXH,$N",
  template: "LD $RY,$n",
  bytes: "dd 26 $2",
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
  name: "ADD IX,IX",
  template: "ADD $RI,$RP",
  bytes: "dd 29",
  group: "ALU 16bit",
  doc: "ix+=ix",
  flags: "--*-0*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.ix = z80.alu.add16(z80.regs.ix, z80.regs.ix);
  },
});

// {n:42, x:0, y:5, z:2, p:2, q:1}
// LD $RP,($nn)
opcodes.set(0xdd2a, {
  name: "LD IX,($NN)",
  template: "LD $RP,($nn)",
  bytes: "dd 2a $2l $2h",
  group: "Load 16bit",
  doc: "ix=($nn)",
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
  name: "DEC IX",
  template: "DEC $RP",
  bytes: "dd 2b",
  group: "ALU 16bit",
  doc: "ix-=1",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.dec16($RP)"}
    z80.incTStateCount(2);
    z80.regs.ix = z80.alu.dec16(z80.regs.ix);
  },
});

// {n:44, x:0, y:5, z:4, p:2, q:1}
// INC $RY
opcodes.set(0xdd2c, {
  name: "INC IXL",
  template: "INC $RY",
  bytes: "dd 2c",
  group: "ALU 8bit",
  doc: "ixl+=1",
  states: [10],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.ixl = z80.alu.inc8(z80.regs.ixl);
  },
});

// {n:45, x:0, y:5, z:5, p:2, q:1}
// DEC $RY
opcodes.set(0xdd2d, {
  name: "DEC IXL",
  template: "DEC $RY",
  bytes: "dd 2d",
  group: "ALU 8bit",
  doc: "ixl-=1",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.ixl = z80.alu.dec8(z80.regs.ixl);
  },
});

// {n:46, x:0, y:5, z:6, p:2, q:1}
// LD $RY,$n
opcodes.set(0xdd2e, {
  name: "LD IXL,$N",
  template: "LD $RY,$n",
  bytes: "dd 2e $2",
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
// INC ($RI+$d)
opcodes.set(0xdd34, {
  name: "INC (IX+$D)",
  template: "INC ($RI+$d)",
  bytes: "dd 34 $1s",
  group: "ALU 8bit",
  doc: "Increment (ix+d)",
  flags: "***V0-",
  states: [23],
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
// DEC ($RI+$d)
opcodes.set(0xdd35, {
  name: "DEC (IX+$D)",
  template: "DEC ($RI+$d)",
  bytes: "dd 35 $1s",
  group: "ALU 8bit",
  doc: "Decrement (ix+dd)",
  flags: "***V1-",
  states: [23],
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
// LD ($RI+$d),$n
opcodes.set(0xdd36, {
  name: "LD (IX+$D),$N",
  template: "LD ($RI+$d),$n",
  bytes: "dd 36 $1s $2",
  group: "Load 8bit",
  doc: "(ix+dd)=n",
  states: [19],
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
  name: "ADD IX,SP",
  template: "ADD $RI,$RP",
  bytes: "dd 39",
  group: "ALU 16bit",
  doc: "ix+=sp",
  flags: "--*-0*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.ix = z80.alu.add16(z80.regs.ix, z80.regs.sp);
  },
});

// {n:68, x:1, y:0, z:4, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0xdd44, {
  name: "LD B,IXH",
  template: "LD $RY,$RZ",
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
  name: "LD B,IXL",
  template: "LD $RY,$RZ",
  bytes: "dd 45",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.ixl;
  },
});

// {n:70, x:1, y:0, z:6, p:0, q:0}
// LD $RRY,($RI+$d)
opcodes.set(0xdd46, {
  name: "LD B,(IX+$D)",
  template: "LD $RRY,($RI+$d)",
  bytes: "dd 46 $2s",
  group: "Load 8bit",
  doc: "b=(ix+dd)",
  states: [19],
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
  name: "LD C,IXH",
  template: "LD $RY,$RZ",
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
  name: "LD C,IXL",
  template: "LD $RY,$RZ",
  bytes: "dd 4d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.ixl;
  },
});

// {n:78, x:1, y:1, z:6, p:0, q:1}
// LD $RRY,($RI+$d)
opcodes.set(0xdd4e, {
  name: "LD C,(IX+$D)",
  template: "LD $RRY,($RI+$d)",
  bytes: "dd 4e $2s",
  group: "Load 8bit",
  doc: "c=(ix+dd)",
  states: [19],
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
  name: "LD D,IXH",
  template: "LD $RY,$RZ",
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
  name: "LD D,IXL",
  template: "LD $RY,$RZ",
  bytes: "dd 55",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.ixl;
  },
});

// {n:86, x:1, y:2, z:6, p:1, q:0}
// LD $RRY,($RI+$d)
opcodes.set(0xdd56, {
  name: "LD D,(IX+$D)",
  template: "LD $RRY,($RI+$d)",
  bytes: "dd 56 $2s",
  group: "Load 8bit",
  doc: "d=(ix+dd)",
  states: [19],
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
  name: "LD E,IXH",
  template: "LD $RY,$RZ",
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
  name: "LD E,IXL",
  template: "LD $RY,$RZ",
  bytes: "dd 5d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.ixl;
  },
});

// {n:94, x:1, y:3, z:6, p:1, q:1}
// LD $RRY,($RI+$d)
opcodes.set(0xdd5e, {
  name: "LD E,(IX+$D)",
  template: "LD $RRY,($RI+$d)",
  bytes: "dd 5e $2s",
  group: "Load 8bit",
  doc: "e=(ix+dd)",
  states: [19],
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
  name: "LD IXH,B",
  template: "LD $RY,$RZ",
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
  name: "LD IXH,C",
  template: "LD $RY,$RZ",
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
  name: "LD IXH,D",
  template: "LD $RY,$RZ",
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
  name: "LD IXH,E",
  template: "LD $RY,$RZ",
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
  name: "LD IXH,IXH",
  template: "LD $RY,$RZ",
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
  name: "LD IXH,IXL",
  template: "LD $RY,$RZ",
  bytes: "dd 65",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixh = z80.regs.ixl;
  },
});

// {n:102, x:1, y:4, z:6, p:2, q:0}
// LD $RRY,($RI+$d)
opcodes.set(0xdd66, {
  name: "LD H,(IX+$D)",
  template: "LD $RRY,($RI+$d)",
  bytes: "dd 66 $2s",
  group: "Load 8bit",
  doc: "h=(ix+dd)",
  states: [19],
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
  name: "LD IXH,A",
  template: "LD $RY,$RZ",
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
  name: "LD IXL,B",
  template: "LD $RY,$RZ",
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
  name: "LD IXL,C",
  template: "LD $RY,$RZ",
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
  name: "LD IXL,D",
  template: "LD $RY,$RZ",
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
  name: "LD IXL,E",
  template: "LD $RY,$RZ",
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
  name: "LD IXL,IXH",
  template: "LD $RY,$RZ",
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
  name: "LD IXL,IXL",
  template: "LD $RY,$RZ",
  bytes: "dd 6d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixl = z80.regs.ixl;
  },
});

// {n:110, x:1, y:5, z:6, p:2, q:1}
// LD $RRY,($RI+$d)
opcodes.set(0xdd6e, {
  name: "LD L,(IX+$D)",
  template: "LD $RRY,($RI+$d)",
  bytes: "dd 6e $2s",
  group: "Load 8bit",
  doc: "l=(ix+dd)",
  states: [19],
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
  name: "LD IXL,A",
  template: "LD $RY,$RZ",
  bytes: "dd 6f",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.ixl = z80.regs.a;
  },
});

// {n:112, x:1, y:6, z:0, p:3, q:0}
// LD ($RI+$d),$RRZ
opcodes.set(0xdd70, {
  name: "LD (IX+$D),B",
  template: "LD ($RI+$d),$RRZ",
  bytes: "dd 70 $1s",
  group: "Load 8bit",
  doc: "(ix+dd) = b",
  states: [19],
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
// LD ($RI+$d),$RRZ
opcodes.set(0xdd71, {
  name: "LD (IX+$D),C",
  template: "LD ($RI+$d),$RRZ",
  bytes: "dd 71 $1s",
  group: "Load 8bit",
  doc: "(ix+dd) = c",
  states: [19],
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
// LD ($RI+$d),$RRZ
opcodes.set(0xdd72, {
  name: "LD (IX+$D),D",
  template: "LD ($RI+$d),$RRZ",
  bytes: "dd 72 $1s",
  group: "Load 8bit",
  doc: "(ix+dd) = d",
  states: [19],
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
// LD ($RI+$d),$RRZ
opcodes.set(0xdd73, {
  name: "LD (IX+$D),E",
  template: "LD ($RI+$d),$RRZ",
  bytes: "dd 73 $1s",
  group: "Load 8bit",
  doc: "(ix+dd) = e",
  states: [19],
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
// LD ($RI+$d),$RRZ
opcodes.set(0xdd74, {
  name: "LD (IX+$D),H",
  template: "LD ($RI+$d),$RRZ",
  bytes: "dd 74 $1s",
  group: "Load 8bit",
  doc: "(ix+dd) = h",
  states: [19],
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
// LD ($RI+$d),$RRZ
opcodes.set(0xdd75, {
  name: "LD (IX+$D),L",
  template: "LD ($RI+$d),$RRZ",
  bytes: "dd 75 $1s",
  group: "Load 8bit",
  doc: "(ix+dd) = l",
  states: [19],
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
// LD ($RI+$d),$RRZ
opcodes.set(0xdd77, {
  name: "LD (IX+$D),A",
  template: "LD ($RI+$d),$RRZ",
  bytes: "dd 77 $1s",
  group: "Load 8bit",
  doc: "(ix+dd) = a",
  states: [19],
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
  name: "LD A,IXH",
  template: "LD $RY,$RZ",
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
  name: "LD A,IXL",
  template: "LD $RY,$RZ",
  bytes: "dd 7d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.ixl;
  },
});

// {n:126, x:1, y:7, z:6, p:3, q:1}
// LD $RRY,($RI+$d)
opcodes.set(0xdd7e, {
  name: "LD A,(IX+$D)",
  template: "LD $RRY,($RI+$d)",
  bytes: "dd 7e $2s",
  group: "Load 8bit",
  doc: "a=(ix+dd)",
  states: [19],
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

// {n:133, x:2, y:0, z:5, p:0, q:0}
// $ALU $RZ
opcodes.set(0xdd85, {
  name: "ADD A,IXL",
  template: "$ALU $RZ",
  bytes: "dd 85",
  group: "ALU 8bit",
  doc: "A := A add ixl",
  flags: "***V0*",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add(z80.regs.ixl);
  },
});

// {n:134, x:2, y:0, z:6, p:0, q:0}
// $ALU ($RI+$d)
opcodes.set(0xdd86, {
  name: "ADD A,(IX+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "dd 86 $1s",
  group: "ALU 8bit",
  doc: "A=A add (ix+dd)",
  flags: "***V0*",
  states: [19],
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
    z80.alu.add(z80.dbus);
  },
});

// {n:141, x:2, y:1, z:5, p:0, q:1}
// $ALU $RZ
opcodes.set(0xdd8d, {
  name: "ADC A,IXL",
  template: "$ALU $RZ",
  bytes: "dd 8d",
  group: "ALU 8bit",
  doc: "A := A adc ixl",
  flags: "***V0*",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc(z80.regs.ixl);
  },
});

// {n:142, x:2, y:1, z:6, p:0, q:1}
// $ALU ($RI+$d)
opcodes.set(0xdd8e, {
  name: "ADC A,(IX+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "dd 8e $1s",
  group: "ALU 8bit",
  doc: "A=A adc (ix+dd)",
  flags: "***V0*",
  states: [19],
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
    z80.alu.adc(z80.dbus);
  },
});

// {n:149, x:2, y:2, z:5, p:1, q:0}
// $ALU $RZ
opcodes.set(0xdd95, {
  name: "SUB IXL",
  template: "$ALU $RZ",
  bytes: "dd 95",
  group: "ALU 8bit",
  doc: "A := A sub ixl",
  flags: "***V1*",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub(z80.regs.ixl);
  },
});

// {n:150, x:2, y:2, z:6, p:1, q:0}
// $ALU ($RI+$d)
opcodes.set(0xdd96, {
  name: "SUB (IX+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "dd 96 $1s",
  group: "ALU 8bit",
  doc: "A=A sub (ix+dd)",
  flags: "***V1*",
  states: [19],
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
    z80.alu.sub(z80.dbus);
  },
});

// {n:157, x:2, y:3, z:5, p:1, q:1}
// $ALU $RZ
opcodes.set(0xdd9d, {
  name: "SBC A,IXL",
  template: "$ALU $RZ",
  bytes: "dd 9d",
  group: "ALU 8bit",
  doc: "A := A sbc ixl",
  flags: "***V1*",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc(z80.regs.ixl);
  },
});

// {n:158, x:2, y:3, z:6, p:1, q:1}
// $ALU ($RI+$d)
opcodes.set(0xdd9e, {
  name: "SBC A,(IX+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "dd 9e $1s",
  group: "ALU 8bit",
  doc: "A=A sbc (ix+dd)",
  flags: "***V1*",
  states: [19],
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
    z80.alu.sbc(z80.dbus);
  },
});

// {n:165, x:2, y:4, z:5, p:2, q:0}
// $ALU $RZ
opcodes.set(0xdda5, {
  name: "AND IXL",
  template: "$ALU $RZ",
  bytes: "dd a5",
  group: "ALU 8bit",
  doc: "A := A and ixl",
  flags: "***P00",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and(z80.regs.ixl);
  },
});

// {n:166, x:2, y:4, z:6, p:2, q:0}
// $ALU ($RI+$d)
opcodes.set(0xdda6, {
  name: "AND (IX+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "dd a6 $1s",
  group: "ALU 8bit",
  doc: "A=A and (ix+dd)",
  flags: "***P00",
  states: [19],
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
    z80.alu.and(z80.dbus);
  },
});

// {n:173, x:2, y:5, z:5, p:2, q:1}
// $ALU $RZ
opcodes.set(0xddad, {
  name: "XOR IXL",
  template: "$ALU $RZ",
  bytes: "dd ad",
  group: "ALU 8bit",
  doc: "A := A xor ixl",
  flags: "***P00",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor(z80.regs.ixl);
  },
});

// {n:174, x:2, y:5, z:6, p:2, q:1}
// $ALU ($RI+$d)
opcodes.set(0xddae, {
  name: "XOR (IX+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "dd ae $1s",
  group: "ALU 8bit",
  doc: "A=A xor (ix+dd)",
  flags: "***P00",
  states: [19],
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
    z80.alu.xor(z80.dbus);
  },
});

// {n:181, x:2, y:6, z:5, p:3, q:0}
// $ALU $RZ
opcodes.set(0xddb5, {
  name: "OR IXL",
  template: "$ALU $RZ",
  bytes: "dd b5",
  group: "ALU 8bit",
  doc: "A := A or ixl",
  flags: "***P00",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or(z80.regs.ixl);
  },
});

// {n:182, x:2, y:6, z:6, p:3, q:0}
// $ALU ($RI+$d)
opcodes.set(0xddb6, {
  name: "OR (IX+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "dd b6 $1s",
  group: "ALU 8bit",
  doc: "A=A or (ix+dd)",
  flags: "***P00",
  states: [19],
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
    z80.alu.or(z80.dbus);
  },
});

// {n:189, x:2, y:7, z:5, p:3, q:1}
// $ALU $RZ
opcodes.set(0xddbd, {
  name: "CP IXL",
  template: "$ALU $RZ",
  bytes: "dd bd",
  group: "ALU 8bit",
  doc: "A := A cp ixl",
  flags: "***V1*",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp(z80.regs.ixl);
  },
});

// {n:190, x:2, y:7, z:6, p:3, q:1}
// $ALU ($RI+$d)
opcodes.set(0xddbe, {
  name: "CP (IX+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "dd be $1s",
  group: "ALU 8bit",
  doc: "A=A cp (ix+dd)",
  flags: "***V1*",
  states: [19],
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
    z80.alu.cp(z80.dbus);
  },
});

// {n:203, x:3, y:1, z:3, p:0, q:1}
// CB prefix
opcodes.set(0xddcb, {
  name: "CB XXX",
  template: "CB prefix",
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
  name: "POP IX",
  template: "POP $RP2",
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
  name: "EX (SP),IX",
  template: "EX (SP),$RI",
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
  name: "PUSH IX",
  template: "PUSH $RP2",
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
  name: "JP IX",
  template: "JP $RI",
  bytes: "dd e9",
  group: "Control flow",
  doc: "JMP to ix",
  fn: (z80) => {
    // overlapped: {action: "$PC=$RP"}
    z80.regs.pc = z80.regs.ix;
  },
});

// {n:249, x:3, y:7, z:1, p:3, q:1}
// LD SP,$RI
opcodes.set(0xddf9, {
  name: "LD SP,IX",
  template: "LD SP,$RI",
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
  name: "IN B,(C)",
  template: "IN $RY,(C)",
  bytes: "ed 40",
  group: "IO",
  doc: "b=[C]",
  flags: "***P0-",
  states: [12],
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
  name: "OUT (C),B",
  template: "OUT (C),$RY",
  bytes: "ed 41",
  group: "IO",
  doc: "[C]=b",
  states: [12],
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
  name: "SBC HL,BC",
  template: "SBC HL,$RP",
  bytes: "ed 42",
  group: "ALU 16bit",
  doc: "16bit subtract with carry: A:=HL-bc-CY",
  flags: "***V1*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.sbc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.sbc16(z80.regs.bc);
  },
});

// {n:67, x:1, y:0, z:3, p:0, q:0}
// LD ($nn),$RP
opcodes.set(0xed43, {
  name: "LD ($NN),BC",
  template: "LD ($nn),$RP",
  bytes: "ed 43 $1l $1h",
  group: "Load 16bit",
  doc: "[nn]=c, [nn+1]=b",
  states: [20],
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
  template: "NEG",
  bytes: "ed 44",
  group: "ALU 8bit",
  doc: "A=-A",
  flags: " ***V1*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:69, x:1, y:0, z:5, p:0, q:0}
// RETN
opcodes.set(0xed45, {
  name: "RETN",
  template: "RETN",
  bytes: "ed 45",
  group: "Control flow",
  doc: "Return from NMI",
  states: [14],
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
  template: "IM $IMY",
  bytes: "ed 46",
  group: "Interrupt",
  doc: "Set interrupt mode to 0",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 0;
  },
});

// {n:71, x:1, y:0, z:7, p:0, q:0}
// LD I,A
opcodes.set(0xed47, {
  name: "LD I,A",
  template: "LD I,A",
  bytes: "ed 47",
  group: "Load 8bit",
  doc: "I=A",
  states: [9],
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
  name: "IN C,(C)",
  template: "IN $RY,(C)",
  bytes: "ed 48",
  group: "IO",
  doc: "c=[C]",
  flags: "***P0-",
  states: [12],
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
  name: "OUT (C),C",
  template: "OUT (C),$RY",
  bytes: "ed 49",
  group: "IO",
  doc: "[C]=c",
  states: [12],
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
  name: "ADC HL,BC",
  template: "ADC HL,$RP",
  bytes: "ed 4a",
  group: "ALU 16bit",
  doc: "16bit add with carry: A:=HL+bc+CY",
  flags: "***V0*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.adc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.adc16(z80.regs.bc);
  },
});

// {n:75, x:1, y:1, z:3, p:0, q:1}
// LD $RP,($nn)
opcodes.set(0xed4b, {
  name: "LD BC,($NN)",
  template: "LD $RP,($nn)",
  bytes: "ed 4b $2l $2h",
  group: "Load 16bit",
  doc: "c=[nn], b=[nn+1]",
  states: [20],
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
  template: "NEG",
  bytes: "ed 4c",
  group: "ALU 8bit",
  doc: "A=-A",
  flags: " ***V1*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:77, x:1, y:1, z:5, p:0, q:1}
// RETI
opcodes.set(0xed4d, {
  name: "RETI",
  template: "RETI",
  bytes: "ed 4d",
  group: "Control flow",
  doc: "Return from interrupt",
  states: [14],
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
  template: "IM $IMY",
  bytes: "ed 4e",
  group: "Interrupt",
  doc: "Set interrupt mode to 0",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 0;
  },
});

// {n:79, x:1, y:1, z:7, p:0, q:1}
// LD R,A
opcodes.set(0xed4f, {
  name: "LD R,A",
  template: "LD R,A",
  bytes: "ed 4f",
  group: "Load 8bit",
  doc: "R=A",
  states: [9],
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
  name: "IN D,(C)",
  template: "IN $RY,(C)",
  bytes: "ed 50",
  group: "IO",
  doc: "d=[C]",
  flags: "***P0-",
  states: [12],
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
  name: "OUT (C),D",
  template: "OUT (C),$RY",
  bytes: "ed 51",
  group: "IO",
  doc: "[C]=d",
  states: [12],
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
  name: "SBC HL,DE",
  template: "SBC HL,$RP",
  bytes: "ed 52",
  group: "ALU 16bit",
  doc: "16bit subtract with carry: A:=HL-de-CY",
  flags: "***V1*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.sbc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.sbc16(z80.regs.de);
  },
});

// {n:83, x:1, y:2, z:3, p:1, q:0}
// LD ($nn),$RP
opcodes.set(0xed53, {
  name: "LD ($NN),DE",
  template: "LD ($nn),$RP",
  bytes: "ed 53 $1l $1h",
  group: "Load 16bit",
  doc: "[nn]=e, [nn+1]=d",
  states: [20],
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
  template: "NEG",
  bytes: "ed 54",
  group: "ALU 8bit",
  doc: "A=-A",
  flags: " ***V1*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:85, x:1, y:2, z:5, p:1, q:0}
// RETI
opcodes.set(0xed55, {
  name: "RETI",
  template: "RETI",
  bytes: "ed 55",
  group: "Control flow",
  doc: "Return from interrupt",
  states: [14],
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
  template: "IM $IMY",
  bytes: "ed 56",
  group: "Interrupt",
  doc: "Set interrupt mode to 1",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 1;
  },
});

// {n:87, x:1, y:2, z:7, p:1, q:0}
// LD A,I
opcodes.set(0xed57, {
  name: "LD A,I",
  template: "LD A,I",
  bytes: "ed 57",
  group: "Load 8bit",
  doc: "A=I",
  flags: "**0*0-",
  states: [9],
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
  name: "IN E,(C)",
  template: "IN $RY,(C)",
  bytes: "ed 58",
  group: "IO",
  doc: "e=[C]",
  flags: "***P0-",
  states: [12],
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
  name: "OUT (C),E",
  template: "OUT (C),$RY",
  bytes: "ed 59",
  group: "IO",
  doc: "[C]=e",
  states: [12],
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
  name: "ADC HL,DE",
  template: "ADC HL,$RP",
  bytes: "ed 5a",
  group: "ALU 16bit",
  doc: "16bit add with carry: A:=HL+de+CY",
  flags: "***V0*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.adc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.adc16(z80.regs.de);
  },
});

// {n:91, x:1, y:3, z:3, p:1, q:1}
// LD $RP,($nn)
opcodes.set(0xed5b, {
  name: "LD DE,($NN)",
  template: "LD $RP,($nn)",
  bytes: "ed 5b $2l $2h",
  group: "Load 16bit",
  doc: "e=[nn], d=[nn+1]",
  states: [20],
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
  template: "NEG",
  bytes: "ed 5c",
  group: "ALU 8bit",
  doc: "A=-A",
  flags: " ***V1*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:93, x:1, y:3, z:5, p:1, q:1}
// RETI
opcodes.set(0xed5d, {
  name: "RETI",
  template: "RETI",
  bytes: "ed 5d",
  group: "Control flow",
  doc: "Return from interrupt",
  states: [14],
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
  template: "IM $IMY",
  bytes: "ed 5e",
  group: "Interrupt",
  doc: "Set interrupt mode to 2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 2;
  },
});

// {n:95, x:1, y:3, z:7, p:1, q:1}
// LD A,R
opcodes.set(0xed5f, {
  name: "LD A,R",
  template: "LD A,R",
  bytes: "ed 5f",
  group: "Load 8bit",
  doc: "A=R",
  flags: "**0*0-",
  states: [9],
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
  name: "IN H,(C)",
  template: "IN $RY,(C)",
  bytes: "ed 60",
  group: "IO",
  doc: "h=[C]",
  flags: "***P0-",
  states: [12],
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
  name: "OUT (C),H",
  template: "OUT (C),$RY",
  bytes: "ed 61",
  group: "IO",
  doc: "[C]=h",
  states: [12],
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
  name: "SBC HL,HL",
  template: "SBC HL,$RP",
  bytes: "ed 62",
  group: "ALU 16bit",
  doc: "16bit subtract with carry: A:=HL-hl-CY",
  flags: "***V1*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.sbc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.sbc16(z80.regs.hl);
  },
});

// {n:99, x:1, y:4, z:3, p:2, q:0}
// LD ($nn),$RP
opcodes.set(0xed63, {
  name: "LD ($NN),HL",
  template: "LD ($nn),$RP",
  bytes: "ed 63 $1l $1h",
  group: "Load 16bit",
  doc: "[nn]=l, [nn+1]=h",
  states: [20],
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
  template: "NEG",
  bytes: "ed 64",
  group: "ALU 8bit",
  doc: "A=-A",
  flags: " ***V1*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:101, x:1, y:4, z:5, p:2, q:0}
// RETI
opcodes.set(0xed65, {
  name: "RETI",
  template: "RETI",
  bytes: "ed 65",
  group: "Control flow",
  doc: "Return from interrupt",
  states: [14],
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
  template: "IM $IMY",
  bytes: "ed 66",
  group: "Interrupt",
  doc: "Set interrupt mode to 0",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 0;
  },
});

// {n:103, x:1, y:4, z:7, p:2, q:0}
// RRD
opcodes.set(0xed67, {
  name: "RRD",
  template: "RRD",
  bytes: "ed 67",
  group: "ALU 8bit",
  doc: "Rotate right 4 bits: {A,[HL]}=4->{A,[HL]}",
  flags: "**0P0-",
  states: [18],
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
  name: "IN L,(C)",
  template: "IN $RY,(C)",
  bytes: "ed 68",
  group: "IO",
  doc: "l=[C]",
  flags: "***P0-",
  states: [12],
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
  name: "OUT (C),L",
  template: "OUT (C),$RY",
  bytes: "ed 69",
  group: "IO",
  doc: "[C]=l",
  states: [12],
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
  name: "ADC HL,HL",
  template: "ADC HL,$RP",
  bytes: "ed 6a",
  group: "ALU 16bit",
  doc: "16bit add with carry: A:=HL+hl+CY",
  flags: "***V0*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.adc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.adc16(z80.regs.hl);
  },
});

// {n:107, x:1, y:5, z:3, p:2, q:1}
// LD $RP,($nn)
opcodes.set(0xed6b, {
  name: "LD HL,($NN)",
  template: "LD $RP,($nn)",
  bytes: "ed 6b $2l $2h",
  group: "Load 16bit",
  doc: "l=[nn], h=[nn+1]",
  states: [20],
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
  template: "NEG",
  bytes: "ed 6c",
  group: "ALU 8bit",
  doc: "A=-A",
  flags: " ***V1*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:109, x:1, y:5, z:5, p:2, q:1}
// RETI
opcodes.set(0xed6d, {
  name: "RETI",
  template: "RETI",
  bytes: "ed 6d",
  group: "Control flow",
  doc: "Return from interrupt",
  states: [14],
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
  template: "IM $IMY",
  bytes: "ed 6e",
  group: "Interrupt",
  doc: "Set interrupt mode to 0",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 0;
  },
});

// {n:111, x:1, y:5, z:7, p:2, q:1}
// RLD
opcodes.set(0xed6f, {
  name: "RLD",
  template: "RLD",
  bytes: "ed 6f",
  group: "ALU 8bit",
  doc: "Rotate left 4 bits: {A,[HL]}={A,[HL]}<-4",
  flags: "**0P0-",
  states: [18],
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
  template: "IN (C)",
  bytes: "ed 70",
  group: "IO",
  doc: "[UNDOC] Read byte from port BC and set flags only",
  flags: "***P0-",
  states: [12],
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
  template: "OUT (C), $ZERO",
  bytes: "ed 71",
  group: "IO",
  doc: "[UNDOC] Output zero to port BC",
  states: [12],
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
  name: "SBC HL,SP",
  template: "SBC HL,$RP",
  bytes: "ed 72",
  group: "ALU 16bit",
  doc: "16bit subtract with carry: A:=HL-sp-CY",
  flags: "***V1*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.sbc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.sbc16(z80.regs.sp);
  },
});

// {n:115, x:1, y:6, z:3, p:3, q:0}
// LD ($nn),$RP
opcodes.set(0xed73, {
  name: "LD ($NN),SP",
  template: "LD ($nn),$RP",
  bytes: "ed 73 $1l $1h",
  group: "Load 16bit",
  doc: "[nn]=spl, [nn+1]=sph",
  states: [20],
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
  template: "NEG",
  bytes: "ed 74",
  group: "ALU 8bit",
  doc: "A=-A",
  flags: " ***V1*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:117, x:1, y:6, z:5, p:3, q:0}
// RETI
opcodes.set(0xed75, {
  name: "RETI",
  template: "RETI",
  bytes: "ed 75",
  group: "Control flow",
  doc: "Return from interrupt",
  states: [14],
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
  template: "IM $IMY",
  bytes: "ed 76",
  group: "Interrupt",
  doc: "Set interrupt mode to 1",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 1;
  },
});

// {n:120, x:1, y:7, z:0, p:3, q:1}
// IN $RY,(C)
opcodes.set(0xed78, {
  name: "IN A,(C)",
  template: "IN $RY,(C)",
  bytes: "ed 78",
  group: "IO",
  doc: "a=[C]",
  flags: "***P0-",
  states: [12],
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
  name: "OUT (C),A",
  template: "OUT (C),$RY",
  bytes: "ed 79",
  group: "IO",
  doc: "[C]=a",
  states: [12],
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
  name: "ADC HL,SP",
  template: "ADC HL,$RP",
  bytes: "ed 7a",
  group: "ALU 16bit",
  doc: "16bit add with carry: A:=HL+sp+CY",
  flags: "***V0*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "z80.alu.adc16($RP)"}
    z80.incTStateCount(7);
    z80.alu.adc16(z80.regs.sp);
  },
});

// {n:123, x:1, y:7, z:3, p:3, q:1}
// LD $RP,($nn)
opcodes.set(0xed7b, {
  name: "LD SP,($NN)",
  template: "LD $RP,($nn)",
  bytes: "ed 7b $2l $2h",
  group: "Load 16bit",
  doc: "spl=[nn], sph=[nn+1]",
  states: [20],
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
  template: "NEG",
  bytes: "ed 7c",
  group: "ALU 8bit",
  doc: "A=-A",
  flags: " ***V1*",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "z80.alu.neg8()"}
    z80.alu.neg8();
  },
});

// {n:125, x:1, y:7, z:5, p:3, q:1}
// RETI
opcodes.set(0xed7d, {
  name: "RETI",
  template: "RETI",
  bytes: "ed 7d",
  group: "Control flow",
  doc: "Return from interrupt",
  states: [14],
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
  template: "IM $IMY",
  bytes: "ed 7e",
  group: "Interrupt",
  doc: "Set interrupt mode to 2",
  states: [8],
  fn: (z80) => {
    // overlapped: {action: "$IM=$IMY"}
    z80.regs.im = 2;
  },
});

// {n:160, x:2, y:4, z:0, p:2, q:0}
// LDI
opcodes.set(0xeda0, {
  name: "LDI",
  template: "LDI",
  bytes: "ed a0",
  group: "Transfer 16bit",
  doc: "Load and increment: [DE]=[HL],HL+=1,DE+=1,BC-=1",
  flags: "--0*0-",
  states: [16],
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
  template: "CPI",
  bytes: "ed a1",
  group: "ALU 8bit",
  doc: "Compare and increment: A-[HL],HL=HL+1,BC=BC-1",
  flags: "****1-",
  states: [16],
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
  template: "INI",
  bytes: "ed a2",
  group: "IO",
  doc: "Input and increment: [HL]=[C],HL=HL+1,B=B-1",
  flags: "***?1-",
  states: [16],
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
  template: "OUTI",
  bytes: "ed a3",
  group: "IO",
  doc: "Output and increment: [C]=[HL],HL=HL+1,B=B-1",
  flags: "***?1-",
  states: [16],
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
  template: "LDD",
  bytes: "ed a8",
  group: "Transfer 16bit",
  doc: "Load and decrement: [DE]=[HL],HL-=1,DE-=1,BC-=1",
  flags: "--0*0-",
  states: [16],
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
  template: "CPD",
  bytes: "ed a9",
  group: "ALU 8bit",
  doc: "Compare and decrement: A-[HL],HL=HL-1,BC=BC-1",
  flags: "****1-",
  states: [16],
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
  template: "IND",
  bytes: "ed aa",
  group: "IO",
  doc: "Input and decrement: [HL]=[C],HL=HL-1,B=B-1",
  flags: "***?1-",
  states: [16],
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
  template: "OUTD",
  bytes: "ed ab",
  group: "IO",
  doc: "Output and decrement: Output and increment: [C]=[HL],HL=HL-1,B=B-1",
  flags: "***?1-",
  states: [16],
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
  template: "LDIR",
  bytes: "ed b0",
  group: "Transfer 16bit",
  doc: "Load and increment until BC==0",
  flags: "--000-",
  states: [21, 16],
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
  template: "CPIR",
  bytes: "ed b1",
  group: "ALU 8bit",
  doc: "CPI until A=[HL] or BC=0",
  flags: "****1-",
  states: [21, 16],
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
  template: "INIR",
  bytes: "ed b2",
  group: "IO",
  doc: "INI until B==0",
  flags: "01*?1-",
  states: [21, 16],
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
  template: "OTIR",
  bytes: "ed b3",
  group: "IO",
  doc: "OUTI until B==0",
  flags: "01*?1-",
  states: [21, 16],
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
  template: "LDDR",
  bytes: "ed b8",
  group: "Transfer 16bit",
  doc: "LDR until BC==0",
  flags: "--000-",
  states: [21, 16],
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
  template: "CPDR",
  bytes: "ed b9",
  group: "ALU 8bit",
  doc: "CPD until A=[HL] or BC=0",
  flags: "****1-",
  states: [21, 16],
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
  template: "INDR",
  bytes: "ed ba",
  group: "IO",
  doc: "IND until B==0",
  flags: "01*?1-",
  states: [21, 16],
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
  template: "OTDR",
  bytes: "ed bb",
  group: "IO",
  doc: "OUTD until B==0",
  flags: "01*?1-",
  states: [21, 16],
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
  name: "ADD IY,BC",
  template: "ADD $RI,$RP",
  bytes: "fd 09",
  group: "ALU 16bit",
  doc: "iy+=bc",
  flags: "--*-0*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.iy = z80.alu.add16(z80.regs.iy, z80.regs.bc);
  },
});

// {n:25, x:0, y:3, z:1, p:1, q:1}
// ADD $RI,$RP
opcodes.set(0xfd19, {
  name: "ADD IY,DE",
  template: "ADD $RI,$RP",
  bytes: "fd 19",
  group: "ALU 16bit",
  doc: "iy+=de",
  flags: "--*-0*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.iy = z80.alu.add16(z80.regs.iy, z80.regs.de);
  },
});

// {n:33, x:0, y:4, z:1, p:2, q:0}
// LD $RP,$nn
opcodes.set(0xfd21, {
  name: "LD IY,$NN",
  template: "LD $RP,$nn",
  bytes: "fd 21 $2l $2h",
  group: "Load 16bit",
  doc: "iy=nn",
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
  name: "LD ($NN),IY",
  template: "LD ($nn),$RP",
  bytes: "fd 22 $1l $1h",
  group: "Load 16bit",
  doc: "[nn]=iy",
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
  name: "INC IY",
  template: "INC $RP",
  bytes: "fd 23",
  group: "ALU 16bit",
  doc: "$RDDP+=1",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.inc16($RP)"}
    z80.incTStateCount(2);
    z80.regs.iy = z80.alu.inc16(z80.regs.iy);
  },
});

// {n:36, x:0, y:4, z:4, p:2, q:0}
// INC $RY
opcodes.set(0xfd24, {
  name: "INC IYH",
  template: "INC $RY",
  bytes: "fd 24",
  group: "ALU 8bit",
  doc: "iyh+=1",
  states: [10],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.iyh = z80.alu.inc8(z80.regs.iyh);
  },
});

// {n:37, x:0, y:4, z:5, p:2, q:0}
// DEC $RY
opcodes.set(0xfd25, {
  name: "DEC IYH",
  template: "DEC $RY",
  bytes: "fd 25",
  group: "ALU 8bit",
  doc: "iyh-=1",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.iyh = z80.alu.dec8(z80.regs.iyh);
  },
});

// {n:38, x:0, y:4, z:6, p:2, q:0}
// LD $RY,$n
opcodes.set(0xfd26, {
  name: "LD IYH,$N",
  template: "LD $RY,$n",
  bytes: "fd 26 $2",
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
  name: "ADD IY,IY",
  template: "ADD $RI,$RP",
  bytes: "fd 29",
  group: "ALU 16bit",
  doc: "iy+=iy",
  flags: "--*-0*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.iy = z80.alu.add16(z80.regs.iy, z80.regs.iy);
  },
});

// {n:42, x:0, y:5, z:2, p:2, q:1}
// LD $RP,($nn)
opcodes.set(0xfd2a, {
  name: "LD IY,($NN)",
  template: "LD $RP,($nn)",
  bytes: "fd 2a $2l $2h",
  group: "Load 16bit",
  doc: "iy=($nn)",
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
  name: "DEC IY",
  template: "DEC $RP",
  bytes: "fd 2b",
  group: "ALU 16bit",
  doc: "iy-=1",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$RP=z80.alu.dec16($RP)"}
    z80.incTStateCount(2);
    z80.regs.iy = z80.alu.dec16(z80.regs.iy);
  },
});

// {n:44, x:0, y:5, z:4, p:2, q:1}
// INC $RY
opcodes.set(0xfd2c, {
  name: "INC IYL",
  template: "INC $RY",
  bytes: "fd 2c",
  group: "ALU 8bit",
  doc: "iyl+=1",
  states: [10],
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.inc8($RY)"}
    z80.regs.iyl = z80.alu.inc8(z80.regs.iyl);
  },
});

// {n:45, x:0, y:5, z:5, p:2, q:1}
// DEC $RY
opcodes.set(0xfd2d, {
  name: "DEC IYL",
  template: "DEC $RY",
  bytes: "fd 2d",
  group: "ALU 8bit",
  doc: "iyl-=1",
  fn: (z80) => {
    // overlapped: {action: "$RY=z80.alu.dec8($RY)"}
    z80.regs.iyl = z80.alu.dec8(z80.regs.iyl);
  },
});

// {n:46, x:0, y:5, z:6, p:2, q:1}
// LD $RY,$n
opcodes.set(0xfd2e, {
  name: "LD IYL,$N",
  template: "LD $RY,$n",
  bytes: "fd 2e $2",
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
// INC ($RI+$d)
opcodes.set(0xfd34, {
  name: "INC (IY+$D)",
  template: "INC ($RI+$d)",
  bytes: "fd 34 $1s",
  group: "ALU 8bit",
  doc: "Increment (iy+d)",
  flags: "***V0-",
  states: [23],
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
// DEC ($RI+$d)
opcodes.set(0xfd35, {
  name: "DEC (IY+$D)",
  template: "DEC ($RI+$d)",
  bytes: "fd 35 $1s",
  group: "ALU 8bit",
  doc: "Decrement (iy+dd)",
  flags: "***V1-",
  states: [23],
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
// LD ($RI+$d),$n
opcodes.set(0xfd36, {
  name: "LD (IY+$D),$N",
  template: "LD ($RI+$d),$n",
  bytes: "fd 36 $1s $2",
  group: "Load 8bit",
  doc: "(iy+dd)=n",
  states: [19],
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
  name: "ADD IY,SP",
  template: "ADD $RI,$RP",
  bytes: "fd 39",
  group: "ALU 16bit",
  doc: "iy+=sp",
  flags: "--*-0*",
  states: [15],
  fn: (z80) => {
    // generic: {tcycles: 7, action: "$RI=z80.alu.add16($RI, $RP)"}
    z80.incTStateCount(7);
    z80.regs.iy = z80.alu.add16(z80.regs.iy, z80.regs.sp);
  },
});

// {n:68, x:1, y:0, z:4, p:0, q:0}
// LD $RY,$RZ
opcodes.set(0xfd44, {
  name: "LD B,IYH",
  template: "LD $RY,$RZ",
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
  name: "LD B,IYL",
  template: "LD $RY,$RZ",
  bytes: "fd 45",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.b = z80.regs.iyl;
  },
});

// {n:70, x:1, y:0, z:6, p:0, q:0}
// LD $RRY,($RI+$d)
opcodes.set(0xfd46, {
  name: "LD B,(IY+$D)",
  template: "LD $RRY,($RI+$d)",
  bytes: "fd 46 $2s",
  group: "Load 8bit",
  doc: "b=(iy+dd)",
  states: [19],
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
  name: "LD C,IYH",
  template: "LD $RY,$RZ",
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
  name: "LD C,IYL",
  template: "LD $RY,$RZ",
  bytes: "fd 4d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.c = z80.regs.iyl;
  },
});

// {n:78, x:1, y:1, z:6, p:0, q:1}
// LD $RRY,($RI+$d)
opcodes.set(0xfd4e, {
  name: "LD C,(IY+$D)",
  template: "LD $RRY,($RI+$d)",
  bytes: "fd 4e $2s",
  group: "Load 8bit",
  doc: "c=(iy+dd)",
  states: [19],
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
  name: "LD D,IYH",
  template: "LD $RY,$RZ",
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
  name: "LD D,IYL",
  template: "LD $RY,$RZ",
  bytes: "fd 55",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.d = z80.regs.iyl;
  },
});

// {n:86, x:1, y:2, z:6, p:1, q:0}
// LD $RRY,($RI+$d)
opcodes.set(0xfd56, {
  name: "LD D,(IY+$D)",
  template: "LD $RRY,($RI+$d)",
  bytes: "fd 56 $2s",
  group: "Load 8bit",
  doc: "d=(iy+dd)",
  states: [19],
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
  name: "LD E,IYH",
  template: "LD $RY,$RZ",
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
  name: "LD E,IYL",
  template: "LD $RY,$RZ",
  bytes: "fd 5d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.e = z80.regs.iyl;
  },
});

// {n:94, x:1, y:3, z:6, p:1, q:1}
// LD $RRY,($RI+$d)
opcodes.set(0xfd5e, {
  name: "LD E,(IY+$D)",
  template: "LD $RRY,($RI+$d)",
  bytes: "fd 5e $2s",
  group: "Load 8bit",
  doc: "e=(iy+dd)",
  states: [19],
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
  name: "LD IYH,B",
  template: "LD $RY,$RZ",
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
  name: "LD IYH,C",
  template: "LD $RY,$RZ",
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
  name: "LD IYH,D",
  template: "LD $RY,$RZ",
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
  name: "LD IYH,E",
  template: "LD $RY,$RZ",
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
  name: "LD IYH,IYH",
  template: "LD $RY,$RZ",
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
  name: "LD IYH,IYL",
  template: "LD $RY,$RZ",
  bytes: "fd 65",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyh = z80.regs.iyl;
  },
});

// {n:102, x:1, y:4, z:6, p:2, q:0}
// LD $RRY,($RI+$d)
opcodes.set(0xfd66, {
  name: "LD H,(IY+$D)",
  template: "LD $RRY,($RI+$d)",
  bytes: "fd 66 $2s",
  group: "Load 8bit",
  doc: "h=(iy+dd)",
  states: [19],
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
  name: "LD IYH,A",
  template: "LD $RY,$RZ",
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
  name: "LD IYL,B",
  template: "LD $RY,$RZ",
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
  name: "LD IYL,C",
  template: "LD $RY,$RZ",
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
  name: "LD IYL,D",
  template: "LD $RY,$RZ",
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
  name: "LD IYL,E",
  template: "LD $RY,$RZ",
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
  name: "LD IYL,IYH",
  template: "LD $RY,$RZ",
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
  name: "LD IYL,IYL",
  template: "LD $RY,$RZ",
  bytes: "fd 6d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyl = z80.regs.iyl;
  },
});

// {n:110, x:1, y:5, z:6, p:2, q:1}
// LD $RRY,($RI+$d)
opcodes.set(0xfd6e, {
  name: "LD L,(IY+$D)",
  template: "LD $RRY,($RI+$d)",
  bytes: "fd 6e $2s",
  group: "Load 8bit",
  doc: "l=(iy+dd)",
  states: [19],
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
  name: "LD IYL,A",
  template: "LD $RY,$RZ",
  bytes: "fd 6f",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.iyl = z80.regs.a;
  },
});

// {n:112, x:1, y:6, z:0, p:3, q:0}
// LD ($RI+$d),$RRZ
opcodes.set(0xfd70, {
  name: "LD (IY+$D),B",
  template: "LD ($RI+$d),$RRZ",
  bytes: "fd 70 $1s",
  group: "Load 8bit",
  doc: "(iy+dd) = b",
  states: [19],
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
// LD ($RI+$d),$RRZ
opcodes.set(0xfd71, {
  name: "LD (IY+$D),C",
  template: "LD ($RI+$d),$RRZ",
  bytes: "fd 71 $1s",
  group: "Load 8bit",
  doc: "(iy+dd) = c",
  states: [19],
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
// LD ($RI+$d),$RRZ
opcodes.set(0xfd72, {
  name: "LD (IY+$D),D",
  template: "LD ($RI+$d),$RRZ",
  bytes: "fd 72 $1s",
  group: "Load 8bit",
  doc: "(iy+dd) = d",
  states: [19],
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
// LD ($RI+$d),$RRZ
opcodes.set(0xfd73, {
  name: "LD (IY+$D),E",
  template: "LD ($RI+$d),$RRZ",
  bytes: "fd 73 $1s",
  group: "Load 8bit",
  doc: "(iy+dd) = e",
  states: [19],
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
// LD ($RI+$d),$RRZ
opcodes.set(0xfd74, {
  name: "LD (IY+$D),H",
  template: "LD ($RI+$d),$RRZ",
  bytes: "fd 74 $1s",
  group: "Load 8bit",
  doc: "(iy+dd) = h",
  states: [19],
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
// LD ($RI+$d),$RRZ
opcodes.set(0xfd75, {
  name: "LD (IY+$D),L",
  template: "LD ($RI+$d),$RRZ",
  bytes: "fd 75 $1s",
  group: "Load 8bit",
  doc: "(iy+dd) = l",
  states: [19],
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
// LD ($RI+$d),$RRZ
opcodes.set(0xfd77, {
  name: "LD (IY+$D),A",
  template: "LD ($RI+$d),$RRZ",
  bytes: "fd 77 $1s",
  group: "Load 8bit",
  doc: "(iy+dd) = a",
  states: [19],
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
  name: "LD A,IYH",
  template: "LD $RY,$RZ",
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
  name: "LD A,IYL",
  template: "LD $RY,$RZ",
  bytes: "fd 7d",
  group: "Load 8bit",
  fn: (z80) => {
    // overlapped: {action: "$RY=$RZ"}
    z80.regs.a = z80.regs.iyl;
  },
});

// {n:126, x:1, y:7, z:6, p:3, q:1}
// LD $RRY,($RI+$d)
opcodes.set(0xfd7e, {
  name: "LD A,(IY+$D)",
  template: "LD $RRY,($RI+$d)",
  bytes: "fd 7e $2s",
  group: "Load 8bit",
  doc: "a=(iy+dd)",
  states: [19],
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

// {n:133, x:2, y:0, z:5, p:0, q:0}
// $ALU $RZ
opcodes.set(0xfd85, {
  name: "ADD A,IYL",
  template: "$ALU $RZ",
  bytes: "fd 85",
  group: "ALU 8bit",
  doc: "A := A add iyl",
  flags: "***V0*",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.add(z80.regs.iyl);
  },
});

// {n:134, x:2, y:0, z:6, p:0, q:0}
// $ALU ($RI+$d)
opcodes.set(0xfd86, {
  name: "ADD A,(IY+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "fd 86 $1s",
  group: "ALU 8bit",
  doc: "A=A add (iy+dd)",
  flags: "***V0*",
  states: [19],
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
    z80.alu.add(z80.dbus);
  },
});

// {n:141, x:2, y:1, z:5, p:0, q:1}
// $ALU $RZ
opcodes.set(0xfd8d, {
  name: "ADC A,IYL",
  template: "$ALU $RZ",
  bytes: "fd 8d",
  group: "ALU 8bit",
  doc: "A := A adc iyl",
  flags: "***V0*",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.adc(z80.regs.iyl);
  },
});

// {n:142, x:2, y:1, z:6, p:0, q:1}
// $ALU ($RI+$d)
opcodes.set(0xfd8e, {
  name: "ADC A,(IY+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "fd 8e $1s",
  group: "ALU 8bit",
  doc: "A=A adc (iy+dd)",
  flags: "***V0*",
  states: [19],
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
    z80.alu.adc(z80.dbus);
  },
});

// {n:149, x:2, y:2, z:5, p:1, q:0}
// $ALU $RZ
opcodes.set(0xfd95, {
  name: "SUB IYL",
  template: "$ALU $RZ",
  bytes: "fd 95",
  group: "ALU 8bit",
  doc: "A := A sub iyl",
  flags: "***V1*",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sub(z80.regs.iyl);
  },
});

// {n:150, x:2, y:2, z:6, p:1, q:0}
// $ALU ($RI+$d)
opcodes.set(0xfd96, {
  name: "SUB (IY+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "fd 96 $1s",
  group: "ALU 8bit",
  doc: "A=A sub (iy+dd)",
  flags: "***V1*",
  states: [19],
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
    z80.alu.sub(z80.dbus);
  },
});

// {n:157, x:2, y:3, z:5, p:1, q:1}
// $ALU $RZ
opcodes.set(0xfd9d, {
  name: "SBC A,IYL",
  template: "$ALU $RZ",
  bytes: "fd 9d",
  group: "ALU 8bit",
  doc: "A := A sbc iyl",
  flags: "***V1*",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.sbc(z80.regs.iyl);
  },
});

// {n:158, x:2, y:3, z:6, p:1, q:1}
// $ALU ($RI+$d)
opcodes.set(0xfd9e, {
  name: "SBC A,(IY+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "fd 9e $1s",
  group: "ALU 8bit",
  doc: "A=A sbc (iy+dd)",
  flags: "***V1*",
  states: [19],
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
    z80.alu.sbc(z80.dbus);
  },
});

// {n:165, x:2, y:4, z:5, p:2, q:0}
// $ALU $RZ
opcodes.set(0xfda5, {
  name: "AND IYL",
  template: "$ALU $RZ",
  bytes: "fd a5",
  group: "ALU 8bit",
  doc: "A := A and iyl",
  flags: "***P00",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.and(z80.regs.iyl);
  },
});

// {n:166, x:2, y:4, z:6, p:2, q:0}
// $ALU ($RI+$d)
opcodes.set(0xfda6, {
  name: "AND (IY+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "fd a6 $1s",
  group: "ALU 8bit",
  doc: "A=A and (iy+dd)",
  flags: "***P00",
  states: [19],
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
    z80.alu.and(z80.dbus);
  },
});

// {n:173, x:2, y:5, z:5, p:2, q:1}
// $ALU $RZ
opcodes.set(0xfdad, {
  name: "XOR IYL",
  template: "$ALU $RZ",
  bytes: "fd ad",
  group: "ALU 8bit",
  doc: "A := A xor iyl",
  flags: "***P00",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.xor(z80.regs.iyl);
  },
});

// {n:174, x:2, y:5, z:6, p:2, q:1}
// $ALU ($RI+$d)
opcodes.set(0xfdae, {
  name: "XOR (IY+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "fd ae $1s",
  group: "ALU 8bit",
  doc: "A=A xor (iy+dd)",
  flags: "***P00",
  states: [19],
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
    z80.alu.xor(z80.dbus);
  },
});

// {n:181, x:2, y:6, z:5, p:3, q:0}
// $ALU $RZ
opcodes.set(0xfdb5, {
  name: "OR IYL",
  template: "$ALU $RZ",
  bytes: "fd b5",
  group: "ALU 8bit",
  doc: "A := A or iyl",
  flags: "***P00",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.or(z80.regs.iyl);
  },
});

// {n:182, x:2, y:6, z:6, p:3, q:0}
// $ALU ($RI+$d)
opcodes.set(0xfdb6, {
  name: "OR (IY+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "fd b6 $1s",
  group: "ALU 8bit",
  doc: "A=A or (iy+dd)",
  flags: "***P00",
  states: [19],
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
    z80.alu.or(z80.dbus);
  },
});

// {n:189, x:2, y:7, z:5, p:3, q:1}
// $ALU $RZ
opcodes.set(0xfdbd, {
  name: "CP IYL",
  template: "$ALU $RZ",
  bytes: "fd bd",
  group: "ALU 8bit",
  doc: "A := A cp iyl",
  flags: "***V1*",
  states: [19],
  fn: (z80) => {
    // overlapped: {action: "$ALU($RZ)"}
    z80.alu.cp(z80.regs.iyl);
  },
});

// {n:190, x:2, y:7, z:6, p:3, q:1}
// $ALU ($RI+$d)
opcodes.set(0xfdbe, {
  name: "CP (IY+$D)",
  template: "$ALU ($RI+$d)",
  bytes: "fd be $1s",
  group: "ALU 8bit",
  doc: "A=A cp (iy+dd)",
  flags: "***V1*",
  states: [19],
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
    z80.alu.cp(z80.dbus);
  },
});

// {n:203, x:3, y:1, z:3, p:0, q:1}
// CB prefix
opcodes.set(0xfdcb, {
  name: "CB XXX",
  template: "CB prefix",
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
  name: "POP IY",
  template: "POP $RP2",
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
  name: "EX (SP),IY",
  template: "EX (SP),$RI",
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
  name: "PUSH IY",
  template: "PUSH $RP2",
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
  name: "JP IY",
  template: "JP $RI",
  bytes: "fd e9",
  group: "Control flow",
  doc: "JMP to iy",
  fn: (z80) => {
    // overlapped: {action: "$PC=$RP"}
    z80.regs.pc = z80.regs.iy;
  },
});

// {n:249, x:3, y:7, z:1, p:3, q:1}
// LD SP,$RI
opcodes.set(0xfdf9, {
  name: "LD SP,IY",
  template: "LD SP,$RI",
  bytes: "fd f9",
  group: "Load 16bit",
  fn: (z80) => {
    // generic: {tcycles: 2, action: "$SP=$RI"}
    z80.incTStateCount(2);
    z80.regs.sp = z80.regs.iy;
  },
});

// {n:0, x:0, y:0, z:0, p:0, q:0}
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb00, {
  name: "RLC (IX+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 00 $1s",
  group: "RT/SH 8bit",
  doc: "b = Rotate left through carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb01, {
  name: "RLC (IX+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 01 $1s",
  group: "RT/SH 8bit",
  doc: "c = Rotate left through carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb02, {
  name: "RLC (IX+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 02 $1s",
  group: "RT/SH 8bit",
  doc: "d = Rotate left through carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb03, {
  name: "RLC (IX+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 03 $1s",
  group: "RT/SH 8bit",
  doc: "e = Rotate left through carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb04, {
  name: "RLC (IX+$D),IXH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 04 $1s",
  group: "RT/SH 8bit",
  doc: "ixh = Rotate left through carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb05, {
  name: "RLC (IX+$D),IXL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 05 $1s",
  group: "RT/SH 8bit",
  doc: "ixl = Rotate left through carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb07, {
  name: "RLC (IX+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 07 $1s",
  group: "RT/SH 8bit",
  doc: "a = Rotate left through carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb08, {
  name: "RRC (IX+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 08 $1s",
  group: "RT/SH 8bit",
  doc: "b = Rotate right through carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb09, {
  name: "RRC (IX+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 09 $1s",
  group: "RT/SH 8bit",
  doc: "c = Rotate right through carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb0a, {
  name: "RRC (IX+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 0a $1s",
  group: "RT/SH 8bit",
  doc: "d = Rotate right through carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb0b, {
  name: "RRC (IX+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 0b $1s",
  group: "RT/SH 8bit",
  doc: "e = Rotate right through carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb0c, {
  name: "RRC (IX+$D),IXH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 0c $1s",
  group: "RT/SH 8bit",
  doc: "ixh = Rotate right through carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb0d, {
  name: "RRC (IX+$D),IXL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 0d $1s",
  group: "RT/SH 8bit",
  doc: "ixl = Rotate right through carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb0f, {
  name: "RRC (IX+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 0f $1s",
  group: "RT/SH 8bit",
  doc: "a = Rotate right through carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb10, {
  name: "RL (IX+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 10 $1s",
  group: "RT/SH 8bit",
  doc: "b = Rotate left from carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb11, {
  name: "RL (IX+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 11 $1s",
  group: "RT/SH 8bit",
  doc: "c = Rotate left from carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb12, {
  name: "RL (IX+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 12 $1s",
  group: "RT/SH 8bit",
  doc: "d = Rotate left from carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb13, {
  name: "RL (IX+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 13 $1s",
  group: "RT/SH 8bit",
  doc: "e = Rotate left from carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb14, {
  name: "RL (IX+$D),IXH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 14 $1s",
  group: "RT/SH 8bit",
  doc: "ixh = Rotate left from carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb15, {
  name: "RL (IX+$D),IXL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 15 $1s",
  group: "RT/SH 8bit",
  doc: "ixl = Rotate left from carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb17, {
  name: "RL (IX+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 17 $1s",
  group: "RT/SH 8bit",
  doc: "a = Rotate left from carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb18, {
  name: "RR (IX+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 18 $1s",
  group: "RT/SH 8bit",
  doc: "b = Rotate right from carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb19, {
  name: "RR (IX+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 19 $1s",
  group: "RT/SH 8bit",
  doc: "c = Rotate right from carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb1a, {
  name: "RR (IX+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 1a $1s",
  group: "RT/SH 8bit",
  doc: "d = Rotate right from carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb1b, {
  name: "RR (IX+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 1b $1s",
  group: "RT/SH 8bit",
  doc: "e = Rotate right from carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb1c, {
  name: "RR (IX+$D),IXH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 1c $1s",
  group: "RT/SH 8bit",
  doc: "ixh = Rotate right from carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb1d, {
  name: "RR (IX+$D),IXL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 1d $1s",
  group: "RT/SH 8bit",
  doc: "ixl = Rotate right from carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb1f, {
  name: "RR (IX+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 1f $1s",
  group: "RT/SH 8bit",
  doc: "a = Rotate right from carry (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb20, {
  name: "SLA (IX+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 20 $1s",
  group: "RT/SH 8bit",
  doc: "b = Shift left arithmetic (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb21, {
  name: "SLA (IX+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 21 $1s",
  group: "RT/SH 8bit",
  doc: "c = Shift left arithmetic (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb22, {
  name: "SLA (IX+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 22 $1s",
  group: "RT/SH 8bit",
  doc: "d = Shift left arithmetic (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb23, {
  name: "SLA (IX+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 23 $1s",
  group: "RT/SH 8bit",
  doc: "e = Shift left arithmetic (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb24, {
  name: "SLA (IX+$D),IXH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 24 $1s",
  group: "RT/SH 8bit",
  doc: "ixh = Shift left arithmetic (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb25, {
  name: "SLA (IX+$D),IXL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 25 $1s",
  group: "RT/SH 8bit",
  doc: "ixl = Shift left arithmetic (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb27, {
  name: "SLA (IX+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 27 $1s",
  group: "RT/SH 8bit",
  doc: "a = Shift left arithmetic (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb28, {
  name: "SRA (IX+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 28 $1s",
  group: "RT/SH 8bit",
  doc: "b = Shift right arithmetic (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb29, {
  name: "SRA (IX+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 29 $1s",
  group: "RT/SH 8bit",
  doc: "c = Shift right arithmetic (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb2a, {
  name: "SRA (IX+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 2a $1s",
  group: "RT/SH 8bit",
  doc: "d = Shift right arithmetic (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb2b, {
  name: "SRA (IX+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 2b $1s",
  group: "RT/SH 8bit",
  doc: "e = Shift right arithmetic (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb2c, {
  name: "SRA (IX+$D),IXH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 2c $1s",
  group: "RT/SH 8bit",
  doc: "ixh = Shift right arithmetic (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb2d, {
  name: "SRA (IX+$D),IXL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 2d $1s",
  group: "RT/SH 8bit",
  doc: "ixl = Shift right arithmetic (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb2f, {
  name: "SRA (IX+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 2f $1s",
  group: "RT/SH 8bit",
  doc: "a = Shift right arithmetic (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb30, {
  name: "SLL (IX+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 30 $1s",
  group: "RT/SH 8bit",
  doc: "b = Shift left logical (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb31, {
  name: "SLL (IX+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 31 $1s",
  group: "RT/SH 8bit",
  doc: "c = Shift left logical (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb32, {
  name: "SLL (IX+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 32 $1s",
  group: "RT/SH 8bit",
  doc: "d = Shift left logical (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb33, {
  name: "SLL (IX+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 33 $1s",
  group: "RT/SH 8bit",
  doc: "e = Shift left logical (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb34, {
  name: "SLL (IX+$D),IXH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 34 $1s",
  group: "RT/SH 8bit",
  doc: "ixh = Shift left logical (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb35, {
  name: "SLL (IX+$D),IXL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 35 $1s",
  group: "RT/SH 8bit",
  doc: "ixl = Shift left logical (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb37, {
  name: "SLL (IX+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 37 $1s",
  group: "RT/SH 8bit",
  doc: "a = Shift left logical (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb38, {
  name: "SRL (IX+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 38 $1s",
  group: "RT/SH 8bit",
  doc: "b = Shift right logical (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb39, {
  name: "SRL (IX+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 39 $1s",
  group: "RT/SH 8bit",
  doc: "c = Shift right logical (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb3a, {
  name: "SRL (IX+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 3a $1s",
  group: "RT/SH 8bit",
  doc: "d = Shift right logical (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb3b, {
  name: "SRL (IX+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 3b $1s",
  group: "RT/SH 8bit",
  doc: "e = Shift right logical (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb3c, {
  name: "SRL (IX+$D),IXH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 3c $1s",
  group: "RT/SH 8bit",
  doc: "ixh = Shift right logical (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb3d, {
  name: "SRL (IX+$D),IXL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 3d $1s",
  group: "RT/SH 8bit",
  doc: "ixl = Shift right logical (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xddcb3f, {
  name: "SRL (IX+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "dd cb 3f $1s",
  group: "RT/SH 8bit",
  doc: "a = Shift right logical (ix+d)",
  flags: "**0P0*",
  states: [23],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xddcb46, {
  name: "BIT 0,(IX+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "dd cb 46 $2s",
  group: "Bits",
  doc: "f.Z = bit 0 of (ix+d)",
  flags: "**1*0-",
  states: [20],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xddcb4e, {
  name: "BIT 1,(IX+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "dd cb 4e $2s",
  group: "Bits",
  doc: "f.Z = bit 1 of (ix+d)",
  flags: "**1*0-",
  states: [20],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xddcb56, {
  name: "BIT 2,(IX+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "dd cb 56 $2s",
  group: "Bits",
  doc: "f.Z = bit 2 of (ix+d)",
  flags: "**1*0-",
  states: [20],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xddcb5e, {
  name: "BIT 3,(IX+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "dd cb 5e $2s",
  group: "Bits",
  doc: "f.Z = bit 3 of (ix+d)",
  flags: "**1*0-",
  states: [20],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xddcb66, {
  name: "BIT 4,(IX+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "dd cb 66 $2s",
  group: "Bits",
  doc: "f.Z = bit 4 of (ix+d)",
  flags: "**1*0-",
  states: [20],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xddcb6e, {
  name: "BIT 5,(IX+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "dd cb 6e $2s",
  group: "Bits",
  doc: "f.Z = bit 5 of (ix+d)",
  flags: "**1*0-",
  states: [20],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xddcb76, {
  name: "BIT 6,(IX+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "dd cb 76 $2s",
  group: "Bits",
  doc: "f.Z = bit 6 of (ix+d)",
  flags: "**1*0-",
  states: [20],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xddcb7e, {
  name: "BIT 7,(IX+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "dd cb 7e $2s",
  group: "Bits",
  doc: "f.Z = bit 7 of (ix+d)",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb80, {
  name: "RES 0,(IX+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 80 $2s",
  group: "Bits",
  doc: "Reset bit 0 of (ix+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb81, {
  name: "RES 0,(IX+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 81 $2s",
  group: "Bits",
  doc: "Reset bit 0 of (ix+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb82, {
  name: "RES 0,(IX+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 82 $2s",
  group: "Bits",
  doc: "Reset bit 0 of (ix+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb83, {
  name: "RES 0,(IX+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 83 $2s",
  group: "Bits",
  doc: "Reset bit 0 of (ix+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb84, {
  name: "RES 0,(IX+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 84 $2s",
  group: "Bits",
  doc: "Reset bit 0 of (ix+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb85, {
  name: "RES 0,(IX+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 85 $2s",
  group: "Bits",
  doc: "Reset bit 0 of (ix+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcb86, {
  name: "RES 0,(IX+$D),(IX+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb 86 $2s $3s",
  group: "Bits",
  doc: "Reset bit 0 of (ix+dd) load into (ix+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb87, {
  name: "RES 0,(IX+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 87 $2s",
  group: "Bits",
  doc: "Reset bit 0 of (ix+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb88, {
  name: "RES 1,(IX+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 88 $2s",
  group: "Bits",
  doc: "Reset bit 1 of (ix+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb89, {
  name: "RES 1,(IX+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 89 $2s",
  group: "Bits",
  doc: "Reset bit 1 of (ix+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb8a, {
  name: "RES 1,(IX+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 8a $2s",
  group: "Bits",
  doc: "Reset bit 1 of (ix+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb8b, {
  name: "RES 1,(IX+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 8b $2s",
  group: "Bits",
  doc: "Reset bit 1 of (ix+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb8c, {
  name: "RES 1,(IX+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 8c $2s",
  group: "Bits",
  doc: "Reset bit 1 of (ix+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb8d, {
  name: "RES 1,(IX+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 8d $2s",
  group: "Bits",
  doc: "Reset bit 1 of (ix+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcb8e, {
  name: "RES 1,(IX+$D),(IX+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb 8e $2s $3s",
  group: "Bits",
  doc: "Reset bit 1 of (ix+dd) load into (ix+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb8f, {
  name: "RES 1,(IX+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 8f $2s",
  group: "Bits",
  doc: "Reset bit 1 of (ix+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb90, {
  name: "RES 2,(IX+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 90 $2s",
  group: "Bits",
  doc: "Reset bit 2 of (ix+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb91, {
  name: "RES 2,(IX+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 91 $2s",
  group: "Bits",
  doc: "Reset bit 2 of (ix+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb92, {
  name: "RES 2,(IX+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 92 $2s",
  group: "Bits",
  doc: "Reset bit 2 of (ix+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb93, {
  name: "RES 2,(IX+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 93 $2s",
  group: "Bits",
  doc: "Reset bit 2 of (ix+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb94, {
  name: "RES 2,(IX+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 94 $2s",
  group: "Bits",
  doc: "Reset bit 2 of (ix+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb95, {
  name: "RES 2,(IX+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 95 $2s",
  group: "Bits",
  doc: "Reset bit 2 of (ix+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcb96, {
  name: "RES 2,(IX+$D),(IX+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb 96 $2s $3s",
  group: "Bits",
  doc: "Reset bit 2 of (ix+dd) load into (ix+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb97, {
  name: "RES 2,(IX+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 97 $2s",
  group: "Bits",
  doc: "Reset bit 2 of (ix+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb98, {
  name: "RES 3,(IX+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 98 $2s",
  group: "Bits",
  doc: "Reset bit 3 of (ix+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb99, {
  name: "RES 3,(IX+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 99 $2s",
  group: "Bits",
  doc: "Reset bit 3 of (ix+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb9a, {
  name: "RES 3,(IX+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 9a $2s",
  group: "Bits",
  doc: "Reset bit 3 of (ix+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb9b, {
  name: "RES 3,(IX+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 9b $2s",
  group: "Bits",
  doc: "Reset bit 3 of (ix+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb9c, {
  name: "RES 3,(IX+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 9c $2s",
  group: "Bits",
  doc: "Reset bit 3 of (ix+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb9d, {
  name: "RES 3,(IX+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 9d $2s",
  group: "Bits",
  doc: "Reset bit 3 of (ix+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcb9e, {
  name: "RES 3,(IX+$D),(IX+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb 9e $2s $3s",
  group: "Bits",
  doc: "Reset bit 3 of (ix+dd) load into (ix+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcb9f, {
  name: "RES 3,(IX+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb 9f $2s",
  group: "Bits",
  doc: "Reset bit 3 of (ix+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcba0, {
  name: "RES 4,(IX+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb a0 $2s",
  group: "Bits",
  doc: "Reset bit 4 of (ix+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcba1, {
  name: "RES 4,(IX+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb a1 $2s",
  group: "Bits",
  doc: "Reset bit 4 of (ix+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcba2, {
  name: "RES 4,(IX+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb a2 $2s",
  group: "Bits",
  doc: "Reset bit 4 of (ix+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcba3, {
  name: "RES 4,(IX+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb a3 $2s",
  group: "Bits",
  doc: "Reset bit 4 of (ix+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcba4, {
  name: "RES 4,(IX+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb a4 $2s",
  group: "Bits",
  doc: "Reset bit 4 of (ix+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcba5, {
  name: "RES 4,(IX+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb a5 $2s",
  group: "Bits",
  doc: "Reset bit 4 of (ix+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcba6, {
  name: "RES 4,(IX+$D),(IX+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb a6 $2s $3s",
  group: "Bits",
  doc: "Reset bit 4 of (ix+dd) load into (ix+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcba7, {
  name: "RES 4,(IX+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb a7 $2s",
  group: "Bits",
  doc: "Reset bit 4 of (ix+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcba8, {
  name: "RES 5,(IX+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb a8 $2s",
  group: "Bits",
  doc: "Reset bit 5 of (ix+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcba9, {
  name: "RES 5,(IX+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb a9 $2s",
  group: "Bits",
  doc: "Reset bit 5 of (ix+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbaa, {
  name: "RES 5,(IX+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb aa $2s",
  group: "Bits",
  doc: "Reset bit 5 of (ix+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbab, {
  name: "RES 5,(IX+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb ab $2s",
  group: "Bits",
  doc: "Reset bit 5 of (ix+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbac, {
  name: "RES 5,(IX+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb ac $2s",
  group: "Bits",
  doc: "Reset bit 5 of (ix+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbad, {
  name: "RES 5,(IX+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb ad $2s",
  group: "Bits",
  doc: "Reset bit 5 of (ix+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcbae, {
  name: "RES 5,(IX+$D),(IX+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb ae $2s $3s",
  group: "Bits",
  doc: "Reset bit 5 of (ix+dd) load into (ix+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbaf, {
  name: "RES 5,(IX+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb af $2s",
  group: "Bits",
  doc: "Reset bit 5 of (ix+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbb0, {
  name: "RES 6,(IX+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb b0 $2s",
  group: "Bits",
  doc: "Reset bit 6 of (ix+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbb1, {
  name: "RES 6,(IX+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb b1 $2s",
  group: "Bits",
  doc: "Reset bit 6 of (ix+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbb2, {
  name: "RES 6,(IX+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb b2 $2s",
  group: "Bits",
  doc: "Reset bit 6 of (ix+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbb3, {
  name: "RES 6,(IX+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb b3 $2s",
  group: "Bits",
  doc: "Reset bit 6 of (ix+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbb4, {
  name: "RES 6,(IX+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb b4 $2s",
  group: "Bits",
  doc: "Reset bit 6 of (ix+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbb5, {
  name: "RES 6,(IX+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb b5 $2s",
  group: "Bits",
  doc: "Reset bit 6 of (ix+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcbb6, {
  name: "RES 6,(IX+$D),(IX+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb b6 $2s $3s",
  group: "Bits",
  doc: "Reset bit 6 of (ix+dd) load into (ix+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbb7, {
  name: "RES 6,(IX+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb b7 $2s",
  group: "Bits",
  doc: "Reset bit 6 of (ix+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbb8, {
  name: "RES 7,(IX+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb b8 $2s",
  group: "Bits",
  doc: "Reset bit 7 of (ix+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbb9, {
  name: "RES 7,(IX+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb b9 $2s",
  group: "Bits",
  doc: "Reset bit 7 of (ix+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbba, {
  name: "RES 7,(IX+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb ba $2s",
  group: "Bits",
  doc: "Reset bit 7 of (ix+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbbb, {
  name: "RES 7,(IX+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb bb $2s",
  group: "Bits",
  doc: "Reset bit 7 of (ix+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbbc, {
  name: "RES 7,(IX+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb bc $2s",
  group: "Bits",
  doc: "Reset bit 7 of (ix+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbbd, {
  name: "RES 7,(IX+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb bd $2s",
  group: "Bits",
  doc: "Reset bit 7 of (ix+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcbbe, {
  name: "RES 7,(IX+$D),(IX+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb be $2s $3s",
  group: "Bits",
  doc: "Reset bit 7 of (ix+dd) load into (ix+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbbf, {
  name: "RES 7,(IX+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "dd cb bf $2s",
  group: "Bits",
  doc: "Reset bit 7 of (ix+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbc0, {
  name: "SET 0,(IX+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb c0 $2s",
  group: "Bits",
  doc: "ld b, (set 0, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbc1, {
  name: "SET 0,(IX+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb c1 $2s",
  group: "Bits",
  doc: "ld c, (set 0, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbc2, {
  name: "SET 0,(IX+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb c2 $2s",
  group: "Bits",
  doc: "ld d, (set 0, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbc3, {
  name: "SET 0,(IX+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb c3 $2s",
  group: "Bits",
  doc: "ld e, (set 0, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbc4, {
  name: "SET 0,(IX+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb c4 $2s",
  group: "Bits",
  doc: "ld h, (set 0, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbc5, {
  name: "SET 0,(IX+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb c5 $2s",
  group: "Bits",
  doc: "ld l, (set 0, (ix+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcbc6, {
  name: "SET 0,(IX+$D),(IX+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb c6 $2s $3s",
  group: "Bits",
  doc: "ld (ix+dd), (set 0, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbc7, {
  name: "SET 0,(IX+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb c7 $2s",
  group: "Bits",
  doc: "ld a, (set 0, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbc8, {
  name: "SET 1,(IX+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb c8 $2s",
  group: "Bits",
  doc: "ld b, (set 1, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbc9, {
  name: "SET 1,(IX+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb c9 $2s",
  group: "Bits",
  doc: "ld c, (set 1, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbca, {
  name: "SET 1,(IX+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb ca $2s",
  group: "Bits",
  doc: "ld d, (set 1, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbcb, {
  name: "SET 1,(IX+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb cb $2s",
  group: "Bits",
  doc: "ld e, (set 1, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbcc, {
  name: "SET 1,(IX+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb cc $2s",
  group: "Bits",
  doc: "ld h, (set 1, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbcd, {
  name: "SET 1,(IX+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb cd $2s",
  group: "Bits",
  doc: "ld l, (set 1, (ix+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcbce, {
  name: "SET 1,(IX+$D),(IX+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb ce $2s $3s",
  group: "Bits",
  doc: "ld (ix+dd), (set 1, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbcf, {
  name: "SET 1,(IX+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb cf $2s",
  group: "Bits",
  doc: "ld a, (set 1, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbd0, {
  name: "SET 2,(IX+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb d0 $2s",
  group: "Bits",
  doc: "ld b, (set 2, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbd1, {
  name: "SET 2,(IX+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb d1 $2s",
  group: "Bits",
  doc: "ld c, (set 2, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbd2, {
  name: "SET 2,(IX+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb d2 $2s",
  group: "Bits",
  doc: "ld d, (set 2, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbd3, {
  name: "SET 2,(IX+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb d3 $2s",
  group: "Bits",
  doc: "ld e, (set 2, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbd4, {
  name: "SET 2,(IX+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb d4 $2s",
  group: "Bits",
  doc: "ld h, (set 2, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbd5, {
  name: "SET 2,(IX+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb d5 $2s",
  group: "Bits",
  doc: "ld l, (set 2, (ix+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcbd6, {
  name: "SET 2,(IX+$D),(IX+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb d6 $2s $3s",
  group: "Bits",
  doc: "ld (ix+dd), (set 2, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbd7, {
  name: "SET 2,(IX+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb d7 $2s",
  group: "Bits",
  doc: "ld a, (set 2, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbd8, {
  name: "SET 3,(IX+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb d8 $2s",
  group: "Bits",
  doc: "ld b, (set 3, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbd9, {
  name: "SET 3,(IX+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb d9 $2s",
  group: "Bits",
  doc: "ld c, (set 3, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbda, {
  name: "SET 3,(IX+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb da $2s",
  group: "Bits",
  doc: "ld d, (set 3, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbdb, {
  name: "SET 3,(IX+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb db $2s",
  group: "Bits",
  doc: "ld e, (set 3, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbdc, {
  name: "SET 3,(IX+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb dc $2s",
  group: "Bits",
  doc: "ld h, (set 3, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbdd, {
  name: "SET 3,(IX+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb dd $2s",
  group: "Bits",
  doc: "ld l, (set 3, (ix+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcbde, {
  name: "SET 3,(IX+$D),(IX+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb de $2s $3s",
  group: "Bits",
  doc: "ld (ix+dd), (set 3, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbdf, {
  name: "SET 3,(IX+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb df $2s",
  group: "Bits",
  doc: "ld a, (set 3, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbe0, {
  name: "SET 4,(IX+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb e0 $2s",
  group: "Bits",
  doc: "ld b, (set 4, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbe1, {
  name: "SET 4,(IX+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb e1 $2s",
  group: "Bits",
  doc: "ld c, (set 4, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbe2, {
  name: "SET 4,(IX+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb e2 $2s",
  group: "Bits",
  doc: "ld d, (set 4, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbe3, {
  name: "SET 4,(IX+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb e3 $2s",
  group: "Bits",
  doc: "ld e, (set 4, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbe4, {
  name: "SET 4,(IX+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb e4 $2s",
  group: "Bits",
  doc: "ld h, (set 4, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbe5, {
  name: "SET 4,(IX+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb e5 $2s",
  group: "Bits",
  doc: "ld l, (set 4, (ix+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcbe6, {
  name: "SET 4,(IX+$D),(IX+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb e6 $2s $3s",
  group: "Bits",
  doc: "ld (ix+dd), (set 4, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbe7, {
  name: "SET 4,(IX+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb e7 $2s",
  group: "Bits",
  doc: "ld a, (set 4, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbe8, {
  name: "SET 5,(IX+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb e8 $2s",
  group: "Bits",
  doc: "ld b, (set 5, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbe9, {
  name: "SET 5,(IX+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb e9 $2s",
  group: "Bits",
  doc: "ld c, (set 5, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbea, {
  name: "SET 5,(IX+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb ea $2s",
  group: "Bits",
  doc: "ld d, (set 5, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbeb, {
  name: "SET 5,(IX+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb eb $2s",
  group: "Bits",
  doc: "ld e, (set 5, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbec, {
  name: "SET 5,(IX+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb ec $2s",
  group: "Bits",
  doc: "ld h, (set 5, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbed, {
  name: "SET 5,(IX+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb ed $2s",
  group: "Bits",
  doc: "ld l, (set 5, (ix+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcbee, {
  name: "SET 5,(IX+$D),(IX+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb ee $2s $3s",
  group: "Bits",
  doc: "ld (ix+dd), (set 5, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbef, {
  name: "SET 5,(IX+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb ef $2s",
  group: "Bits",
  doc: "ld a, (set 5, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbf0, {
  name: "SET 6,(IX+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb f0 $2s",
  group: "Bits",
  doc: "ld b, (set 6, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbf1, {
  name: "SET 6,(IX+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb f1 $2s",
  group: "Bits",
  doc: "ld c, (set 6, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbf2, {
  name: "SET 6,(IX+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb f2 $2s",
  group: "Bits",
  doc: "ld d, (set 6, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbf3, {
  name: "SET 6,(IX+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb f3 $2s",
  group: "Bits",
  doc: "ld e, (set 6, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbf4, {
  name: "SET 6,(IX+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb f4 $2s",
  group: "Bits",
  doc: "ld h, (set 6, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbf5, {
  name: "SET 6,(IX+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb f5 $2s",
  group: "Bits",
  doc: "ld l, (set 6, (ix+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcbf6, {
  name: "SET 6,(IX+$D),(IX+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb f6 $2s $3s",
  group: "Bits",
  doc: "ld (ix+dd), (set 6, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbf7, {
  name: "SET 6,(IX+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb f7 $2s",
  group: "Bits",
  doc: "ld a, (set 6, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbf8, {
  name: "SET 7,(IX+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb f8 $2s",
  group: "Bits",
  doc: "ld b, (set 7, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbf9, {
  name: "SET 7,(IX+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb f9 $2s",
  group: "Bits",
  doc: "ld c, (set 7, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbfa, {
  name: "SET 7,(IX+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb fa $2s",
  group: "Bits",
  doc: "ld d, (set 7, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbfb, {
  name: "SET 7,(IX+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb fb $2s",
  group: "Bits",
  doc: "ld e, (set 7, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbfc, {
  name: "SET 7,(IX+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb fc $2s",
  group: "Bits",
  doc: "ld h, (set 7, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbfd, {
  name: "SET 7,(IX+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb fd $2s",
  group: "Bits",
  doc: "ld l, (set 7, (ix+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xddcbfe, {
  name: "SET 7,(IX+$D),(IX+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "dd cb fe $2s $3s",
  group: "Bits",
  doc: "ld (ix+dd), (set 7, (ix+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xddcbff, {
  name: "SET 7,(IX+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "dd cb ff $2s",
  group: "Bits",
  doc: "ld a, (set 7, (ix+dd))",
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb00, {
  name: "RLC (IY+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 00 $1s",
  group: "RT/SH 8bit",
  doc: "b = Rotate left through carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb01, {
  name: "RLC (IY+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 01 $1s",
  group: "RT/SH 8bit",
  doc: "c = Rotate left through carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb02, {
  name: "RLC (IY+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 02 $1s",
  group: "RT/SH 8bit",
  doc: "d = Rotate left through carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb03, {
  name: "RLC (IY+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 03 $1s",
  group: "RT/SH 8bit",
  doc: "e = Rotate left through carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb04, {
  name: "RLC (IY+$D),IYH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 04 $1s",
  group: "RT/SH 8bit",
  doc: "iyh = Rotate left through carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb05, {
  name: "RLC (IY+$D),IYL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 05 $1s",
  group: "RT/SH 8bit",
  doc: "iyl = Rotate left through carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb07, {
  name: "RLC (IY+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 07 $1s",
  group: "RT/SH 8bit",
  doc: "a = Rotate left through carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb08, {
  name: "RRC (IY+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 08 $1s",
  group: "RT/SH 8bit",
  doc: "b = Rotate right through carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb09, {
  name: "RRC (IY+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 09 $1s",
  group: "RT/SH 8bit",
  doc: "c = Rotate right through carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb0a, {
  name: "RRC (IY+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 0a $1s",
  group: "RT/SH 8bit",
  doc: "d = Rotate right through carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb0b, {
  name: "RRC (IY+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 0b $1s",
  group: "RT/SH 8bit",
  doc: "e = Rotate right through carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb0c, {
  name: "RRC (IY+$D),IYH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 0c $1s",
  group: "RT/SH 8bit",
  doc: "iyh = Rotate right through carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb0d, {
  name: "RRC (IY+$D),IYL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 0d $1s",
  group: "RT/SH 8bit",
  doc: "iyl = Rotate right through carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb0f, {
  name: "RRC (IY+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 0f $1s",
  group: "RT/SH 8bit",
  doc: "a = Rotate right through carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb10, {
  name: "RL (IY+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 10 $1s",
  group: "RT/SH 8bit",
  doc: "b = Rotate left from carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb11, {
  name: "RL (IY+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 11 $1s",
  group: "RT/SH 8bit",
  doc: "c = Rotate left from carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb12, {
  name: "RL (IY+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 12 $1s",
  group: "RT/SH 8bit",
  doc: "d = Rotate left from carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb13, {
  name: "RL (IY+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 13 $1s",
  group: "RT/SH 8bit",
  doc: "e = Rotate left from carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb14, {
  name: "RL (IY+$D),IYH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 14 $1s",
  group: "RT/SH 8bit",
  doc: "iyh = Rotate left from carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb15, {
  name: "RL (IY+$D),IYL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 15 $1s",
  group: "RT/SH 8bit",
  doc: "iyl = Rotate left from carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb17, {
  name: "RL (IY+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 17 $1s",
  group: "RT/SH 8bit",
  doc: "a = Rotate left from carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb18, {
  name: "RR (IY+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 18 $1s",
  group: "RT/SH 8bit",
  doc: "b = Rotate right from carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb19, {
  name: "RR (IY+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 19 $1s",
  group: "RT/SH 8bit",
  doc: "c = Rotate right from carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb1a, {
  name: "RR (IY+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 1a $1s",
  group: "RT/SH 8bit",
  doc: "d = Rotate right from carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb1b, {
  name: "RR (IY+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 1b $1s",
  group: "RT/SH 8bit",
  doc: "e = Rotate right from carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb1c, {
  name: "RR (IY+$D),IYH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 1c $1s",
  group: "RT/SH 8bit",
  doc: "iyh = Rotate right from carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb1d, {
  name: "RR (IY+$D),IYL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 1d $1s",
  group: "RT/SH 8bit",
  doc: "iyl = Rotate right from carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb1f, {
  name: "RR (IY+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 1f $1s",
  group: "RT/SH 8bit",
  doc: "a = Rotate right from carry (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb20, {
  name: "SLA (IY+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 20 $1s",
  group: "RT/SH 8bit",
  doc: "b = Shift left arithmetic (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb21, {
  name: "SLA (IY+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 21 $1s",
  group: "RT/SH 8bit",
  doc: "c = Shift left arithmetic (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb22, {
  name: "SLA (IY+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 22 $1s",
  group: "RT/SH 8bit",
  doc: "d = Shift left arithmetic (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb23, {
  name: "SLA (IY+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 23 $1s",
  group: "RT/SH 8bit",
  doc: "e = Shift left arithmetic (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb24, {
  name: "SLA (IY+$D),IYH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 24 $1s",
  group: "RT/SH 8bit",
  doc: "iyh = Shift left arithmetic (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb25, {
  name: "SLA (IY+$D),IYL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 25 $1s",
  group: "RT/SH 8bit",
  doc: "iyl = Shift left arithmetic (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb27, {
  name: "SLA (IY+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 27 $1s",
  group: "RT/SH 8bit",
  doc: "a = Shift left arithmetic (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb28, {
  name: "SRA (IY+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 28 $1s",
  group: "RT/SH 8bit",
  doc: "b = Shift right arithmetic (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb29, {
  name: "SRA (IY+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 29 $1s",
  group: "RT/SH 8bit",
  doc: "c = Shift right arithmetic (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb2a, {
  name: "SRA (IY+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 2a $1s",
  group: "RT/SH 8bit",
  doc: "d = Shift right arithmetic (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb2b, {
  name: "SRA (IY+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 2b $1s",
  group: "RT/SH 8bit",
  doc: "e = Shift right arithmetic (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb2c, {
  name: "SRA (IY+$D),IYH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 2c $1s",
  group: "RT/SH 8bit",
  doc: "iyh = Shift right arithmetic (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb2d, {
  name: "SRA (IY+$D),IYL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 2d $1s",
  group: "RT/SH 8bit",
  doc: "iyl = Shift right arithmetic (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb2f, {
  name: "SRA (IY+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 2f $1s",
  group: "RT/SH 8bit",
  doc: "a = Shift right arithmetic (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb30, {
  name: "SLL (IY+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 30 $1s",
  group: "RT/SH 8bit",
  doc: "b = Shift left logical (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb31, {
  name: "SLL (IY+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 31 $1s",
  group: "RT/SH 8bit",
  doc: "c = Shift left logical (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb32, {
  name: "SLL (IY+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 32 $1s",
  group: "RT/SH 8bit",
  doc: "d = Shift left logical (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb33, {
  name: "SLL (IY+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 33 $1s",
  group: "RT/SH 8bit",
  doc: "e = Shift left logical (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb34, {
  name: "SLL (IY+$D),IYH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 34 $1s",
  group: "RT/SH 8bit",
  doc: "iyh = Shift left logical (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb35, {
  name: "SLL (IY+$D),IYL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 35 $1s",
  group: "RT/SH 8bit",
  doc: "iyl = Shift left logical (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb37, {
  name: "SLL (IY+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 37 $1s",
  group: "RT/SH 8bit",
  doc: "a = Shift left logical (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb38, {
  name: "SRL (IY+$D),B",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 38 $1s",
  group: "RT/SH 8bit",
  doc: "b = Shift right logical (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb39, {
  name: "SRL (IY+$D),C",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 39 $1s",
  group: "RT/SH 8bit",
  doc: "c = Shift right logical (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb3a, {
  name: "SRL (IY+$D),D",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 3a $1s",
  group: "RT/SH 8bit",
  doc: "d = Shift right logical (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb3b, {
  name: "SRL (IY+$D),E",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 3b $1s",
  group: "RT/SH 8bit",
  doc: "e = Shift right logical (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb3c, {
  name: "SRL (IY+$D),IYH",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 3c $1s",
  group: "RT/SH 8bit",
  doc: "iyh = Shift right logical (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb3d, {
  name: "SRL (IY+$D),IYL",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 3d $1s",
  group: "RT/SH 8bit",
  doc: "iyl = Shift right logical (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// $ROT ($RI+$d),$RZ
opcodes.set(0xfdcb3f, {
  name: "SRL (IY+$D),A",
  template: "$ROT ($RI+$d),$RZ",
  bytes: "fd cb 3f $1s",
  group: "RT/SH 8bit",
  doc: "a = Shift right logical (iy+d)",
  flags: "**0P0*",
  states: [23],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xfdcb46, {
  name: "BIT 0,(IY+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "fd cb 46 $2s",
  group: "Bits",
  doc: "f.Z = bit 0 of (iy+d)",
  flags: "**1*0-",
  states: [20],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xfdcb4e, {
  name: "BIT 1,(IY+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "fd cb 4e $2s",
  group: "Bits",
  doc: "f.Z = bit 1 of (iy+d)",
  flags: "**1*0-",
  states: [20],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xfdcb56, {
  name: "BIT 2,(IY+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "fd cb 56 $2s",
  group: "Bits",
  doc: "f.Z = bit 2 of (iy+d)",
  flags: "**1*0-",
  states: [20],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xfdcb5e, {
  name: "BIT 3,(IY+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "fd cb 5e $2s",
  group: "Bits",
  doc: "f.Z = bit 3 of (iy+d)",
  flags: "**1*0-",
  states: [20],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xfdcb66, {
  name: "BIT 4,(IY+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "fd cb 66 $2s",
  group: "Bits",
  doc: "f.Z = bit 4 of (iy+d)",
  flags: "**1*0-",
  states: [20],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xfdcb6e, {
  name: "BIT 5,(IY+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "fd cb 6e $2s",
  group: "Bits",
  doc: "f.Z = bit 5 of (iy+d)",
  flags: "**1*0-",
  states: [20],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xfdcb76, {
  name: "BIT 6,(IY+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "fd cb 76 $2s",
  group: "Bits",
  doc: "f.Z = bit 6 of (iy+d)",
  flags: "**1*0-",
  states: [20],
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
// BIT $NY, ($RI+$d)
opcodes.set(0xfdcb7e, {
  name: "BIT 7,(IY+$D)",
  template: "BIT $NY, ($RI+$d)",
  bytes: "fd cb 7e $2s",
  group: "Bits",
  doc: "f.Z = bit 7 of (iy+d)",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb80, {
  name: "RES 0,(IY+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 80 $2s",
  group: "Bits",
  doc: "Reset bit 0 of (iy+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb81, {
  name: "RES 0,(IY+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 81 $2s",
  group: "Bits",
  doc: "Reset bit 0 of (iy+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb82, {
  name: "RES 0,(IY+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 82 $2s",
  group: "Bits",
  doc: "Reset bit 0 of (iy+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb83, {
  name: "RES 0,(IY+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 83 $2s",
  group: "Bits",
  doc: "Reset bit 0 of (iy+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb84, {
  name: "RES 0,(IY+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 84 $2s",
  group: "Bits",
  doc: "Reset bit 0 of (iy+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb85, {
  name: "RES 0,(IY+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 85 $2s",
  group: "Bits",
  doc: "Reset bit 0 of (iy+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcb86, {
  name: "RES 0,(IY+$D),(IY+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb 86 $2s $3s",
  group: "Bits",
  doc: "Reset bit 0 of (iy+dd) load into (iy+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb87, {
  name: "RES 0,(IY+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 87 $2s",
  group: "Bits",
  doc: "Reset bit 0 of (iy+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb88, {
  name: "RES 1,(IY+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 88 $2s",
  group: "Bits",
  doc: "Reset bit 1 of (iy+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb89, {
  name: "RES 1,(IY+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 89 $2s",
  group: "Bits",
  doc: "Reset bit 1 of (iy+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb8a, {
  name: "RES 1,(IY+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 8a $2s",
  group: "Bits",
  doc: "Reset bit 1 of (iy+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb8b, {
  name: "RES 1,(IY+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 8b $2s",
  group: "Bits",
  doc: "Reset bit 1 of (iy+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb8c, {
  name: "RES 1,(IY+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 8c $2s",
  group: "Bits",
  doc: "Reset bit 1 of (iy+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb8d, {
  name: "RES 1,(IY+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 8d $2s",
  group: "Bits",
  doc: "Reset bit 1 of (iy+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcb8e, {
  name: "RES 1,(IY+$D),(IY+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb 8e $2s $3s",
  group: "Bits",
  doc: "Reset bit 1 of (iy+dd) load into (iy+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb8f, {
  name: "RES 1,(IY+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 8f $2s",
  group: "Bits",
  doc: "Reset bit 1 of (iy+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb90, {
  name: "RES 2,(IY+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 90 $2s",
  group: "Bits",
  doc: "Reset bit 2 of (iy+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb91, {
  name: "RES 2,(IY+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 91 $2s",
  group: "Bits",
  doc: "Reset bit 2 of (iy+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb92, {
  name: "RES 2,(IY+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 92 $2s",
  group: "Bits",
  doc: "Reset bit 2 of (iy+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb93, {
  name: "RES 2,(IY+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 93 $2s",
  group: "Bits",
  doc: "Reset bit 2 of (iy+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb94, {
  name: "RES 2,(IY+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 94 $2s",
  group: "Bits",
  doc: "Reset bit 2 of (iy+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb95, {
  name: "RES 2,(IY+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 95 $2s",
  group: "Bits",
  doc: "Reset bit 2 of (iy+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcb96, {
  name: "RES 2,(IY+$D),(IY+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb 96 $2s $3s",
  group: "Bits",
  doc: "Reset bit 2 of (iy+dd) load into (iy+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb97, {
  name: "RES 2,(IY+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 97 $2s",
  group: "Bits",
  doc: "Reset bit 2 of (iy+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb98, {
  name: "RES 3,(IY+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 98 $2s",
  group: "Bits",
  doc: "Reset bit 3 of (iy+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb99, {
  name: "RES 3,(IY+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 99 $2s",
  group: "Bits",
  doc: "Reset bit 3 of (iy+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb9a, {
  name: "RES 3,(IY+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 9a $2s",
  group: "Bits",
  doc: "Reset bit 3 of (iy+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb9b, {
  name: "RES 3,(IY+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 9b $2s",
  group: "Bits",
  doc: "Reset bit 3 of (iy+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb9c, {
  name: "RES 3,(IY+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 9c $2s",
  group: "Bits",
  doc: "Reset bit 3 of (iy+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb9d, {
  name: "RES 3,(IY+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 9d $2s",
  group: "Bits",
  doc: "Reset bit 3 of (iy+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcb9e, {
  name: "RES 3,(IY+$D),(IY+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb 9e $2s $3s",
  group: "Bits",
  doc: "Reset bit 3 of (iy+dd) load into (iy+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcb9f, {
  name: "RES 3,(IY+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb 9f $2s",
  group: "Bits",
  doc: "Reset bit 3 of (iy+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcba0, {
  name: "RES 4,(IY+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb a0 $2s",
  group: "Bits",
  doc: "Reset bit 4 of (iy+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcba1, {
  name: "RES 4,(IY+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb a1 $2s",
  group: "Bits",
  doc: "Reset bit 4 of (iy+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcba2, {
  name: "RES 4,(IY+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb a2 $2s",
  group: "Bits",
  doc: "Reset bit 4 of (iy+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcba3, {
  name: "RES 4,(IY+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb a3 $2s",
  group: "Bits",
  doc: "Reset bit 4 of (iy+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcba4, {
  name: "RES 4,(IY+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb a4 $2s",
  group: "Bits",
  doc: "Reset bit 4 of (iy+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcba5, {
  name: "RES 4,(IY+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb a5 $2s",
  group: "Bits",
  doc: "Reset bit 4 of (iy+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcba6, {
  name: "RES 4,(IY+$D),(IY+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb a6 $2s $3s",
  group: "Bits",
  doc: "Reset bit 4 of (iy+dd) load into (iy+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcba7, {
  name: "RES 4,(IY+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb a7 $2s",
  group: "Bits",
  doc: "Reset bit 4 of (iy+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcba8, {
  name: "RES 5,(IY+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb a8 $2s",
  group: "Bits",
  doc: "Reset bit 5 of (iy+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcba9, {
  name: "RES 5,(IY+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb a9 $2s",
  group: "Bits",
  doc: "Reset bit 5 of (iy+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbaa, {
  name: "RES 5,(IY+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb aa $2s",
  group: "Bits",
  doc: "Reset bit 5 of (iy+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbab, {
  name: "RES 5,(IY+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb ab $2s",
  group: "Bits",
  doc: "Reset bit 5 of (iy+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbac, {
  name: "RES 5,(IY+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb ac $2s",
  group: "Bits",
  doc: "Reset bit 5 of (iy+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbad, {
  name: "RES 5,(IY+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb ad $2s",
  group: "Bits",
  doc: "Reset bit 5 of (iy+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcbae, {
  name: "RES 5,(IY+$D),(IY+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb ae $2s $3s",
  group: "Bits",
  doc: "Reset bit 5 of (iy+dd) load into (iy+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbaf, {
  name: "RES 5,(IY+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb af $2s",
  group: "Bits",
  doc: "Reset bit 5 of (iy+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbb0, {
  name: "RES 6,(IY+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb b0 $2s",
  group: "Bits",
  doc: "Reset bit 6 of (iy+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbb1, {
  name: "RES 6,(IY+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb b1 $2s",
  group: "Bits",
  doc: "Reset bit 6 of (iy+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbb2, {
  name: "RES 6,(IY+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb b2 $2s",
  group: "Bits",
  doc: "Reset bit 6 of (iy+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbb3, {
  name: "RES 6,(IY+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb b3 $2s",
  group: "Bits",
  doc: "Reset bit 6 of (iy+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbb4, {
  name: "RES 6,(IY+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb b4 $2s",
  group: "Bits",
  doc: "Reset bit 6 of (iy+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbb5, {
  name: "RES 6,(IY+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb b5 $2s",
  group: "Bits",
  doc: "Reset bit 6 of (iy+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcbb6, {
  name: "RES 6,(IY+$D),(IY+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb b6 $2s $3s",
  group: "Bits",
  doc: "Reset bit 6 of (iy+dd) load into (iy+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbb7, {
  name: "RES 6,(IY+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb b7 $2s",
  group: "Bits",
  doc: "Reset bit 6 of (iy+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbb8, {
  name: "RES 7,(IY+$D),B",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb b8 $2s",
  group: "Bits",
  doc: "Reset bit 7 of (iy+d) load into b",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbb9, {
  name: "RES 7,(IY+$D),C",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb b9 $2s",
  group: "Bits",
  doc: "Reset bit 7 of (iy+d) load into c",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbba, {
  name: "RES 7,(IY+$D),D",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb ba $2s",
  group: "Bits",
  doc: "Reset bit 7 of (iy+d) load into d",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbbb, {
  name: "RES 7,(IY+$D),E",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb bb $2s",
  group: "Bits",
  doc: "Reset bit 7 of (iy+d) load into e",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbbc, {
  name: "RES 7,(IY+$D),H",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb bc $2s",
  group: "Bits",
  doc: "Reset bit 7 of (iy+d) load into h",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbbd, {
  name: "RES 7,(IY+$D),L",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb bd $2s",
  group: "Bits",
  doc: "Reset bit 7 of (iy+d) load into l",
  flags: "**1*0-",
  states: [20],
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
// RES $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcbbe, {
  name: "RES 7,(IY+$D),(IY+$D)",
  template: "RES $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb be $2s $3s",
  group: "Bits",
  doc: "Reset bit 7 of (iy+dd) load into (iy+dd)",
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
// RES $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbbf, {
  name: "RES 7,(IY+$D),A",
  template: "RES $NY, ($RI+$d), $RRZ",
  bytes: "fd cb bf $2s",
  group: "Bits",
  doc: "Reset bit 7 of (iy+d) load into a",
  flags: "**1*0-",
  states: [20],
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbc0, {
  name: "SET 0,(IY+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb c0 $2s",
  group: "Bits",
  doc: "ld b, (set 0, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbc1, {
  name: "SET 0,(IY+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb c1 $2s",
  group: "Bits",
  doc: "ld c, (set 0, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbc2, {
  name: "SET 0,(IY+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb c2 $2s",
  group: "Bits",
  doc: "ld d, (set 0, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbc3, {
  name: "SET 0,(IY+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb c3 $2s",
  group: "Bits",
  doc: "ld e, (set 0, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbc4, {
  name: "SET 0,(IY+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb c4 $2s",
  group: "Bits",
  doc: "ld h, (set 0, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbc5, {
  name: "SET 0,(IY+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb c5 $2s",
  group: "Bits",
  doc: "ld l, (set 0, (iy+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcbc6, {
  name: "SET 0,(IY+$D),(IY+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb c6 $2s $3s",
  group: "Bits",
  doc: "ld (iy+dd), (set 0, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbc7, {
  name: "SET 0,(IY+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb c7 $2s",
  group: "Bits",
  doc: "ld a, (set 0, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbc8, {
  name: "SET 1,(IY+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb c8 $2s",
  group: "Bits",
  doc: "ld b, (set 1, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbc9, {
  name: "SET 1,(IY+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb c9 $2s",
  group: "Bits",
  doc: "ld c, (set 1, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbca, {
  name: "SET 1,(IY+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb ca $2s",
  group: "Bits",
  doc: "ld d, (set 1, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbcb, {
  name: "SET 1,(IY+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb cb $2s",
  group: "Bits",
  doc: "ld e, (set 1, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbcc, {
  name: "SET 1,(IY+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb cc $2s",
  group: "Bits",
  doc: "ld h, (set 1, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbcd, {
  name: "SET 1,(IY+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb cd $2s",
  group: "Bits",
  doc: "ld l, (set 1, (iy+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcbce, {
  name: "SET 1,(IY+$D),(IY+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb ce $2s $3s",
  group: "Bits",
  doc: "ld (iy+dd), (set 1, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbcf, {
  name: "SET 1,(IY+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb cf $2s",
  group: "Bits",
  doc: "ld a, (set 1, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbd0, {
  name: "SET 2,(IY+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb d0 $2s",
  group: "Bits",
  doc: "ld b, (set 2, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbd1, {
  name: "SET 2,(IY+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb d1 $2s",
  group: "Bits",
  doc: "ld c, (set 2, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbd2, {
  name: "SET 2,(IY+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb d2 $2s",
  group: "Bits",
  doc: "ld d, (set 2, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbd3, {
  name: "SET 2,(IY+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb d3 $2s",
  group: "Bits",
  doc: "ld e, (set 2, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbd4, {
  name: "SET 2,(IY+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb d4 $2s",
  group: "Bits",
  doc: "ld h, (set 2, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbd5, {
  name: "SET 2,(IY+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb d5 $2s",
  group: "Bits",
  doc: "ld l, (set 2, (iy+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcbd6, {
  name: "SET 2,(IY+$D),(IY+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb d6 $2s $3s",
  group: "Bits",
  doc: "ld (iy+dd), (set 2, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbd7, {
  name: "SET 2,(IY+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb d7 $2s",
  group: "Bits",
  doc: "ld a, (set 2, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbd8, {
  name: "SET 3,(IY+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb d8 $2s",
  group: "Bits",
  doc: "ld b, (set 3, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbd9, {
  name: "SET 3,(IY+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb d9 $2s",
  group: "Bits",
  doc: "ld c, (set 3, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbda, {
  name: "SET 3,(IY+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb da $2s",
  group: "Bits",
  doc: "ld d, (set 3, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbdb, {
  name: "SET 3,(IY+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb db $2s",
  group: "Bits",
  doc: "ld e, (set 3, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbdc, {
  name: "SET 3,(IY+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb dc $2s",
  group: "Bits",
  doc: "ld h, (set 3, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbdd, {
  name: "SET 3,(IY+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb dd $2s",
  group: "Bits",
  doc: "ld l, (set 3, (iy+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcbde, {
  name: "SET 3,(IY+$D),(IY+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb de $2s $3s",
  group: "Bits",
  doc: "ld (iy+dd), (set 3, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbdf, {
  name: "SET 3,(IY+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb df $2s",
  group: "Bits",
  doc: "ld a, (set 3, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbe0, {
  name: "SET 4,(IY+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb e0 $2s",
  group: "Bits",
  doc: "ld b, (set 4, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbe1, {
  name: "SET 4,(IY+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb e1 $2s",
  group: "Bits",
  doc: "ld c, (set 4, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbe2, {
  name: "SET 4,(IY+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb e2 $2s",
  group: "Bits",
  doc: "ld d, (set 4, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbe3, {
  name: "SET 4,(IY+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb e3 $2s",
  group: "Bits",
  doc: "ld e, (set 4, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbe4, {
  name: "SET 4,(IY+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb e4 $2s",
  group: "Bits",
  doc: "ld h, (set 4, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbe5, {
  name: "SET 4,(IY+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb e5 $2s",
  group: "Bits",
  doc: "ld l, (set 4, (iy+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcbe6, {
  name: "SET 4,(IY+$D),(IY+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb e6 $2s $3s",
  group: "Bits",
  doc: "ld (iy+dd), (set 4, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbe7, {
  name: "SET 4,(IY+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb e7 $2s",
  group: "Bits",
  doc: "ld a, (set 4, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbe8, {
  name: "SET 5,(IY+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb e8 $2s",
  group: "Bits",
  doc: "ld b, (set 5, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbe9, {
  name: "SET 5,(IY+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb e9 $2s",
  group: "Bits",
  doc: "ld c, (set 5, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbea, {
  name: "SET 5,(IY+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb ea $2s",
  group: "Bits",
  doc: "ld d, (set 5, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbeb, {
  name: "SET 5,(IY+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb eb $2s",
  group: "Bits",
  doc: "ld e, (set 5, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbec, {
  name: "SET 5,(IY+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb ec $2s",
  group: "Bits",
  doc: "ld h, (set 5, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbed, {
  name: "SET 5,(IY+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb ed $2s",
  group: "Bits",
  doc: "ld l, (set 5, (iy+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcbee, {
  name: "SET 5,(IY+$D),(IY+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb ee $2s $3s",
  group: "Bits",
  doc: "ld (iy+dd), (set 5, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbef, {
  name: "SET 5,(IY+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb ef $2s",
  group: "Bits",
  doc: "ld a, (set 5, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbf0, {
  name: "SET 6,(IY+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb f0 $2s",
  group: "Bits",
  doc: "ld b, (set 6, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbf1, {
  name: "SET 6,(IY+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb f1 $2s",
  group: "Bits",
  doc: "ld c, (set 6, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbf2, {
  name: "SET 6,(IY+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb f2 $2s",
  group: "Bits",
  doc: "ld d, (set 6, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbf3, {
  name: "SET 6,(IY+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb f3 $2s",
  group: "Bits",
  doc: "ld e, (set 6, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbf4, {
  name: "SET 6,(IY+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb f4 $2s",
  group: "Bits",
  doc: "ld h, (set 6, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbf5, {
  name: "SET 6,(IY+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb f5 $2s",
  group: "Bits",
  doc: "ld l, (set 6, (iy+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcbf6, {
  name: "SET 6,(IY+$D),(IY+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb f6 $2s $3s",
  group: "Bits",
  doc: "ld (iy+dd), (set 6, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbf7, {
  name: "SET 6,(IY+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb f7 $2s",
  group: "Bits",
  doc: "ld a, (set 6, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbf8, {
  name: "SET 7,(IY+$D),B",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb f8 $2s",
  group: "Bits",
  doc: "ld b, (set 7, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbf9, {
  name: "SET 7,(IY+$D),C",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb f9 $2s",
  group: "Bits",
  doc: "ld c, (set 7, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbfa, {
  name: "SET 7,(IY+$D),D",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb fa $2s",
  group: "Bits",
  doc: "ld d, (set 7, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbfb, {
  name: "SET 7,(IY+$D),E",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb fb $2s",
  group: "Bits",
  doc: "ld e, (set 7, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbfc, {
  name: "SET 7,(IY+$D),H",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb fc $2s",
  group: "Bits",
  doc: "ld h, (set 7, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbfd, {
  name: "SET 7,(IY+$D),L",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb fd $2s",
  group: "Bits",
  doc: "ld l, (set 7, (iy+dd))",
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
// SET $NY, ($RI+$d), ($RI+$d)
opcodes.set(0xfdcbfe, {
  name: "SET 7,(IY+$D),(IY+$D)",
  template: "SET $NY, ($RI+$d), ($RI+$d)",
  bytes: "fd cb fe $2s $3s",
  group: "Bits",
  doc: "ld (iy+dd), (set 7, (iy+dd))",
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
// SET $NY, ($RI+$d), $RRZ
opcodes.set(0xfdcbff, {
  name: "SET 7,(IY+$D),A",
  template: "SET $NY, ($RI+$d), $RRZ",
  bytes: "fd cb ff $2s",
  group: "Bits",
  doc: "ld a, (set 7, (iy+dd))",
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
