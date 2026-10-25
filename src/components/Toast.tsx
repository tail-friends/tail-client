import Image from "next/image";

// Figma Admin/Toast. 기본은 화면 아래 가운데, position으로 자리를 바꾼다 (가운데가 left 기준)
export default function Toast({
  position = "bottom-10 left-1/2",
  children,
}: {
  position?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className={`bg-fg text-body fixed flex whitespace-nowrap -translate-x-1/2 items-center gap-2.5 rounded-full py-3 pr-5 pl-4 text-white shadow-[0_0.625rem_0.75rem_rgb(43_41_38/0.2)] backdrop-blur-[0.75rem] ${position}`}
    >
      <Image
        src="/icons/toast-dot.svg"
        alt=""
        width={8}
        height={8}
        className="size-2"
      />
      {children}
    </div>
  );
}
