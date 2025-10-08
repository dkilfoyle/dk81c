import { zx81 } from "./zx81";
// import hello from "../asm/hello.p?uint8array";
// import monstermaze from "../pfiles/monstermaze.p?uint8array";

let duration = 0;
let betweenTime = 0;
let lastTime = 0;
let calls = 0;

interface Task {
  id: number;
}

const queue: Task[] = [];
let running = false;

self.onmessage = (event: MessageEvent) => {
  const data = event.data;

  switch (data.msg) {
    case "keydown":
      zx81.keydown(data.msgData);
      break;
    case "keyup":
      zx81.keyup(data.msgData);
      break;
    case "pause":
      self.postMessage({ msg: "memoryDump", msgData: zx81.memory.slice(0, 0x8000) });
      break;
    case "run":
      queue.push(event.data);
      if (!running) runNext();
      break;
    case "load_pfile":
      zx81.loadp(data.msgData);
      // console.log("Loaded p file, PC=", zx81.z80.regs.pc, zx81.z80.regs.pc.toString(16));
      break;
  }
};

const runNext = () => {
  if (queue.length == 0) {
    running = false;
    return;
  }
  running = true;
  const task = queue.shift();
  if (queue.length > 0) console.error("Warning: run queue");
  if (task) {
    runSome();
    running = false;
  }
};

const runSome = () => {
  const startTime = Date.now();
  if (lastTime != 0) betweenTime += startTime - lastTime;
  lastTime = startTime;

  zx81.frame();

  duration += Date.now() - startTime;

  calls++;
  if (calls % 500) {
    const avRunTime = Math.round(duration / calls);
    const avBetweenTime = betweenTime / calls;
    if (queue.length > 0) console.log("Queue sze", queue.length);
    self.postMessage({ msg: "stats", msgData: { avRunTime, avFPS: Math.round(1000 / avBetweenTime) } });
  }
};

export {};
