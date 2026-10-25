import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import GuidesView from "@/features/guides/components/GuidesView";

// Figma W-4 사육 가이드 편집
export default function GuidesPage() {
  return (
    <div className="flex h-screen gap-4 p-4">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <TopBar title="사육 가이드" />
        <GuidesView />
      </div>
    </div>
  );
}
