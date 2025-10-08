import { useCallback, useEffect, useRef } from "react";

export const useAnimationFrame = (frameCallback: (deltaTime: number, time?: number) => void, shouldAnimate = true) => {
  const requestRef = useRef<number>(null);
  const previousTimeRef = useRef<number>(0);

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        frameCallback(deltaTime, time); // Pass delta time and current time to the callback
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [frameCallback]
  );

  useEffect(() => {
    if (shouldAnimate) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current!);
      requestRef.current = null; // Clear the ref when stopped
      previousTimeRef.current = 0; // Reset previous time
    }

    return () => {
      cancelAnimationFrame(requestRef.current!);
      requestRef.current = null;
      previousTimeRef.current = 0;
    };
  }, [shouldAnimate, animate]); // Re-run effect if shouldAnimate or callback changes
};
