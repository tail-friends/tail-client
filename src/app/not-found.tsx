import Link from "next/link";
import { buttonClass } from "@/components/Button";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

// Figma W-E2
export default function NotFound() {
  return (
    <div className="flex h-screen gap-4 p-4">
      <Sidebar />
      <div className="flex flex-1 flex-col gap-4">
        <TopBar title="오류" />
        <main className="flex flex-1 p-2">
          <div className="glass flex flex-1 flex-col items-center justify-center gap-3 rounded-xl bg-linear-146 from-white/78 to-white/40 px-8 py-12">
            <span className="bg-sunken text-display-md text-fg-secondary flex size-12 items-center justify-center rounded-full">
              ?
            </span>
            <h2 className="text-title-lg">페이지를 찾을 수 없어요</h2>
            <p className="text-body text-fg-secondary">
              주소가 바뀌었거나 삭제된 페이지예요.
            </p>
            <Link href="/" className={buttonClass}>
              대시보드로 가기
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
