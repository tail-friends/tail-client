"use client";

import { useStats } from "../api";
import AnalysisChart from "./AnalysisChart";
import SpeciesCountPanel from "./SpeciesCountPanel";
import StatCard from "./StatCard";
import StatsError from "./StatsError";

// Figma W-2 본문. 불러오는 중이거나 실패하면 카드 값은 "—"
export default function Dashboard() {
  const { data, isError } = useStats();
  const today = data?.daily.at(-1);
  const average =
    data &&
    Math.round(
      data.daily.reduce((sum, d) => sum + d.aiAnalyses, 0) / data.daily.length,
    );

  const cards = [
    {
      label: "가입자 수",
      value: data?.totalUsers.toLocaleString(),
      note: today && `어제보다 +${today.newUsers.toLocaleString()}`,
    },
    {
      label: "등록 개체 수",
      value: data?.totalAnimals.toLocaleString(),
      note: today && `어제보다 +${today.newAnimals.toLocaleString()}`,
    },
    {
      label: "오늘 AI 분석 횟수",
      value: today?.aiAnalyses.toLocaleString(),
      note: data && `최근 ${data.daily.length}일 평균 ${average}`,
    },
    {
      label: "AI 분석 실패율 (오늘)",
      value:
        today &&
        `${(today.aiAnalyses ? (today.aiFailures / today.aiAnalyses) * 100 : 0).toFixed(1)}%`,
      note: today && `실패 ${today.aiFailures}건`,
    },
  ];

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-4 p-2">
      <div className="flex items-center gap-2">
        <h2 className="text-title-lg flex-1">오늘 현황</h2>
        <p className="text-caption text-fg-tertiary">
          {today && `${today.date.replaceAll("-", ".")} 기준 · 10분마다 갱신`}
        </p>
      </div>
      <div className="flex gap-4">
        {cards.map(({ label, value, note }) => (
          <StatCard
            key={label}
            label={label}
            value={value ?? "—"}
            note={note}
          />
        ))}
      </div>
      {isError ? (
        <StatsError />
      ) : (
        data && (
          <div className="flex min-h-0 flex-1 gap-4">
            <AnalysisChart />
            <SpeciesCountPanel />
          </div>
        )
      )}
    </main>
  );
}
