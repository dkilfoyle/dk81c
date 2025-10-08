import { useCallback, useEffect, useRef, useState } from "react";

const ROWS = [
  [2, 2, 36],
  [34, 60, 95],
  [48, 117, 152],
  [20, 175, 210],
];

const KEYS: Record<string, [number, number]> = {
  "1": [0, 0],
  "2": [0, 1],
  "3": [0, 2],
  "4": [0, 3],
  "5": [0, 4],
  "6": [0, 5],
  "7": [0, 6],
  "8": [0, 7],
  "9": [0, 8],
  "0": [0, 9],
  Q: [1, 0],
  W: [1, 1],
  E: [1, 2],
  R: [1, 3],
  T: [1, 4],
  Y: [1, 5],
  U: [1, 6],
  I: [1, 7],
  O: [1, 8],
  P: [1, 9],
  A: [2, 0],
  S: [2, 1],
  D: [2, 2],
  F: [2, 3],
  G: [2, 4],
  H: [2, 5],
  J: [2, 6],
  K: [2, 7],
  L: [2, 8],
  ENTER: [2, 9],
  SHIFT: [3, 0],
  Z: [3, 1],
  X: [3, 2],
  C: [3, 3],
  V: [3, 4],
  B: [3, 5],
  N: [3, 6],
  M: [3, 7],
  ",": [3, 8],
  " ": [3, 9],
};

export function Keyboard({ zxworker }: { zxworker: Worker | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgURL, setImageURL] = useState("");
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState("");

  useEffect(() => {
    const i = new Image();
    i.src = "keyboard640.png";
    i.onload = () => {
      const ctx = canvasRef.current?.getContext("2d");
      ctx?.drawImage(i, 0, 0);
      if (canvasRef.current) setImageURL(canvasRef.current?.toDataURL());
    };
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      const i = new Image();
      i.src = imgURL;
      i.onload = () => {
        ctx.drawImage(i, 0, 0);
        ctx.fillStyle = "rgb(0,0,255,30%)";
        pressed.values().forEach((key) => {
          const [row, col] = KEYS[key];
          const X = ROWS[row][0] + col * 60;
          const Y = ROWS[row][1];
          ctx.fillRect(X, Y, 48, 35);
        });
        if (hovered) {
          ctx.fillStyle = "rgb(0,255,0,30%)";
          const [row, col] = KEYS[hovered];
          const X = ROWS[row][0] + col * 60;
          const Y = ROWS[row][1];
          ctx.fillRect(X, Y, 48, 35);
        }
      };
    }
  }, [hovered, imgURL, pressed]);

  const keyPress = useCallback(
    (dir: "keyup" | "keydown", key: string) => {
      const key2 = key.toUpperCase().replace("KEY", "").replace("DIGIT", "").replace("SHIFTLEFT", "SHIFT");
      if (dir == "keydown") setPressed((prev) => new Set(prev).add(key2));
      else
        setPressed((prev) => {
          const next = new Set(prev);
          next.delete(key2);
          return next;
        });

      if (zxworker)
        zxworker.postMessage({
          msg: dir,
          msgData: key2,
        });
    },
    [zxworker]
  );

  const getRowCol = (x: number, y: number) => {
    for (let row = 0; row < 4; row++) {
      if (y >= ROWS[row][1] && y <= ROWS[row][2]) {
        const xx = (x - ROWS[row][0]) / 60;
        const col = xx % 1 < 0.8 ? Math.floor(xx) : -1;
        return [row, col];
      }
    }
    return [-1, -1];
  };

  const onKeyboardMouseMove = useCallback((event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const [row, col] = getRowCol(x, y);
    const key = Object.entries(KEYS).find((x) => x[1][0] == row && x[1][1] == col);
    if (key) setHovered(key[0]);
    else setHovered("");
  }, []);

  const onClick = useCallback(() => {
    if (hovered == "SHIFT") {
      if (pressed.has("SHIFT")) {
        keyPress("keyup", "SHIFT");
      } else keyPress("keydown", "SHIFT");
      return;
    }
    if (hovered) {
      keyPress("keydown", hovered);
      setTimeout(() => {
        keyPress("keyup", hovered);
      }, 500);
    }
  }, [hovered, keyPress, pressed]);

  return (
    <canvas
      ref={canvasRef}
      tabIndex={0}
      width={640}
      height={223}
      onClick={onClick}
      onMouseMove={onKeyboardMouseMove}
      onKeyDown={(e) => keyPress("keydown", e.code)}
      onKeyUp={(e) => keyPress("keyup", e.code)}></canvas>
  );
}
