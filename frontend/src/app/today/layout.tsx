// layout.tsx
"use client";

import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>
        {/* <h1>오늘헤더</h1> */}
      </header>
      <main>{children}</main>
      <footer>
        {/* <p>오늘푸터</p> */}
      </footer>
    </div>
  );
}
