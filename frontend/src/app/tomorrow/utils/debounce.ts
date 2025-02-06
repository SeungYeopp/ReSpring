import { useRef } from "react";

export function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise((resolve) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => resolve(func(...args)), waitFor);
    });
  };
}
