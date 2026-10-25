"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Toast from "@/components/Toast";
import { initialGuides, sections, type Section } from "../data";
import AppCardPreview from "./AppCardPreview";
import GuideEditor from "./GuideEditor";
import SpeciesList from "./SpeciesList";

// "~로 / ~으로". 받침이 있으면 "으로", ㄹ 받침과 받침 없음은 "로"
function withRo(word: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  const jong = code % 28;
  return jong === 0 || jong === 8 ? `${word}로` : `${word}으로`;
}

function today() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

// Figma W-4. 서버 연결 전이라 저장은 화면 안에서만 바뀐다
export default function GuidesView() {
  const [guides, setGuides] = useState(initialGuides);
  const [selectedId, setSelectedId] = useState(guides[0].id);
  const [draft, setDraft] = useState(guides[0].content);
  const [pendingId, setPendingId] = useState<string>();
  const [saved, setSaved] = useState(false);

  const selected = guides.find((g) => g.id === selectedId)!;
  const pending = guides.find((g) => g.id === pendingId);
  const dirty = sections.some((s) => draft[s] !== selected.content[s]);
  const status = dirty ? "dirty" : selected.updatedAt ? "saved" : "empty";

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(timer);
  }, [saved]);

  function select(id: string) {
    if (id === selectedId) return;
    if (dirty) return setPendingId(id);
    setSelectedId(id);
    setDraft(guides.find((g) => g.id === id)!.content);
  }

  function save() {
    setGuides((all) =>
      all.map((g) =>
        g.id === selectedId ? { ...g, content: draft, updatedAt: today() } : g,
      ),
    );
    setSaved(true);
  }

  return (
    <div className="flex flex-1 gap-4 p-2">
      <SpeciesList guides={guides} selectedId={selectedId} onSelect={select} />
      <GuideEditor
        name={selected.name}
        content={draft}
        status={status}
        updatedAt={selected.updatedAt}
        dirty={dirty}
        onChange={(section: Section, value) =>
          setDraft((d) => ({ ...d, [section]: value }))
        }
        onReset={() => setDraft(selected.content)}
        onSave={save}
      />
      <AppCardPreview name={selected.name} content={draft} />
      {pending && (
        <Dialog
          title="저장하지 않은 내용이 있어요"
          message={
            <>
              {withRo(pending.name)} 바꾸면 {selected.name} 가이드에서
              <br />
              고친 내용이 사라져요.
            </>
          }
        >
          <Button variant="ghost" onClick={() => setPendingId(undefined)}>
            계속 편집
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setSelectedId(pending.id);
              setDraft(pending.content);
              setPendingId(undefined);
            }}
          >
            저장 안 하고 이동
          </Button>
        </Dialog>
      )}
      {saved && (
        <Toast tone="success" position="top">
          {selected.name} 가이드를 저장했어요
        </Toast>
      )}
    </div>
  );
}
