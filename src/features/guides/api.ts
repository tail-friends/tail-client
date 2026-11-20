import { api } from "@/lib/api";
import type { Guide, Section } from "./data";

type GuideResponse = {
  speciesId: number;
  name: string;
  sections: { key: string; title: Section; body: string; updatedAt: string }[];
};

// 서버 응답은 { success, data, error } 로 한 번 감싸져 있다
async function get<T>(url: string) {
  return (await api.get<{ data: T }>(url)).data.data;
}

function toGuide({ speciesId, name, sections }: GuideResponse): Guide {
  const content = { 습성: "", 먹이: "", 환경: "", 건강: "" };
  for (const s of sections) content[s.title] = s.body;
  // 섹션마다 수정 날짜가 있어 가장 최근 날짜를 쓴다. "2026-10-21" → "2026.10.21"
  const latest = sections
    .map((s) => s.updatedAt)
    .sort()
    .at(-1);
  return {
    id: speciesId,
    name,
    content,
    updatedAt: latest?.replaceAll("-", "."),
  };
}

// shortcut: 목록에 수정 날짜가 없어 종마다 가이드를 따로 불러온다, 종이 많아지면 서버에 목록용 API 요청
// 로그인 연동(#23) 전이라 로그인 없이 되는 조회 API를 쓴다. 숨긴 종은 빠진다
export async function fetchGuides() {
  const { species } = await get<{ species: { id: number }[] }>("/species");
  const guides = await Promise.all(
    species.map(({ id }) => get<GuideResponse>(`/species/${id}/guide`)),
  );
  return guides.map(toGuide);
}
