// "꼬리친구 관리자" 로고. lg는 로그인 카드, sm은 사이드바
export default function Brand({ size }: { size: "lg" | "sm" }) {
  const lg = size === "lg";
  return (
    <div className={`flex items-center gap-2 ${lg ? "" : "px-2"}`}>
      {/* 브라우저는 마지막 글자 뒤에도 자간을 붙여서, Figma처럼 그만큼 당긴다 */}
      <span
        className={`text-primary ${lg ? "text-display-lg" : "text-wordmark -mr-[6.4px]"}`}
      >
        꼬리친구
      </span>
      <span
        className={`bg-primary-soft text-primary rounded-full px-2 py-[3px] ${lg ? "text-label" : "text-caption"}`}
      >
        관리자
      </span>
    </div>
  );
}
