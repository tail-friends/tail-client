import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGuides, saveGuide } from "./api";
import type { Content, Guide } from "./data";

export const useGuides = () =>
  useQuery({ queryKey: ["guides"], queryFn: fetchGuides });

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
