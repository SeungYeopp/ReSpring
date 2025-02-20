import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LayoutWrapper from "./LayoutWrapper";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "다시, 봄(Re:Spring)",
  description: "퇴직자들의 자존감 지킴이를 자처하는 커뮤니티 및 자서전 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4CAF50" />
      </head>
      <body className={inter.className}>
        {/* 네비게이션/사이드바 관리를 별도 컴포넌트에서 처리 */}
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
