"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { loginHref } from "@/lib/api";
import { finishLogin } from "../api";

// 만료로 로그인 화면에 왔으면 보던 화면으로 돌아간다. 이 사이트 안의 경로만 쓴다
function takeReturnTo() {
  const path = sessionStorage.getItem("returnTo");
  sessionStorage.removeItem("returnTo");
  return path?.startsWith("/") &&
    !path.startsWith("//") &&
    !path.startsWith("/login")
    ? path
    : "/";
}

// 소셜 서비스가 /login?code=...&state=... 로 돌려보내면 로그인을 마친다
export default function OAuthCallback({
  code,
  state,
}: {
  code?: string;
  state: string;
}) {
  const router = useRouter();
  // 개발 모드 StrictMode가 effect를 두 번 돌려도 인가 코드는 한 번만 쓴다
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    finishLogin(code, state)
      .then((admin) =>
        router.replace(admin ? takeReturnTo() : loginHref("forbidden")),
      )
      .catch(() => router.replace(loginHref("failed")));
  }, [code, state, router]);

  return null;
}
