import { useQuery } from "@tanstack/react-query";
import { getStats } from "./api";

export const useStats = () =>
  useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getStats,
    // 화면 문구("10분마다 갱신")와 맞춘다
    refetchInterval: 10 * 60 * 1000,
  });
