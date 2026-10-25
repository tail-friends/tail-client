"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Toast from "@/components/Toast";
import HideDialog from "./HideDialog";
import SpeciesDrawer from "./SpeciesDrawer";
import SpeciesSearch from "./SpeciesSearch";
import SpeciesTable, { type Species } from "./SpeciesTable";

// 추가는 빈 값(이름만 채울 수도 있음), 수정은 고르는 종. 둘 다 같은 드로어를 쓴다
type Editing = { target?: Species; draft: Partial<Species> };

// API 연동 전이라 목록은 화면 안 상태로만 바뀐다
export default function SpeciesManager({ initial }: { initial: Species[] }) {
  const [species, setSpecies] = useState(initial);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Editing>();
  const [hiding, setHiding] = useState<Species>();
  const [toast, setToast] = useState<string>();

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(undefined), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const q = query.trim();
  const rows = q ? species.filter((s) => s.name.includes(q)) : species;

  function replace(target: Species, next: Species) {
    setSpecies((list) => list.map((s) => (s === target ? next : s)));
  }

  function save(next: Species) {
    const { target } = editing!;
    if (target) replace(target, next);
    else setSpecies((list) => [...list, next]);
    setEditing(undefined);
    setToast(`${next.name}을(를) 저장했어요 · 앱 종 목록에 반영됐어요`);
  }

  function toggleHidden(s: Species) {
    if (!s.hidden) return setHiding(s);
    replace(s, { ...s, hidden: false });
    setToast(`${s.name}을(를) 다시 보이게 했어요`);
  }

  function hide() {
    const s = hiding!;
    replace(s, { ...s, hidden: true });
    setHiding(undefined);
    setToast(`${s.name}을(를) 숨겼어요 · 앱 새 등록 목록에서 빠졌어요`);
  }

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-2">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h2 className="text-title-lg">
              {q
                ? `종 목록 · 검색 결과 ${rows.length}종`
                : `종 목록 · ${species.length}종`}
            </h2>
            <p className="text-caption text-fg-tertiary mt-0.5">
              저장하면 앱의 종 선택 목록에 바로 반영돼요 · 숨긴 종은 회색으로
              남아요
            </p>
          </div>
          <SpeciesSearch value={query} onChange={setQuery} />
          <Button onClick={() => setEditing({ draft: {} })}>+ 종 추가</Button>
        </div>
        <SpeciesTable
          species={rows}
          onEdit={(s) => setEditing({ target: s, draft: s })}
          onToggleHidden={toggleHidden}
          empty={
            <div className="flex flex-1 flex-col items-center justify-center gap-2.5">
              <p className="text-title-lg">
                &apos;{q}&apos;와 맞는 종이 없어요
              </p>
              <p className="text-body text-fg-secondary">
                철자를 확인하거나 새 종으로 추가해 주세요.
              </p>
              <Button onClick={() => setEditing({ draft: { name: q } })}>
                + {q} 종 추가
              </Button>
            </div>
          }
        />
      </main>
      {editing && (
        <SpeciesDrawer
          title={
            editing.target ? `종 수정 · ${editing.target.name}` : "새 종 추가"
          }
          species={editing.draft}
          isDuplicate={(name) =>
            species.some((s) => s !== editing.target && s.name === name)
          }
          onSave={save}
          onClose={() => setEditing(undefined)}
        />
      )}
      {hiding && (
        <HideDialog
          title={`${hiding.name}을(를) 숨길까요?`}
          message={
            "이 종을 키우는 개체는 그대로 있어요.\n앱의 새 등록 종 목록에서만 빠지고, 언제든 다시 보이게 할 수 있어요."
          }
          onCancel={() => setHiding(undefined)}
          onConfirm={hide}
        />
      )}
      {toast && <Toast position="top-[1.65625rem] left-211">{toast}</Toast>}
    </>
  );
}
