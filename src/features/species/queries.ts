import { useQuery } from "@tanstack/react-query";
import { getSpecies } from "./api";

export const speciesKey = ["admin", "species"];

export const useSpecies = () =>
  useQuery({
    queryKey: speciesKey,
    queryFn: getSpecies,
    // 대시보드(useStats)처럼 실패하면 기다리지 않고 바로 실패로 둔다
    retry: false,
  });
