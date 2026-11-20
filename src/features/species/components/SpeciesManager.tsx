"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Toast from "@/components/Toast";
import { inputError } from "../api";
import { useSaveSpecies, useSetHidden, useSpecies } from "../queries";
import HideDialog from "./HideDialog";
import SpeciesDrawer from "./SpeciesDrawer";
import SpeciesSearch from "./SpeciesSearch";
import SpeciesTable, { type Species } from "./SpeciesTable";

// 추가는 빈 값(이름만 채울 수도 있음), 수정은 고르는 종. 둘 다 같은 드로어를 쓴다.
// error는 저장할 때 서버가 돌려준 입력 오류
type Editing = { target?: Species; draft: Partial<Species>; error?: string };

export default function SpeciesManager() {
  const { data: species } = useSpecies();
  const { mutateAsync: saveSpecies, isPending: saving } = useSaveSpecies();
  const { mutateAsync: setHidden, isPending: hiddenPending } = useSetHidden();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Editing>();
  const [hiding, setHiding] = useState<Species>();
  const [toast, setToast] = useState<{
    tone: "success" | "error";
    text: string;
  }>();

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(undefined), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  // shortcut: 불러오는 중·실패 화면은 시안이 없어 비워 둔다 (가이드 화면과 같음), 시안 나오면 추가
  if (!species) return null;

  const q = query.trim();
  const rows = q ? species.filter((s) => s.name.includes(q)) : species;

  async function save(next: Omit<Species, "id">) {
    // 저장 중에 다시 누르면 요청이 두 번 가지 않게 막는다
    if (saving) return;
    const current = editing!;
    try {
      await saveSpecies({ id: current.target?.id, species: next });
    } catch (e) {
      // 어느 쪽이든 드로어를 닫지 않아 입력한 내용이 그대로 남는다
      const error = inputError(e);
      if (error) return setEditing({ ...current, error });
      return setToast({
        tone: "error",
        text: "저장하지 못했어요 · 입력한 내용은 그대로예요",
      });
    }
    setEditing(undefined);
    setToast({
      tone: "success",
      text: `${next.name}을(를) 저장했어요 · 앱 종 목록에 반영됐어요`,
    });
  }

  // 숨기기는 확인창을 거치고, 다시 보이기는 바로 저장한다
  async function changeHidden(s: Species, hidden: boolean, done: string) {
    if (hiddenPending) return;
    try {
      await setHidden({ id: s.id, hidden });
    } catch {
      // 확인창은 닫지 않아 바로 다시 시도할 수 있다
      return setToast({
        tone: "error",
        text: "저장하지 못했어요 · 다시 시도해 주세요",
      });
    }
    setHiding(undefined);
    setToast({ tone: "success", text: done });
  }

  function toggleHidden(s: Species) {
    if (!s.hidden) return setHiding(s);
    changeHidden(s, false, `${s.name}을(를) 다시 보이게 했어요`);
  }

  function hide() {
    const s = hiding!;
    changeHidden(
      s,
      true,
      `${s.name}을(를) 숨겼어요 · 앱 새 등록 목록에서 빠졌어요`,
    );
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
          error={editing.error}
          isDuplicate={(name) =>
            species.some((s) => s.id !== editing.target?.id && s.name === name)
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
      {toast && (
        // 실패 토스트는 드로어가 열린 채 뜨므로 딤·드로어 위로 올린다
        <Toast
          tone={toast.tone}
          position="top-[1.65625rem] left-211"
          className="z-30"
        >
          {toast.text}
        </Toast>
      )}
    </>
  );
}
