// layout.tsx
"use client";

import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>
      </header>
      <main>{children}</main>
      <footer>
      </footer>
    </div>
  );
}
