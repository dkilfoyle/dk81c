import { Model } from "../ls/generated/ast";
import { Basic } from "./compiler";
import { SysVars } from "./sysvars";

class DFile {
  bytes: number[];
  constructor() {
    this.bytes = [];
    this.cls();
  }
  cls() {
    this.bytes.push(0x76);
    for (let row = 0; row < 24; row++) {
      this.bytes.push(...Array(32).fill(0), 0x76);
    }
  }
}

export class PFile {
  dfile: DFile;
  basic: Basic;
  sysvars: SysVars;
  bytes: Uint8Array;
  sysvarsStart: number;
  basicStart: number;
  dfileStart: number = 0;
  basicvarsStart: number = 0;
  basicEnd: number = 0;
  constructor(model: Model) {
    this.dfile = new DFile();
    this.basic = new Basic();
    this.sysvars = new SysVars();
    this.sysvarsStart = 0x4009;
    this.basicStart = 0x407d;
    console.log("Compiling");
    try {
      this.basic.compileModel(model);
    } catch (e) {
      this.bytes = new Uint8Array();
      console.error(e);
      return;
    }
    this.dfileStart = this.basicStart + this.basic.bytes.length;
    this.basicvarsStart = this.dfileStart + this.dfile.bytes.length;
    this.basicEnd = this.basicvarsStart + 1;
    const nextLineAddr = this.dfileStart;
    this.sysvars.setPointers(this.dfileStart, this.basicvarsStart, this.basicEnd, nextLineAddr);
    this.bytes = new Uint8Array([...this.sysvars.bytes, ...this.basic.bytes, ...this.dfile.bytes, 0x80]);
  }
}
