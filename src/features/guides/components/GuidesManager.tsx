"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Toast from "@/components/Toast";
import { sections, type Content, type Guide, type Section } from "../data";
import AppCardPreview from "./AppCardPreview";
import GuideEditor from "./GuideEditor";
import SpeciesList from "./SpeciesList";

// API 연동 전이라 저장한 내용은 화면 안 상태로만 남는다
export default function GuidesManager({ initial }: { initial: Guide[] }) {
  const [guides, setGuides] = useState(initial);
  const [selectedId, setSelectedId] = useState(initial[0].id);
  const [draft, setDraft] = useState<Content>(initial[0].content);
  const [pendingId, setPendingId] = useState<string>();
  const [toast, setToast] = useState<string>();

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(undefined), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const guide = guides.find((g) => g.id === selectedId)!;
  const dirty = sections.some((s) => draft[s] !== guide.content[s]);

  function select(id: string) {
    setSelectedId(id);
    setDraft(guides.find((g) => g.id === id)!.content);
    setPendingId(undefined);
  }

  function save() {
    // sv-SE 형식이 "2026-10-26"이라 점으로만 바꾸면 "2026.10.26"이 된다
    const updatedAt = new Date()
      .toLocaleDateString("sv-SE")
      .replaceAll("-", ".");
    setGuides((list) =>
      list.map((g) =>
        g.id === selectedId ? { ...g, content: draft, updatedAt } : g,
      ),
    );
    setToast(`${guide.name} 가이드를 저장했어요`);
  }

  const pending = guides.find((g) => g.id === pendingId);

  return (
    <div className="flex flex-1 gap-4 p-2">
      <SpeciesList
        guides={guides}
        selectedId={selectedId}
        onSelect={(id) =>
          id === selectedId ? undefined : dirty ? setPendingId(id) : select(id)
        }
      />
      <GuideEditor
        name={guide.name}
        content={draft}
        status={dirty ? "dirty" : guide.updatedAt ? "saved" : "empty"}
        updatedAt={guide.updatedAt}
        onChange={(section: Section, value) =>
          setDraft((d) => ({ ...d, [section]: value }))
        }
        onRevert={() => setDraft(guide.content)}
        onSave={save}
      />
      <AppCardPreview name={guide.name} content={draft} />
      {pending && (
        <Dialog
          title="저장하지 않은 내용이 있어요"
          message={
            <>
              {pending.name}으로 바꾸면 {guide.name} 가이드에서
              <br />
              고친 내용이 사라져요.
            </>
          }
        >
          <Button variant="ghost" onClick={() => setPendingId(undefined)}>
            계속 편집
          </Button>
          <Button variant="danger" onClick={() => select(pending.id)}>
            저장 안 하고 이동
          </Button>
        </Dialog>
      )}
      {toast && (
        <Toast tone="success" position="top-[1.65625rem] left-211">
          {toast}
        </Toast>
      )}
    </div>
  );
}
