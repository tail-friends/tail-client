import { isAxiosError } from "axios";
import { api } from "@/lib/api";
import { homes, type Species } from "./components/SpeciesTable";

type Range = { min: number | null; max: number | null } | null;

// GET /api/v1/admin/species 의 종 하나 (tail-server AdminSpeciesResponse). 화면에서 안 쓰는 필드는 뺐다
type SpeciesResponse = {
  id: number;
  name: string;
  shape: Species["shape"];
  spiky: boolean;
  feedIntervalDays: number;
  shedIntervalDays: number | null;
  envRange: { hot: Range; cool: Range; humidity: Range };
  defaultHome: string;
  hidden: boolean;
};

// 서버 사육장 키(소문자로 내려온다). 읽을 때와 저장할 때 모두 이 표로 바꾼다
const homeKeys: Record<NonNullable<Species["home"]>, string> = {
  사막: "desert",
  열대우림: "forest",
  "바위 협곡": "rock",
  달밤: "night",
  물가: "pond",
};

const value = (n: number | null | undefined) => n ?? undefined;

function toSpecies(r: SpeciesResponse): Species {
  const { hot, cool, humidity } = r.envRange;
  return {
    id: r.id,
    name: r.name,
    feedDays: r.feedIntervalDays,
    shape: r.shape,
    spike: r.spiky,
    home: homes.find((h) => homeKeys[h] === r.defaultHome),
    hidden: r.hidden,
    moltDays: value(r.shedIntervalDays),
    hotMin: value(hot?.min),
    hotMax: value(hot?.max),
    coolMin: value(cool?.min),
    coolMax: value(cool?.max),
    humidityMin: value(humidity?.min),
    humidityMax: value(humidity?.max),
  };
}

// 숨긴 종까지 모두 온다. 서버 응답은 { success, data, error } 로 한 번 감싸져 있다
export async function getSpecies() {
  const { data } = await api.get<{ data: { species: SpeciesResponse[] } }>(
    "/admin/species",
  );
  return data.data.species.map(toSpecies);
}

// 숨김은 따로 바꾸므로(setHidden) 보내지 않는다. 빈 값은 JSON에서 빠져, 수정할 때 서버 값이 그대로 남는다
function toRequest(s: Omit<Species, "id">) {
  return {
    name: s.name,
    shape: s.shape,
    spiky: s.spike,
    feedIntervalDays: s.feedDays,
    shedIntervalDays: s.moltDays,
    hotMin: s.hotMin,
    hotMax: s.hotMax,
    coolMin: s.coolMin,
    coolMax: s.coolMax,
    humidityMin: s.humidityMin,
    humidityMax: s.humidityMax,
    defaultHome: s.home && homeKeys[s.home],
  };
}

// id가 없으면 추가(POST), 있으면 수정(PATCH). 서버가 저장한 종을 돌려준다
export async function saveSpecies(
  id: number | undefined,
  species: Omit<Species, "id">,
) {
  const body = toRequest(species);
  const { data } = await (id === undefined
    ? api.post<{ data: SpeciesResponse }>("/admin/species", body)
    : api.patch<{ data: SpeciesResponse }>(`/admin/species/${id}`, body));
  return toSpecies(data.data);
}

// 숨기기는 DELETE(삭제 대신 숨김, 204), 다시 보이기는 PATCH hidden=false
export async function setHidden(id: number, hidden: boolean) {
  await (hidden
    ? api.delete(`/admin/species/${id}`)
    : api.patch(`/admin/species/${id}`, { hidden: false }));
}

// 이름 중복 같은 입력 오류(400)면 서버 안내문을, 아니면 undefined
export function inputError(error: unknown) {
  if (!isAxiosError(error) || error.response?.status !== 400) return;
  return error.response.data?.error?.message as string | undefined;
}
