import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "다시, 봄(Re:Spring)",
  description: "퇴직자들의 자존감 지킴이를 자처하는 커뮤니티 및 자서전 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <TopNav />
        <Sidebar />
        <main className="md:ml-64 pt-14 pb-16 md:py-4">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
