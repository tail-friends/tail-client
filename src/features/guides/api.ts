import { api } from "@/lib/api";
import { sections, type Content, type Guide, type Section } from "./data";

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
// 숨긴 종도 이미 등록된 개체가 있으면 가이드가 보이므로 관리자 목록으로 숨긴 종까지 불러온다
export async function fetchGuides() {
  const { species } = await get<{ species: { id: number }[] }>(
    "/admin/species",
  );
  const guides = await Promise.all(
    species.map(({ id }) => get<GuideResponse>(`/species/${id}/guide`)),
  );
  return guides.map(toGuide);
}

const keys: Record<Section, string> = {
  습성: "HABIT",
  먹이: "FEED",
  환경: "ENV",
  건강: "HEALTH",
};

// 보낸 섹션으로 가이드 전체가 바뀐다. 빈 칸은 보내지 않아 서버에서 지워진다
export async function saveGuide(id: number, content: Content) {
  const body = {
    sections: sections
      .filter((s) => content[s].trim())
      .map((s) => ({ key: keys[s], body: content[s] })),
  };
  const res = await api.put<{ data: GuideResponse }>(
    `/admin/species/${id}/guide`,
    body,
  );
  return toGuide(res.data.data);
}
