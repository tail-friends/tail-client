import type { ComponentProps } from "react";

// Figma Admin/Button · Primary
export default function Button({
  className = "",
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      className={`bg-primary text-body cursor-pointer rounded-full px-[18px] py-2.5 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_6px_8px_rgb(46_107_87/0.25)] ${className}`}
      {...props}
    />
  );
}
