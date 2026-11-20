import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGuides, saveGuide } from "./api";
import type { Content, Guide } from "./data";

export const useGuides = () =>
  useQuery({
    queryKey: ["guides"],
    queryFn: fetchGuides,
    // 대시보드(useStats)처럼 실패하면 기다리지 않고 바로 실패로 둔다.
    // 다시 시도하면 종 수만큼 요청이 또 나가는 것도 막는다
    retry: false,
  });

// 저장한 가이드를 목록 캐시에도 넣어, 다른 화면에 갔다 와도 저장한 내용이 보이게 한다
export function useSaveGuide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: number; content: Content }) =>
      saveGuide(id, content),
    onSuccess: (saved) =>
      queryClient.setQueryData<Guide[]>(["guides"], (list) =>
        list?.map((g) => (g.id === saved.id ? saved : g)),
      ),
  });
}
