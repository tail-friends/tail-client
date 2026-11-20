import { api } from "@/lib/api";
import { sections, type Content, type Guide, type Section } from "./data";

type GuideResponse = {
  speciesId: number;
  name: string;
  sections: { key: string; body: string; updatedAt: string }[];
};

// 서버 섹션 키. 읽을 때와 저장할 때 모두 이 표로 칸을 찾는다
const sectionKeys: Record<Section, string> = {
  습성: "HABIT",
  먹이: "FEED",
  환경: "ENV",
  건강: "HEALTH",
};

// 서버 응답은 { success, data, error } 로 한 번 감싸져 있다
async function getData<T>(url: string) {
  return (await api.get<{ data: T }>(url)).data.data;
}

function toGuide({
  speciesId,
  name,
  sections: guideSections,
}: GuideResponse): Guide {
  const content = Object.fromEntries(sections.map((s) => [s, ""])) as Content;
  for (const { key, body } of guideSections) {
    const section = sections.find((s) => sectionKeys[s] === key);
    if (section) content[section] = body;
  }
  // 섹션마다 수정 날짜가 있어 가장 최근 날짜를 쓴다. "2026-10-21" → "2026.10.21"
  const latest = guideSections
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
  const { species } = await getData<{ species: { id: number }[] }>(
    "/admin/species",
  );
  const guides = await Promise.all(
    species.map(({ id }) => getData<GuideResponse>(`/species/${id}/guide`)),
  );
  return guides.map(toGuide);
}

// 보낸 섹션으로 가이드 전체가 바뀐다. 빈 칸은 보내지 않아 서버에서 지워진다
export async function saveGuide(id: number, content: Content) {
  const body = {
    sections: sections
      .filter((s) => content[s].trim())
      .map((s) => ({ key: sectionKeys[s], body: content[s] })),
  };
  const res = await api.put<{ data: GuideResponse }>(
    `/admin/species/${id}/guide`,
    body,
  );
  return toGuide(res.data.data);
}
