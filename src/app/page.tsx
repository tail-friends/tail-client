import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Dashboard from "@/features/dashboard/components/Dashboard";

// Figma W-2
export default function Home() {
  return (
    <div className="flex min-h-screen gap-4 p-4">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <TopBar title="대시보드" />
        <Dashboard />
      </div>
    </div>
  );
}
