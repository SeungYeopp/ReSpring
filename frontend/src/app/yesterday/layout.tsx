// layout.tsx
"use client";

import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>
        <h1>My Test Layout</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>Footer Content</p>
      </footer>
    </div>
  );
}
