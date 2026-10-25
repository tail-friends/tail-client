"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Brand from "./Brand";

const menus = [
  { href: "/", label: "대시보드", icon: "home" },
  { href: "/species", label: "종 관리", icon: "egg" },
  { href: "/guides", label: "사육 가이드", icon: "record" },
];

// Figma Admin/Sidebar. activeHref를 주면 주소 대신 그 메뉴를 강조한다 (404 화면용)
export default function Sidebar({ activeHref }: { activeHref?: string }) {
  const pathname = usePathname();

  return (
    <nav className="glass flex w-58 shrink-0 flex-col gap-1.5 rounded-xl px-3.75 py-5.75">
      <Brand size="sm" />
      <p className="text-caption text-fg-tertiary mt-6">메뉴</p>
      {menus.map(({ href, label, icon }) => {
        const active = (activeHref ?? pathname) === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`text-body flex items-center gap-2.5 rounded-md px-3 py-2.75 ${active ? "bg-primary text-white" : "text-fg-secondary"}`}
          >
            {/* 아이콘을 글자색으로 칠하려고 SVG를 마스크로 쓴다 */}
            <span
              aria-hidden
              className={`size-4.5 ${active ? "bg-white" : "bg-fg"}`}
              style={{
                mask: `url(/icons/${icon}.svg) center / contain no-repeat`,
              }}
            />
            {label}
          </Link>
        );
      })}
      <p className="text-caption text-fg-tertiary mt-auto">
        1차 출시 · 관리자 웹 v1.0
      </p>
    </nav>
  );
}
