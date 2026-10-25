import type { ComponentProps } from "react";

// Figma Admin/Button · Primary. 링크에도 같은 모양을 쓰려고 클래스를 따로 둔다
export const buttonClass =
  "bg-primary text-body cursor-pointer rounded-full px-4.5 py-2.5 text-center text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_0.375rem_0.5rem_rgb(46_107_87/0.25)]";

// Figma Admin/Button · Ghost, Danger
const variantClass = {
  primary: buttonClass,
  ghost:
    "text-body text-fg cursor-pointer rounded-full border border-line bg-linear-to-br from-white/[0.188] to-white/[0.128] px-4.5 py-2.5 text-center shadow-[inset_0_1px_0_rgb(255_255_255/0.9)] backdrop-blur-[1.125rem]",
  danger:
    "bg-danger text-body cursor-pointer rounded-full px-4.5 py-2.5 text-center text-white",
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: keyof typeof variantClass }) {
  return (
    <button
      className={`${variantClass[variant]} disabled:cursor-default disabled:opacity-45 ${className}`}
      {...props}
    />
  );
}
