import { useQuery } from "@tanstack/react-query";
import { getStats } from "./api";

export const useStats = () =>
  useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getStats,
    // 실패하면 기다리지 않고 바로 오류 화면을 띄운다. 다시 시도는 화면의 버튼으로 한다
    retry: false,
    // 화면 문구("10분마다 갱신")와 맞춘다
    refetchInterval: 10 * 60 * 1000,
  });
