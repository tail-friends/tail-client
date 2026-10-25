import type { ComponentProps } from "react";

// Figma Admin/Button · Primary. 링크에도 같은 모양을 쓰려고 클래스를 따로 둔다
export const buttonClass =
  "bg-primary text-body cursor-pointer rounded-full px-4.5 py-2.5 text-center text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_0.375rem_0.5rem_rgb(46_107_87/0.25)]";

export default function Button({
  className = "",
  ...props
}: ComponentProps<"button">) {
  return <button className={`${buttonClass} ${className}`} {...props} />;
}
