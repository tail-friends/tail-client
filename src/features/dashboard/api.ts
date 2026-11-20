import { useQuery } from "@tanstack/react-query";
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
};

export function useStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () =>
      (await api.get<{ data: Stats }>("/admin/stats", { params: { days: 30 } }))
        .data.data,
    // 화면 문구("10분마다 갱신")와 맞춘다
    refetchInterval: 10 * 60 * 1000,
  });
}
