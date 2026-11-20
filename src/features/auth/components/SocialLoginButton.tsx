"use client";

import Image from "next/image";
import { canLogin, startLogin } from "../api";

const providers = {
  apple: {
    label: "Apple로 계속하기",
    className: "bg-[#111] text-white",
    iconLeft: "left-5.5",
  },
  kakao: {
    label: "카카오로 계속하기",
    className: "bg-[#fee500] text-fg",
    iconLeft: "left-5.5",
  },
  google: {
    label: "Google로 계속하기",
    className: "border-line text-fg border bg-white",
    iconLeft: "left-5.25",
  },
};

// Figma Button/Social. 웹에서 연결하지 않은 방식(애플)은 비활성으로 보인다
export default function SocialLoginButton({
  provider,
}: {
  provider: keyof typeof providers;
}) {
  const { label, className, iconLeft } = providers[provider];
  return (
    <button
      type="button"
      disabled={!canLogin(provider)}
      onClick={() => canLogin(provider) && startLogin(provider)}
      className={`text-button relative flex h-12.5 w-full cursor-pointer items-center disabled:cursor-not-allowed disabled:opacity-40 justify-center rounded-full ${className}`}
    >
      <Image
        src={`/icons/${provider}.svg`}
        alt=""
        width={18}
        height={18}
        className={`absolute size-4.5 ${iconLeft}`}
      />
      {label}
    </button>
  );
}
