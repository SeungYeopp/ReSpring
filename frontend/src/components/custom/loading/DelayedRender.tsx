"use client";

import { ReactNode, useEffect, useState } from "react";

interface DelayedRenderProps {
  delay: number;       // 지연 시간(ms)
  isLoading: boolean;  // 로딩 여부
  children: ReactNode; // 지연 렌더링할 요소
}

/**
 * DelayedRender
 * - isLoading === true 상태가 'delay' ms 이상 지속될 때만 children을 표시
 * - delay 전에 로딩이 끝나버리면 표시 안 됨
 */
export function DelayedRender({ delay, isLoading, children }: DelayedRenderProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isLoading) {
      // 로딩 시작 → 'delay'ms 뒤에 show = true
      timer = setTimeout(() => setShow(true), delay);
    } else {
      // 로딩이 끝났으면 즉시 hide
      setShow(false);
    }

    // 언마운트 시 / 로딩 끝날 시 타이머 정리
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, delay]);

  // show === true일 때만 children 렌더
  return show ? <>{children}</> : null;
}
