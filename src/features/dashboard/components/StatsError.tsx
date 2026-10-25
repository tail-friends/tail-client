import Link from "next/link";
import { buttonClass } from "@/components/Button";

// Figma W-2a error. 다시 시도는 오류 없는 주소로 돌아가 통계를 다시 불러온다
export default function StatsError() {
  return (
    <div className="glass flex flex-1 flex-col items-center justify-center gap-3 rounded-xl [--glass-from:0.78] [--glass-to:0.4] px-8 py-12">
      <span className="bg-danger-soft text-display-md text-danger flex size-12 items-center justify-center rounded-full">
        !
      </span>
      <h2 className="text-title-lg">통계를 불러오지 못했어요</h2>
      <p className="text-body text-fg-secondary">
        네트워크 상태를 확인하고 다시 시도해 주세요.
      </p>
      <Link href="/" className={buttonClass}>
        다시 시도
      </Link>
    </div>
  );
}
