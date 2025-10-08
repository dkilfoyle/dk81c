import { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Box, Button, Flex, Heading, HStack, Tabs, VStack } from "@chakra-ui/react";
import { useAnimationFrame } from "./utils/useAnimationFrame";

import { Keyboard } from "./components/zxkeyboard";
import useSetInterval from "./utils/useSetInterval";
import { Ram } from "./components/ram";
import { SysVars } from "./components/sysvars";
// import { BasicEditing } from "./components/monaco/basicediting";
import { AsmEditing } from "./components/monaco/asmediting";
// import { AsmEditing } from "./components/asmediting";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zxWorkerRef = useRef<Worker | null>(null);

  const [running, setRunning] = useState(true);
  const [avRunTime, setAvRunTime] = useState(0);
  const [avFPS, setAvFPS] = useState(0);
  const [cycleMax, setCycleMax] = useState(0);
  const [queueSize, setQueueSize] = useState(0);
  const [screenImageData, setScreenImageData] = useState<ImageData>();
  const [memoryDump, setMemoryDump] = useState<Uint8Array>(new Uint8Array());

  const updateScreen = useCallback(() => {
    if (canvasRef.current && screenImageData) {
      const context = canvasRef.current.getContext("2d");
      // context?.putImageData(image, 0, 0);
      createImageBitmap(screenImageData).then((renderer) => context?.drawImage(renderer, 0, 0, 512, 384));
    }
  }, [screenImageData]);

  useEffect(() => {
    zxWorkerRef.current = new Worker(new URL("./zx81/worker.ts", import.meta.url), { type: "module" });
    zxWorkerRef.current.onmessage = (event: MessageEvent) => {
      switch (event.data.msg) {
        case "screen":
          setScreenImageData(event.data.msgData);
          break;
        case "stats":
          setAvRunTime(event.data.msgData.avRunTime);
          setAvFPS(event.data.msgData.avFPS);
          setQueueSize(event.data.msgData.queueSize);
          setCycleMax(event.data.msgData.cycleMax);
          break;
        case "memoryDump":
          setMemoryDump(event.data.msgData);
          break;
      }
    };
    return () => zxWorkerRef.current?.terminate();
  }, []);

  const run = useCallback(() => {
    if (running) {
      zxWorkerRef.current?.postMessage({ msg: "pause" });
    }
    setRunning((prev) => !prev);
    canvasRef.current?.focus();
  }, [running]);

  useAnimationFrame(() => updateScreen(), running);
  useSetInterval(() => zxWorkerRef.current?.postMessage({ msg: "run" }), 20, running);

  return (
    <Flex justify={"center"}>
      <HStack gap={6}>
        <VStack gap="6">
          <Heading>DK's ZX81</Heading>
          <HStack gap="10">
            <Button onClick={run}>{running ? "Pause" : "Run"}</Button>
            {/* <Button onClick={clickLoad}>Load</Button> */}
            <Badge>RT {avRunTime}</Badge>
            <Badge>FPS {avFPS}</Badge>
            <Badge>CycleMax {cycleMax}</Badge>
            <Badge>QueueSize {queueSize}</Badge>
          </HStack>
          <Box>
            <canvas
              id="screenCanvas"
              tabIndex={5}
              ref={canvasRef}
              height={384}
              width={512}
              style={{ border: "2px solid #494949ff", imageRendering: "auto" }}></canvas>
          </Box>
          <Keyboard zxworker={zxWorkerRef.current}></Keyboard>
        </VStack>

        <Box height={700} width={600}>
          <Tabs.Root defaultValue={"asm"}>
            <Tabs.List>
              <Tabs.Trigger value="asm">ASM</Tabs.Trigger>
              <Tabs.Trigger value="basic">Basic</Tabs.Trigger>
              <Tabs.Trigger value="memory">Memory</Tabs.Trigger>
              <Tabs.Trigger value="sysvars">SysVars</Tabs.Trigger>
              <Tabs.Trigger value="basicvars">BasicVars</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="asm" height={700}>
              <AsmEditing zxworker={zxWorkerRef}></AsmEditing>
            </Tabs.Content>
            <Tabs.Content value="basic" height={700}>
              {/*<BasicEditing zxworker={zxWorkerRef}></BasicEditing>*/}
            </Tabs.Content>
            <Tabs.Content value="memory" height={700}>
              <Ram bytes={memoryDump}></Ram>
            </Tabs.Content>
            <Tabs.Content value="sysvars" height={700}>
              <SysVars bytes={memoryDump}></SysVars>
            </Tabs.Content>
          </Tabs.Root>
        </Box>
      </HStack>
    </Flex>
  );
}

export default App;
