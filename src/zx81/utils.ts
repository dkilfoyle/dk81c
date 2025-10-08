import { zx81 } from "./zx81";

export const _d = (x: number, l = 4) => x.toString().padStart(l, " ");
export const _h = (x: number, l = 2) => x.toString(16).padStart(l, "0");
export const _b = (x: number, l = 8) => x.toString(2).padStart(l, "0");

let traceCount = 0;
let traceRuns = 1;
const traceMod = 1;
const dump: number[][] = [];

export const startTracing = (x: number, msg?: string) => {
  if (traceRuns > 0) {
    traceCount = x;
    if (msg) console.log(msg);
  } else traceCount = 0;
  traceRuns--;
};

export const debugMsg = (msg: string, afterMsg = "") => {
  if (traceCount > 0) {
    if (traceCount % traceMod == 0) {
      console.log(
        `${msg.slice(0, 16).padEnd(16, " ")} | ${_d(traceCount, 5)} | PC: ${_d(zx81.pcAtFetch, 5)} / 0x${_h(zx81.pcAtFetch, 4)} |` +
          `A=${_h(zx81.z80.regs.a)} BC=${_h(zx81.z80.regs.bc, 4)} HL=${_h(zx81.z80.regs.hl, 4)} | bc=${_d(zx81.z80.regs.b, 3)}/${_d(zx81.z80.regs.c, 3)} | ` +
          `R=${_d(zx81.z80.regs.r, 3)} / ${_h(zx81.z80.regs.r)} / ${_b(zx81.z80.regs.r)} | ` +
          `tstates=${_d(zx81.tStateCount, 5)} | hcounter=${_d(zx81.ula.hsync_counter)} | ` +
          `${zx81.ula.hsync_state || " "} | ${zx81.ula.vsync_state || " "} | ` +
          `raster=${_d(zx81.ula.rasterX, 3)}, ${_d(zx81.ula.rasterY, 3)} | ` +
          `mem = ${Array.from(zx81.memory.slice(zx81.pcAtFetch, zx81.pcAtFetch + 3)).map((x) => _h(x))}` +
          afterMsg
      );
      dump.push([zx81.z80.regs.pc, zx81.tStateCount, zx81.ula.hsync_counter]);
    }
    if (traceCount == 1) {
      // copy dump
      const dumptxt = dump.map((row) => row.join("\t")).join("\n");
      console.log(dumptxt);
    }
    traceCount--;
  }
};

// function fallbackCopyTextToClipboard(text) {
//   const textArea = document.createElement("textarea");
//   textArea.value = text;

//   // Avoid scrolling to bottom
//   textArea.style.top = "0";
//   textArea.style.left = "0";
//   textArea.style.position = "fixed";

//   document.body.appendChild(textArea);
//   textArea.focus();
//   textArea.select();

//   try {
//     const successful = document.execCommand("copy");
//     const msg = successful ? "successful" : "unsuccessful";
//     console.log("Fallback: Copying text command was " + msg);
//   } catch (err) {
//     console.error("Fallback: Oops, unable to copy", err);
//   }

//   document.body.removeChild(textArea);
// }
