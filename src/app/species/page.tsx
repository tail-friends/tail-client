import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import SpeciesManager from "@/features/species/components/SpeciesManager";

export default function SpeciesPage() {
  return (
    <div className="flex h-screen gap-4 p-4">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <TopBar title="종 관리" />
        <SpeciesManager />
      </div>
    </div>
  );
}
