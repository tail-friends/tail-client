import { useQuery } from "@tanstack/react-query";
import { getMe } from "./api";

// 401이면 api.ts가 재발급하거나 로그인 화면으로 보내므로 다시 시도하지 않는다
export const useMe = () =>
  useQuery({ queryKey: ["me"], queryFn: getMe, retry: false });
