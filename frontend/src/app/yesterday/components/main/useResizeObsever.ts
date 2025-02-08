import { useEffect, useState, useRef } from "react";

// 요소 크기를 감지하는 커스텀 훅
export function useResizeObserver() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(ref.current);

    // Cleanup
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}
