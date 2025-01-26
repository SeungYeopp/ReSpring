import React from "react";
import "../styles/globals.css"; 

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div>
          <header>
            <h1>헤더</h1>
          </header>
          <main>{children}</main>
          <footer>
            <p>푸터</p>
          </footer>
        </div>
      </body>
    </html>
  );
}