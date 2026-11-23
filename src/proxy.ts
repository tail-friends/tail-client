import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

// 로그인 표시 쿠키(lib/session.ts)가 없으면 페이지를 그리기 전에 로그인으로 보낸다.
// 유효한지는 보지 않는다(만료는 첫 API 401에서 처리)
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", request.url));
}

// /login, _next, 점이 든 정적 파일(favicon.ico, robots.txt, public/ 이미지)은 제외한다
export const config = {
  matcher: ["/((?!login$|_next/|.*\\.).*)"],
};
