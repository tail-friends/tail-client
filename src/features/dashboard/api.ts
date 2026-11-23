import { api } from "@/lib/api";

// GET /api/v1/admin/stats 응답 (tail-server AdminStatsResponse). daily는 날짜(KST) 오름차순, 마지막이 오늘
export type Stats = {
  totalUsers: number;
  totalAnimals: number;
  daily: {
    date: string;
    newUsers: number;
    newAnimals: number;
    aiAnalyses: number;
    aiFailures: number;
  }[];
  // 개체 많은 순으로 정렬되어 옴. 직접 입력한 종은 speciesId null, name "직접 입력"
  speciesCounts: { speciesId: number | null; name: string; count: number }[];
};

export async function getStats() {
  const { data } = await api.get<{ data: Stats }>("/admin/stats", {
    params: { days: 30 },
  });
  return data.data;
}
