import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("미들웨어 실행됨:", req.nextUrl.pathname); // ✅ 실행 여부 확인 로그

  const token = req.cookies.get("sessionToken");
  console.log("sessionToken:", token); // ✅ 쿠키 확인

  const isProtectedRoute = ["/dashboard", "/profile", "/today"].includes(req.nextUrl.pathname);

  if (isProtectedRoute && !token) {
    console.log("로그인 필요! 리디렉트 수행"); // ✅ 리디렉트 실행 로그
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile", "/today"], // 보호할 페이지 설정
};
