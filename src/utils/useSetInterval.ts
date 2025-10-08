import { useEffect, useRef } from "react";

type Callback = () => void;

function useInterval(callback: Callback, delay: number | null, running: boolean) {
  const savedCallback = useRef<Callback>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null && running) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, running]);
}

export default useInterval;
