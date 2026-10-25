import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import AnalysisChart from "@/features/dashboard/components/AnalysisChart";
import SpeciesCountPanel from "@/features/dashboard/components/SpeciesCountPanel";
import StatCard from "@/features/dashboard/components/StatCard";
import StatsError from "@/features/dashboard/components/StatsError";
import { asOf, stats } from "@/features/dashboard/data";

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <Suspense>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}

// Figma W-2. ?error=failed면 W-2a(불러오기 실패)
async function Dashboard({
  searchParams,
}: Pick<PageProps<"/">, "searchParams">) {
  const failed = (await searchParams).error === "failed";

  return (
    <div className="flex min-h-screen gap-4 p-4">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <TopBar title="대시보드" />
        <main className="flex min-h-0 flex-1 flex-col gap-4 p-2">
          <div className="flex items-center gap-2">
            <h2 className="text-title-lg flex-1">오늘 현황</h2>
            <p className="text-caption text-fg-tertiary">{asOf}</p>
          </div>
          <div className="flex gap-4">
            {stats.map(({ label, value, note }) => (
              <StatCard
                key={label}
                label={label}
                value={failed ? "—" : value}
                note={failed ? undefined : note}
              />
            ))}
          </div>
          {failed ? (
            <StatsError />
          ) : (
            <div className="flex min-h-0 flex-1 gap-4">
              <AnalysisChart />
              <SpeciesCountPanel />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
