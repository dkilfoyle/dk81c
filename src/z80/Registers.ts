import { Flag } from "./Alu";
import utils from "./utils";

export type ByteReg = "a" | "b" | "c" | "d" | "e" | "h" | "l" | "ixh" | "ixl" | "iyh" | "iyl" | "i" | "r";
export type WordReg = "af" | "bc" | "de" | "hl" | "sp" | "pc" | "ix" | "iy" | "afPrime" | "bcPrime" | "dePrime" | "hlPrime";
export type InteralReg = "wz" | "i" | "r" | "iff1" | "iff2" | "im" | "halted";
export type Register = ByteReg | WordReg | InteralReg;

export class RegisterSet {
  // all 16 bit registers
  public af: number = 0;
  public bc: number = 0;
  public de: number = 0;
  public hl: number = 0;
  public afPrime: number = 0;
  public bcPrime: number = 0;
  public dePrime: number = 0;
  public hlPrime: number = 0;
  public ix: number = 0;
  public iy: number = 0;
  public sp: number = 0;
  public pc: number = 0;

  // Internal state:
  public wz: number = 0;
  public i: number = 0;
  public r: number = 0; // Low 7 bits of R.
  public r7: number = 0; // Bit 7 of R.
  public iff1: number = 0;
  public iff2: number = 0;
  public im: number = 0;
  public halted: number = 0;

  str(name: string, prefix = "") {
    switch (name.toLowerCase()) {
      case "af":
      case "bc":
      case "de":
      case "hl":
      case "afprime":
      case "bcprime":
      case "deprime":
      case "hlprime":
      case "pc":
      case "sp":
      case "wz":
      case "i":
      case "r":
      case "ix":
      case "iy":
        return prefix + this[name as Register].toString(16).padStart(4, "0");
      case "iff1":
      case "iff2":
      case "im":
      case "halted":
      case "tstatecount":
        return this[name as Register];
      default:
        return "unknown reg";
    }
  }

  get condZ(): number {
    return this.f & Flag.Z ? 1 : 0;
  }

  get condNZ(): number {
    return (this.f & Flag.Z) == 0 ? 1 : 0;
  }

  get condC(): number {
    return this.f & Flag.C ? 1 : 0;
  }

  get condNC(): number {
    return (this.f & Flag.C) == 0 ? 1 : 0;
  }

  /** S flag is set */
  get condM(): number {
    return this.f & Flag.S ? 1 : 0;
  }

  /** S flag is reset */
  get condP(): number {
    return (this.f & Flag.S) == 0 ? 1 : 0;
  }

  get condPO(): number {
    return (this.f & Flag.P) == 0 ? 1 : 0;
  }

  get condPE(): number {
    return this.f & Flag.P ? 1 : 0;
  }

  get a(): number {
    return utils.hi(this.af);
  }

  set a(value: number) {
    this.af = utils.word(value, this.f);
  }

  get f(): number {
    return utils.lo(this.af);
  }

  set f(value: number) {
    this.af = utils.word(this.a, value);
  }

  get b(): number {
    return utils.hi(this.bc);
  }

  set b(value: number) {
    this.bc = utils.word(value, this.c);
  }

  get c(): number {
    return utils.lo(this.bc);
  }

  set c(value: number) {
    this.bc = utils.word(this.b, value);
  }

  get d(): number {
    return utils.hi(this.de);
  }

  set d(value: number) {
    this.de = utils.word(value, this.e);
  }

  get e(): number {
    return utils.lo(this.de);
  }

  set e(value: number) {
    this.de = utils.word(this.d, value);
  }

  get h(): number {
    return utils.hi(this.hl);
  }

  set h(value: number) {
    this.hl = utils.word(value, this.l);
  }

  get l(): number {
    return utils.lo(this.hl);
  }

  set l(value: number) {
    this.hl = utils.word(this.h, value);
  }

  get w(): number {
    return utils.hi(this.wz);
  }

  set w(value: number) {
    this.wz = utils.word(value, this.z);
  }

  get z(): number {
    return utils.lo(this.wz);
  }

  set z(value: number) {
    this.wz = utils.word(this.w, value);
  }

  get ixh(): number {
    return utils.hi(this.ix);
  }

  set ixh(value: number) {
    this.ix = utils.word(value, this.ixl);
  }

  get ixl(): number {
    return utils.lo(this.ix);
  }

  set ixl(value: number) {
    this.ix = utils.word(this.ixh, value);
  }

  get sph(): number {
    return utils.hi(this.sp);
  }

  set sph(value: number) {
    this.sp = utils.word(value, this.spl);
  }

  get spl(): number {
    return utils.lo(this.sp);
  }

  set spl(value: number) {
    this.sp = utils.word(this.sph, value);
  }

  get pch(): number {
    return utils.hi(this.pc);
  }

  set pch(value: number) {
    this.pc = utils.word(value, this.pcl);
  }

  get pcl(): number {
    return utils.lo(this.pc);
  }

  set pcl(value: number) {
    this.ix = utils.word(this.pch, value);
  }

  get iyh(): number {
    return utils.hi(this.iy);
  }

  set iyh(value: number) {
    this.iy = utils.word(value, this.iyl);
  }

  get iyl(): number {
    return utils.lo(this.iy);
  }

  set iyl(value: number) {
    this.iy = utils.word(this.iyh, value);
  }

  /**
   * Combine the two R parts together.
   */
  get rCombined(): number {
    return (this.r7 & 0x80) | (this.r & 0x7f);
  }

  public setValue(registerName: Register, value: number) {
    this[registerName] = value;
  }

  /**
   * Get a register by name.
   */
  public getValue(registerName: Register): number {
    return this[registerName];
  }
  public getClone(): RegisterSet {
    const regs = new RegisterSet();

    regs.bc = this.bc;
    regs.de = this.de;
    regs.hl = this.hl;
    regs.af = this.af;
    regs.afPrime = this.afPrime;
    regs.bcPrime = this.bcPrime;
    regs.dePrime = this.dePrime;
    regs.hlPrime = this.hlPrime;
    regs.ix = this.ix;
    regs.iy = this.iy;
    regs.sp = this.sp;
    regs.pc = this.pc;
    regs.wz = this.wz;

    regs.i = this.i;
    regs.r = this.r;
    regs.r7 = this.r7;
    regs.iff1 = this.iff1;
    regs.iff2 = this.iff2;
    regs.im = this.im;
    regs.halted = this.halted;

    return regs;
  }
  public clone(another: RegisterSet) {
    this.bc = another.bc;
    this.de = another.de;
    this.hl = another.hl;
    this.af = another.af;
    this.afPrime = another.afPrime;
    this.bcPrime = another.bcPrime;
    this.dePrime = another.dePrime;
    this.hlPrime = another.hlPrime;
    this.ix = another.ix;
    this.iy = another.iy;
    this.sp = another.sp;
    this.pc = another.pc;
    this.wz = another.wz;

    this.i = another.i;
    this.r = another.r;
    this.r7 = another.r7;
    this.iff1 = another.iff1;
    this.iff2 = another.iff2;
    this.im = another.im;
    this.halted = another.halted;
  }
}
