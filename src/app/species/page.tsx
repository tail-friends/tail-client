"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import TopBar from "@/components/TopBar";
import HideDialog from "@/features/species/components/HideDialog";
import SpeciesDrawer from "@/features/species/components/SpeciesDrawer";
import SpeciesSearch from "@/features/species/components/SpeciesSearch";
import SpeciesTable, {
  type Species,
} from "@/features/species/components/SpeciesTable";
import eulReul, { waGwa } from "@/features/species/eulReul";

const base = {
  spike: false,
  shedDays: null,
  hotZone: null,
  coolZone: null,
  humidity: null,
  hidden: false,
} as const;

// 퍼블리싱용 고정 데이터 (Figma W-3)
const initialSpecies: Species[] = [
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
    animalCount: 97,
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

// Figma W-3 종 관리
export default function SpeciesPage() {
  const [species, setSpecies] = useState(initialSpecies);
  const [query, setQuery] = useState("");
  // 드로어: 없음 · 추가("add") · 수정(종 이름)
  const [drawer, setDrawer] = useState<"add" | string | null>(null);
  const [hiding, setHiding] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const q = query.trim();
  const shown = species.filter((s) => s.name.includes(q));
  const editing = species.find((s) => s.name === drawer);
  const hidingSpecies = species.find((s) => s.name === hiding);

  const save = (saved: Species) => {
    const name = editing?.name;
    setSpecies(
      name
        ? species.map((s) => (s.name === name ? saved : s))
        : [...species, saved],
    );
    setDrawer(null);
    setToast(`${eulReul(saved.name)} 저장했어요 · 앱 종 목록에 반영됐어요`);
  };

  const setHidden = (name: string, hidden: boolean) => {
    setSpecies(species.map((s) => (s.name === name ? { ...s, hidden } : s)));
    setHiding(null);
    setToast(
      hidden
        ? `${eulReul(name)} 숨겼어요 · 앱 새 등록 목록에서 빠졌어요`
        : `${eulReul(name)} 다시 보이게 했어요`,
    );
  };

  return (
    <div className="flex h-screen gap-4 p-4">
      <Sidebar />
      <div className="flex flex-1 flex-col gap-4">
        <TopBar title="종 관리" />
        <main className="flex flex-1 flex-col gap-4 p-2">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <h2 className="text-title-lg">
                {q
                  ? `종 목록 · 검색 결과 ${shown.length}종`
                  : `종 목록 · ${species.length}종`}
              </h2>
              <p className="text-caption text-fg-tertiary mt-0.5">
                저장하면 앱의 종 선택 목록에 바로 반영돼요 · 숨긴 종은 회색으로
                남아요
              </p>
            </div>
            <SpeciesSearch value={query} onChange={setQuery} />
            <Button onClick={() => setDrawer("add")}>+ 종 추가</Button>
          </div>
          <SpeciesTable
            species={shown}
            onEdit={setDrawer}
            onToggleHidden={(name) => {
              const target = species.find((s) => s.name === name);
              if (target?.hidden) setHidden(name, false);
              else setHiding(name);
            }}
            empty={
              <div className="flex flex-1 flex-col items-center justify-center gap-2.5">
                <p className="text-title-lg">
                  &apos;{q}&apos;{waGwa(q)} 맞는 종이 없어요
                </p>
                <p className="text-body text-fg-secondary">
                  철자를 확인하거나 새 종으로 추가해 주세요.
                </p>
                <Button onClick={() => setDrawer("add")}>+ {q} 종 추가</Button>
              </div>
            }
          />
        </main>
      </div>
      {drawer && (
        <SpeciesDrawer
          key={drawer}
          species={editing}
          names={species.map((s) => s.name)}
          onSave={save}
          onClose={() => setDrawer(null)}
        />
      )}
      {hidingSpecies && (
        <HideDialog
          name={hidingSpecies.name}
          animalCount={hidingSpecies.animalCount}
          onConfirm={() => setHidden(hidingSpecies.name, true)}
          onCancel={() => setHiding(null)}
        />
      )}
      {toast && <Toast position="top-[1.65625rem] left-1/2">{toast}</Toast>}
    </div>
  );
}
