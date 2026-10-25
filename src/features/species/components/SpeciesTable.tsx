import Chip from "@/components/Chip";

export type Species = {
  name: string;
  feedDays: number;
  shape: "gecko" | "lizard" | "snake" | "turtle";
  spike: "등·턱" | null;
  home: "사막" | "열대우림" | "바위 협곡" | "물가";
  shedDays: number | null;
  env: string | null;
  hidden: boolean;
};

// Figma W-3 table. 칸 너비는 Figma 값 그대로 (190 · 90 · 150 · 60 · 110 · 90 · 230 · 80 · 100px)
const columns = [
  { label: "종 이름", width: "w-47.5" },
  { label: "급여 주기", width: "w-22.5" },
  { label: "체형", width: "w-37.5" },
  { label: "가시", width: "w-15" },
  { label: "기본 사육장", width: "w-27.5" },
  { label: "탈피 주기", width: "w-22.5" },
  { label: "온습도 (핫존 · 쿨존 · 습도)", width: "w-57.5" },
  { label: "상태", width: "w-20" },
  { label: "", width: "w-25" },
];

function Cell({
  width,
  muted,
  children,
}: {
  width: string;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`text-body flex h-5 items-center ${width} ${muted ? "text-fg-tertiary" : ""}`}
    >
      {children}
    </div>
  );
}

export default function SpeciesTable({
  species,
  empty,
  onEdit,
  onToggleHidden,
}: {
  species: Species[];
  empty: React.ReactNode;
  onEdit: (name: string) => void;
  onToggleHidden: (name: string) => void;
}) {
  return (
    <div className="glass flex flex-1 flex-col rounded-xl [--glass-from:0.78] [--glass-to:0.4] px-5.5 py-2">
      <div className="border-line flex items-center border-b py-3">
        {columns.map(({ label, width }, i) => (
          <div
            key={i}
            className={`text-label text-fg-tertiary h-4 ${width}`}
          >
            {label}
          </div>
        ))}
      </div>
      {species.length === 0
        ? empty
        : species.map((s) => (
            <div
              key={s.name}
              className={`border-line flex items-center border-b py-3 ${s.hidden ? "opacity-50" : ""}`}
            >
              <Cell width="w-47.5">{s.name}</Cell>
              <Cell width="w-22.5">{s.feedDays}일</Cell>
              <Cell width="w-37.5">{s.shape}</Cell>
              <Cell width="w-15">{s.spike ?? "—"}</Cell>
              <Cell width="w-27.5">{s.home}</Cell>
              <Cell width="w-22.5" muted={s.shedDays === null}>
                {s.shedDays === null ? "미입력" : `${s.shedDays}일`}
              </Cell>
              <Cell width="w-57.5" muted={s.env === null}>
                {s.env ?? "미입력"}
              </Cell>
              <Cell width="w-20">
                <Chip tone={s.hidden ? "muted" : "success"}>
                  {s.hidden ? "숨김" : "노출"}
                </Chip>
              </Cell>
              <div className="text-label flex h-5 w-25 items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(s.name)}
                  className="text-primary cursor-pointer"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => onToggleHidden(s.name)}
                  className="text-fg-tertiary cursor-pointer"
                >
                  {s.hidden ? "다시 보이기" : "숨기기"}
                </button>
              </div>
            </div>
          ))}
    </div>
  );
}
