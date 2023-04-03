// src/hooks/useResizeObserver.ts

import { useEffect, useState, useRef } from "react";

type Size = {
  width: number;
  height: number;
};

const useResizeObserver = (ref: React.RefObject<HTMLElement>): Size => {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return size;
};

export default useResizeObserver;
