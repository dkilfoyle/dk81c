import { SYSVARS } from "@/zx81/sysvars";

export class SysVars {
  readonly SYSVARSTART = 16393;
  addressMap: Map<number, string>;
  bytes!: Uint8Array;

  constructor() {
    this.addressMap = new Map();
    for (const [name, { address }] of Object.entries(SYSVARS)) this.addressMap.set(address, name);
    this.createDefaultValues();
  }

  createDefaultValues() {
    this.bytes = new Uint8Array(116);
    Object.entries(SYSVARS).forEach(([varname, info]) => {
      if (varname == "PRBUFF") {
        this.setValue(varname, [...Array(32).fill(0), 0x76]);
      } else if (varname == "MEMBOT") {
        this.setValue(varname, Array(30).fill(0));
      } else this.setValue(varname, info.def);
    });
  }

  setPointers(dfilePtr: number, basicVars: number, basicEnd: number, nextLineAddr: number) {
    this.setValue("D_FILE", dfilePtr);
    this.setValue("DF_CC", dfilePtr + 1);
    this.setValue("VARS", basicVars);
    this.setValue("E_LINE", basicEnd);
    this.setValue("CH_ADD", basicEnd + 4);
    this.setValue("STKBOT", basicEnd + 5);
    this.setValue("STKEND", basicEnd + 5);
    this.setValue("NXTLIN", nextLineAddr);
  }

  setValue(name: string, value: number | number[]) {
    const { size, address } = SYSVARS[name];
    let index = address - 16393;
    if (typeof value == "number") {
      const hi = value >> 8;
      if (size == 1) {
        if (hi !== 0) throw Error(`Expected 8 bit value but got ${value}`);
        this.bytes[index] = value & 0xff;
      } else if (size == 2) {
        this.bytes[index] = value & 0xff;
        this.bytes[index + 1] = hi;
      } else {
        throw Error(`size mismatch: recevied single value but ${name} expects size ${size}`);
      }
      value = [value & 0xff];
    } else {
      // value is array eg DFILE, PRINTBUF or MEMBOT
      for (let i = 0; i < size; i++) this.bytes[index++] = value[i];
    }
  }
}
