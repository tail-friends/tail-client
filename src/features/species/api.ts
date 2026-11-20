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
const homeKeys: Record<Species["home"], string> = {
  사막: "desert",
  열대우림: "forest",
  "바위 협곡": "rock",
  밤: "night",
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
    home: homes.find((h) => homeKeys[h] === r.defaultHome)!,
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
