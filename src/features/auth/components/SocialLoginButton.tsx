import Image from "next/image";

const providers = {
  apple: {
    label: "Apple로 계속하기",
    className: "bg-[#111] text-white",
    iconLeft: "left-[22px]",
  },
  kakao: {
    label: "카카오로 계속하기",
    className: "bg-[#fee500] text-fg",
    iconLeft: "left-[22px]",
  },
  google: {
    label: "Google로 계속하기",
    className: "border-line text-fg border bg-white",
    iconLeft: "left-[21px]",
  },
};

// Figma Button/Social
export default function SocialLoginButton({
  provider,
}: {
  provider: keyof typeof providers;
}) {
  const { label, className, iconLeft } = providers[provider];
  return (
    <button
      type="button"
      className={`text-button relative flex h-[50px] w-full cursor-pointer items-center justify-center rounded-full ${className}`}
    >
      <Image
        src={`/icons/${provider}.svg`}
        alt=""
        width={18}
        height={18}
        className={`absolute ${iconLeft}`}
      />
      {label}
    </button>
  );
}
