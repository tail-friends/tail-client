import { Suspense } from "react";
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

const base = { spike: false, hidden: false } as const;

// 퍼블리싱용 고정 데이터 (Figma W-3)
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

export default function SpeciesPage({ searchParams }: PageProps<"/species">) {
  return (
    <div className="flex h-screen gap-4 p-4">
      <Sidebar />
      <Suspense>
        <SpeciesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// ?view=search(W-3d) | add(W-3e) | error(W-3b) | edit(W-3a) | saved(W-3f) | failed(W-3h)
// | hide(W-3c) | hidden(W-3g) | shown(W-3i), 없으면 W-3
async function SpeciesContent({
  searchParams,
}: Pick<PageProps<"/species">, "searchParams">) {
  const { view } = await searchParams;
  const searching = view === "search";
  const rows = species.map((s) => ({
    ...s,
    hidden:
      s.name === "콘 스네이크"
        ? view === "hidden"
        : s.name === "킹 스네이크" && view !== "shown",
  }));

  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <TopBar title="종 관리" />
        <main className="flex flex-1 flex-col gap-4 p-2">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <h2 className="text-title-lg">
                {searching ? "종 목록 · 검색 결과 0종" : "종 목록 · 10종"}
              </h2>
              <p className="text-caption text-fg-tertiary mt-0.5">
                저장하면 앱의 종 선택 목록에 바로 반영돼요 · 숨긴 종은 회색으로
                남아요
              </p>
            </div>
            <SpeciesSearch value={searching ? "이구아나" : undefined} />
            <Button>+ 종 추가</Button>
          </div>
          <SpeciesTable
            species={searching ? [] : rows}
            empty={
              <div className="flex flex-1 flex-col items-center justify-center gap-2.5">
                <p className="text-title-lg">
                  &apos;이구아나&apos;와 맞는 종이 없어요
                </p>
                <p className="text-body text-fg-secondary">
                  철자를 확인하거나 새 종으로 추가해 주세요.
                </p>
                <Button>+ 이구아나 종 추가</Button>
              </div>
            }
          />
        </main>
      </div>
      {view === "add" && <SpeciesDrawer title="새 종 추가" />}
      {view === "error" && (
        <SpeciesDrawer
          title="새 종 추가"
          values={{ name: "레오파드 게코", feed: "75", humidity: "120" }}
          errors={{
            name: "같은 이름의 종이 이미 있어요",
            feed: "1~60일 사이로 입력해 주세요",
            humidity: "0~100% 사이로 입력해 주세요",
          }}
        />
      )}
      {(view === "edit" || view === "failed") && (
        <SpeciesDrawer
          title="종 수정 · 레오파드 게코"
          values={{ name: "레오파드 게코", feed: "4" }}
        />
      )}
      {view === "hide" && (
        <HideDialog
          title="콘 스네이크를 숨길까요?"
          message={
            "이 종을 키우는 개체 97마리는 그대로 있어요.\n앱의 새 등록 종 목록에서만 빠지고, 언제든 다시 보이게 할 수 있어요."
          }
        />
      )}
      {view === "saved" && (
        <Toast position="top-[1.65625rem] left-211">
          레오파드 게코를 저장했어요 · 앱 종 목록에 반영됐어요
        </Toast>
      )}
      {view === "failed" && (
        <Toast position="bottom-25 left-[calc(100%-16rem)]">
          저장하지 못했어요 · 입력한 내용은 그대로예요
        </Toast>
      )}
      {view === "hidden" && (
        <Toast position="top-[1.65625rem] left-211">
          콘 스네이크를 숨겼어요 · 앱 새 등록 목록에서 빠졌어요
        </Toast>
      )}
      {view === "shown" && (
        <Toast position="top-[1.65625rem] left-211">
          킹 스네이크를 다시 보이게 했어요
        </Toast>
      )}
    </>
  );
}
