import Image from "next/image";

// Figma Admin/Toast · Error, Success. 로그인은 화면 아래 가운데.
// top은 가까운 relative 부모의 위 가운데(상단 바 위)에 겹쳐서, 부모를 relative로 둬야 한다
export default function Toast({
  tone = "error",
  position = "bottom",
  children,
}: {
  tone?: "error" | "success";
  position?: "top" | "bottom";
  children: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className={`bg-fg text-body left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-full py-3 pr-5 pl-4 text-white shadow-[0_0.625rem_0.75rem_rgb(43_41_38/0.2)] backdrop-blur-[0.75rem] ${position === "top" ? "absolute top-[0.65625rem]" : "fixed bottom-10"}`}
    >
      <Image
        src={
          tone === "success"
            ? "/icons/toast-dot-success.svg"
            : "/icons/toast-dot.svg"
        }
        alt=""
        width={8}
        height={8}
        className="size-2"
      />
      {children}
    </div>
  );
}
