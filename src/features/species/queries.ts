import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSpecies, saveSpecies, setHidden } from "./api";
import type { Species } from "./components/SpeciesTable";

export const speciesKey = ["admin", "species"];

export const useSpecies = () =>
  useQuery({
    queryKey: speciesKey,
    queryFn: getSpecies,
    // 대시보드(useStats)처럼 실패하면 기다리지 않고 바로 실패로 둔다
    retry: false,
  });

// 서버가 저장한 종으로 목록 캐시를 바꾼다. 처음 보는 id면 새로 추가한 종이라 끝에 붙인다
export function useSaveSpecies() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      species,
    }: {
      id?: number;
      species: Omit<Species, "id">;
    }) => saveSpecies(id, species),
    onSuccess: (saved) =>
      queryClient.setQueryData<Species[]>(speciesKey, (list) =>
        list?.some((s) => s.id === saved.id)
          ? list.map((s) => (s.id === saved.id ? saved : s))
          : list && [...list, saved],
      ),
  });
}

export function useSetHidden() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, hidden }: { id: number; hidden: boolean }) =>
      setHidden(id, hidden),
    onSuccess: (_, { id, hidden }) =>
      queryClient.setQueryData<Species[]>(speciesKey, (list) =>
        list?.map((s) => (s.id === id ? { ...s, hidden } : s)),
      ),
  });
}
