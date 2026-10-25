import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import SpeciesManager from "@/features/species/components/SpeciesManager";
import type { Species } from "@/features/species/components/SpeciesTable";

const base = { spike: false, hidden: false } as const;

// 퍼블리싱용 고정 데이터 (Figma W-3). API 연동 전까지 초기값으로만 쓴다
const species: Species[] = [
  { ...base, name: "레오파드 게코", feedDays: 4, shape: "gecko", home: "사막" },
  {
    ...base,
    name: "크레스티드 게코",
    feedDays: 3,
    shape: "gecko",
    home: "열대우림",
  },
  {
    ...base,
    name: "가고일 게코",
    feedDays: 3,
    shape: "gecko",
    home: "열대우림",
  },
  {
    ...base,
    name: "비어디드 드래곤",
    feedDays: 2,
    shape: "lizard",
    home: "사막",
    spike: true,
  },
  {
    ...base,
    name: "블루텅 스킨크",
    feedDays: 5,
    shape: "lizard",
    home: "사막",
  },
  {
    ...base,
    name: "볼 파이톤",
    feedDays: 10,
    shape: "snake",
    home: "바위 협곡",
  },
  {
    ...base,
    name: "콘 스네이크",
    feedDays: 7,
    shape: "snake",
    home: "바위 협곡",
  },
  {
    ...base,
    name: "호그노즈 스네이크",
    feedDays: 7,
    shape: "snake",
    home: "바위 협곡",
  },
  {
    ...base,
    name: "킹 스네이크",
    feedDays: 7,
    shape: "snake",
    home: "바위 협곡",
    hidden: true,
  },
  { ...base, name: "육지 거북", feedDays: 1, shape: "turtle", home: "물가" },
];

export default function SpeciesPage() {
  return (
    <div className="flex h-screen gap-4 p-4">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <TopBar title="종 관리" />
        <SpeciesManager initial={species} />
      </div>
    </div>
  );
}
