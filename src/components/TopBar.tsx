"use client";

import { useEffect } from "react";
import { logout } from "@/features/auth/api";
import { useMe } from "@/features/auth/queries";
import { loginHref, type LoginError } from "@/lib/api";

// 페이지를 새로 불러와 내 정보 캐시까지 비운다
const leave = (error?: LoginError) =>
  logout().then(() => location.assign(loginHref(error)));

// Figma Admin/TopBar. 내 정보를 불러오면서 로그인이 안 됐거나 만료됐으면 api.ts가 로그인 화면으로 보낸다
export default function TopBar({ title }: { title: string }) {
  const { data: me } = useMe();

  // 로그인한 뒤에 ADMIN 권한이 빠진 경우
  useEffect(() => {
    if (me && me.role !== "ADMIN") leave("forbidden");
  }, [me]);

  return (
    <header className="glass flex h-16 shrink-0 items-center gap-3 rounded-full [--glass-angle:177deg] [--glass-from:0.188] [--glass-to:0.128] pr-3 pl-6">
      <h1 className="text-display-md flex-1">{title}</h1>
      <div className="text-body flex items-center gap-2">
        <span className="bg-primary-soft text-primary flex size-8 items-center justify-center rounded-full">
          {me?.nickname[0]}
        </span>
        {me && `${me.nickname} · ${me.role}`}
      </div>
      <button
        type="button"
        onClick={() => leave()}
        className="text-label border border-white shadow-[inset_0_1px_0_rgb(255_255_255/0.9)] backdrop-blur-[1.125rem] text-fg-secondary cursor-pointer rounded-full bg-linear-to-br from-white/94 to-white/64 px-4 py-2.25"
      >
        로그아웃
      </button>
    </header>
  );
}
