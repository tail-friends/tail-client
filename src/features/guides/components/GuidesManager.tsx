"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Toast from "@/components/Toast";
import { sections, type Content, type Guide, type Section } from "../data";
import { useGuides, useSaveGuide } from "../queries";
import AppCardPreview from "./AppCardPreview";
import GuideEditor from "./GuideEditor";
import SpeciesList from "./SpeciesList";

export default function GuidesManager() {
  const { data } = useGuides();
  // shortcut: 불러오는 중·실패 화면은 시안이 없어 비워 둔다, 시안 나오면 추가
  return data?.length ? <Editor guides={data} /> : null;
}

// 목록은 쿼리 캐시 값을 그대로 쓰고, 고치는 중인 내용만 draft로 따로 둔다
function Editor({ guides }: { guides: Guide[] }) {
  const { mutateAsync, isPending } = useSaveGuide();
  const [selectedId, setSelectedId] = useState(guides[0].id);
  const [draft, setDraft] = useState<Content>(guides[0].content);
  const [pendingId, setPendingId] = useState<number>();
  const [toast, setToast] = useState<{
    tone: "success" | "error";
    text: string;
  }>();

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(undefined), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const guide = guides.find((g) => g.id === selectedId)!;
  const dirty = sections.some((s) => draft[s] !== guide.content[s]);

  function select(id: number) {
    setSelectedId(id);
    setDraft(guides.find((g) => g.id === id)!.content);
    setPendingId(undefined);
  }

  async function save() {
    // 저장 중에 다시 누르면 요청이 두 번 가지 않게 막는다
    if (isPending) return;
    // 수정 날짜와 내용은 서버가 저장한 값으로 맞춘다 (useSaveGuide가 캐시를 바꾼다)
    try {
      await mutateAsync({ id: selectedId, content: draft });
      setToast({ tone: "success", text: `${guide.name} 가이드를 저장했어요` });
    } catch {
      // draft는 건드리지 않아 고친 내용이 그대로 남는다
      setToast({
        tone: "error",
        text: "저장하지 못했어요 · 고친 내용은 그대로예요",
      });
    }
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
        <Toast tone={toast.tone} position="top-[1.65625rem] left-211">
          {toast.text}
        </Toast>
      )}
    </div>
  );
}
